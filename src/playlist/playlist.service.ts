import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { Repository } from 'typeorm';
import { PlaylistCreateBodyDto } from './dto/body/playlist-create.body.dto';
import { RecommendPlaylistEntity } from '../entitys/like/playlist.entity';
import { SongsService } from '../songs/songs.service';
import { FindPlaylistRecommendedResponseDto } from './dto/response/find-playlist-recommended.response.dto';
import { PlaylistGetDetailResponseDto } from './dto/response/playlist-get-detail.response.dto';
import { UserPlaylistsEntity } from '../entitys/user/user-playlists.entity';
import { PlaylistEditDto } from './dto/playlist-edit.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { moment } from '../utils/moment.utils';
import { Cache } from 'cache-manager';
import { ImageService } from 'src/image/image.service';
import { FindAllPlaylistRecommendedResponseDto } from './dto/response/find-all-playlist-recommended.response.dto';
import { PlaylistAddSongsResponseDto } from './dto/response/playlist-add-songs.response.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectQueue('playlist')
    private playlistQueue: Queue,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @Inject(SongsService)
    private readonly songsService: SongsService,
    private readonly imageService: ImageService,

    @InjectRepository(PlaylistEntity, 'user')
    private readonly playlistRepository: Repository<PlaylistEntity>,
    @InjectRepository(RecommendPlaylistEntity, 'like')
    private readonly recommendRepository: Repository<RecommendPlaylistEntity>,
    @InjectRepository(UserPlaylistsEntity, 'user')
    private readonly userPlaylistRepository: Repository<UserPlaylistsEntity>,
  ) {}

  async findAll(): Promise<Array<PlaylistEntity>> {
    const start = Date.now();
    const all_playlist = await this.playlistRepository.find({
      where: {},
    });
    const end = Date.now();
    console.log(`findAll ${end - start}`);

    return all_playlist;
  }

  async findOne(id: string): Promise<PlaylistEntity> {
    return await this.playlistRepository.findOne({
      where: {
        key: id,
      },
    });
  }

  async getDetail(key: string): Promise<PlaylistGetDetailResponseDto> {
    const playlist = await this.findOne(key);
    if (!playlist) return null;

    const songs = await this.songsService.findByIds(playlist.songlist);
    delete playlist.songlist;
    delete playlist.id;

    const image_version = await this.imageService.getPlaylistImageVersion(
      playlist.image,
    );

    return {
      ...playlist,
      songs: songs,
      image_version: image_version.default,
    };
  }

  async findAllPlaylistRecommended(): Promise<
    Array<FindAllPlaylistRecommendedResponseDto>
  > {
    const playlists = await this.recommendRepository.find({
      where: {
        public: true,
      },
      select: ['id', 'title', 'public'],
    });

    const result = await Promise.all(
      playlists.map(async (playlist) => {
        const version =
          await this.imageService.getRecommendedPlaylistImageVersion(
            playlist.id,
          );

        return {
          ...playlist,
          image_round_version: version.round,
        };
      }),
    );

    return result;
  }

  async findPlaylistRecommended(
    key: string,
  ): Promise<FindPlaylistRecommendedResponseDto> {
    const playlist = await this.recommendRepository.findOne({
      where: {
        id: key,
        public: true,
      },
    });
    if (!playlist) throw new BadRequestException('playlist not exist');

    const image_version =
      await this.imageService.getRecommendedPlaylistImageVersion(playlist.id);

    return {
      id: playlist.id,
      title: playlist.title,
      songs: await this.songsService.findByIds(playlist.song_ids),
      public: playlist.public,
      image_square_version: image_version.square,
    };
  }

  async findOneByKeyAndClientId(
    key: string,
    clientId: string,
  ): Promise<PlaylistEntity> {
    return await this.playlistRepository.findOne({
      where: {
        key: key,
        creator_id: clientId,
      },
    });
  }

  async findByClientId(clientId: string): Promise<Array<PlaylistEntity>> {
    return await this.playlistRepository.find({
      where: {
        creator_id: clientId,
      },
    });
  }

  async create(
    id: string,
    body: PlaylistCreateBodyDto,
  ): Promise<PlaylistEntity> {
    const limit = 20;
    let key: string;
    for (let i = 0; i <= limit; i++) {
      key = this.createKey();
      const duplicateCheck = await this.findOne(key);
      if (!duplicateCheck) {
        break;
      }
      if (i == limit) return null;
    }

    const newPlaylist = this.playlistRepository.create();

    newPlaylist.key = key;
    newPlaylist.title = body.title;
    newPlaylist.creator_id = id;
    newPlaylist.image = body.image;
    newPlaylist.songlist = body.songlist || [];

    const result = await this.playlistRepository.save(newPlaylist);

    await this.addPlaylistToUserPlaylists(id, result.key);

    return result;
  }

  async addSongsToPlaylist(
    user_id: string,
    key: string,
    song_ids: Array<string>,
  ): Promise<PlaylistAddSongsResponseDto> {
    const playlist = await this.findOneByKeyAndClientId(key, user_id);
    if (!playlist) throw new BadRequestException('invaild playlist');

    const check_song_ids = await this.songsService.checkSongs(song_ids);
    if (!check_song_ids) throw new BadRequestException('invaild song ids');

    let added_songs_length = 0;
    let duplicated = false;

    for (const song_id of song_ids) {
      if (playlist.songlist.includes(song_id)) {
        if (!duplicated) duplicated = true;
        continue;
      }

      playlist.songlist.push(song_id);
      added_songs_length += 1;
    }
    if (added_songs_length == 0)
      throw new BadRequestException('no songs added');

    await this.playlistRepository.save(playlist);

    await this.cacheManager.del(`/api/playlist/${key}/detail`);
    await this.cacheManager.del(`(${user_id}) /api/user/playlists`);

    return {
      status: 200,
      added_songs_length: added_songs_length,
      duplicated: duplicated,
    };
  }

  async removeSongsToPlaylist(
    user_id: string,
    key: string,
    song_ids: Array<string>,
  ): Promise<void> {
    const playlist = await this.findOneByKeyAndClientId(key, user_id);
    if (!playlist) throw new BadRequestException('invaild playlist');

    for (const song_id of song_ids) {
      if (!playlist.songlist.includes(song_id))
        throw new BadRequestException('song not exist');

      const song_idx = playlist.songlist.indexOf(song_id);
      if (song_idx <= -1) throw new BadRequestException('song not exist');

      playlist.songlist.splice(song_idx, 1);
    }

    await this.playlistRepository.save(playlist);

    await this.cacheManager.del(`/api/playlist/${key}/detail`);
    await this.cacheManager.del(`(${user_id}) /api/user/playlists`);
  }

  async edit(
    id: string,
    key: string,
    body: PlaylistEditDto,
  ): Promise<PlaylistEntity> {
    const currentPlaylist = await this.findOneByKeyAndClientId(key, id);
    if (!currentPlaylist)
      throw new NotFoundException('플레이리스트가 없습니다.');

    if (body.title) currentPlaylist.title = body.title;

    if (body.songs) {
      await this.songsService.validateSongs(
        currentPlaylist.songlist,
        body.songs,
      );
      currentPlaylist.songlist = body.songs;
    }

    const editPlaylist = await this.playlistRepository.save(currentPlaylist);

    await this.cacheManager.del(`/api/playlist/${key}/detail`);

    return editPlaylist;
  }

  async delete(key: string, clientId: string): Promise<PlaylistEntity> {
    const playlist = await this.findOneByKeyAndClientId(key, clientId);

    if (!playlist) throw new NotFoundException('playlist not found');

    const deleted_playlist = await this.playlistRepository.remove(playlist);

    await this.cacheManager.del(`/api/playlist/${key}/detail`);

    return deleted_playlist;
  }

  async addToMyPlaylist(
    key: string,
    creatorId: string,
  ): Promise<PlaylistEntity> {
    const playlist = await this.findOne(key);
    if (!playlist) throw new NotFoundException();
    if (playlist.creator_id == creatorId)
      throw new BadRequestException(
        '개인의 플레이리스트는 추가할 수 없습니다.',
      );
    const new_playlist = await this.create(creatorId, playlist);

    await this.playlistQueue.add(
      'add_to_my_playlist',
      {
        playlist_key: playlist.key,
        new_playlist_key: new_playlist.key,
        datetime: moment().valueOf(),
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    return new_playlist;
  }

  private createKey(num = 10) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < num; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  async findUserPlaylistsByUserId(id: string): Promise<UserPlaylistsEntity> {
    let userPlaylists = await this.userPlaylistRepository.findOne({
      where: {
        user_id: id,
      },
    });
    if (!userPlaylists) userPlaylists = await this.createUserPlaylists(id);

    return userPlaylists;
  }

  async createUserPlaylists(id: string): Promise<UserPlaylistsEntity> {
    const new_user_playlists = this.userPlaylistRepository.create();
    new_user_playlists.user_id = id;
    new_user_playlists.playlists = (await this.findByClientId(id)).map(
      (playlist) => playlist.key,
    );

    return await this.userPlaylistRepository.save(new_user_playlists);
  }

  async addPlaylistToUserPlaylists(
    id: string,
    playlist: string | Array<string>,
  ): Promise<void> {
    const user_playlists = await this.findUserPlaylistsByUserId(id);

    if (Array.isArray(playlist)) {
      for (const el of playlist) {
        if (user_playlists.playlists.includes(el))
          throw new BadRequestException(
            '이미 추가되어있는 플레이리스트 입니다.',
          );
      }
      user_playlists.playlists.push(...playlist);
    } else {
      if (user_playlists.playlists.includes(playlist))
        throw new BadRequestException('이미 추가되어있는 플레이리스트 입니다.');
      user_playlists.playlists.push(playlist);
    }

    await this.userPlaylistRepository.save(user_playlists);
    await this.cacheManager.del(`(${id}) /api/user/playlists`);
  }

  async editUserPlaylists(id: string, playlists: Array<string>): Promise<void> {
    await this.validateUserPlaylists(id, playlists);
    const user_playlists = await this.findUserPlaylistsByUserId(id);
    user_playlists.playlists = playlists;

    await this.userPlaylistRepository.save(user_playlists);
    await this.cacheManager.del(`(${id}) /api/user/playlists`);
  }

  private async validateUserPlaylists(
    id: string,
    playlists: Array<string>,
  ): Promise<void> {
    for (const el of playlists) {
      const playlist = await this.findOneByKeyAndClientId(el, id);
      if (!playlist)
        throw new BadRequestException('존재하지 않는 플레이리스트 입니다.');
    }
  }
}
