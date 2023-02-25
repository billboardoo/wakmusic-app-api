import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { Repository } from 'typeorm';
import { PlaylistCreateBodyDto } from './dto/body/playlist-create.body.dto';
import { PlaylistEditBodyDto } from './dto/body/playlist-edit.body.dto';
import { RecommendPlaylistEntity } from '../entitys/like/playlist.entity';
import { SongsService } from '../songs/songs.service';
import { FindPlaylistRecommendedResponseDto } from './dto/response/find-playlist-recommended.response.dto';
import { PlaylistGetDetailResponseDto } from './dto/response/playlist-get-detail.response.dto';
import { UserPlaylistsEntity } from '../entitys/user/user-playlists.entity';

@Injectable()
export class PlaylistService {
  constructor(
    @Inject(SongsService)
    private readonly songsService: SongsService,

    @InjectRepository(PlaylistEntity, 'user')
    private readonly playlistRepository: Repository<PlaylistEntity>,
    @InjectRepository(RecommendPlaylistEntity, 'like')
    private readonly recommendRepository: Repository<RecommendPlaylistEntity>,
    @InjectRepository(UserPlaylistsEntity, 'user')
    private readonly userPlaylistRepository: Repository<UserPlaylistsEntity>,
  ) {}

  async findAll(): Promise<Array<PlaylistEntity>> {
    return await this.playlistRepository.find({
      where: {},
    });
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

    return {
      ...playlist,
      songs: songs,
    };
  }

  async findAllPlaylistRecommended(): Promise<
    Array<Omit<RecommendPlaylistEntity, 'song_ids'>>
  > {
    const playlists = await this.recommendRepository.find({
      where: {
        public: true,
      },
    });

    return playlists.map((playlist) => {
      delete playlist.song_ids;
      return playlist;
    });
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

    return {
      id: playlist.id,
      title: playlist.title,
      songs: await this.songsService.findByIds(playlist.song_ids),
      public: playlist.public,
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

  async edit(
    id: string,
    key: string,
    body: PlaylistEditBodyDto,
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

    return await this.playlistRepository.save(currentPlaylist);
  }

  async delete(key: string, clientId: string): Promise<PlaylistEntity> {
    const playlist = await this.findOneByKeyAndClientId(key, clientId);

    if (!playlist) throw new NotFoundException('playlist not found');

    return await this.playlistRepository.remove(playlist);
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
    return await this.create(creatorId, playlist);
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
  }

  async editUserPlaylists(id: string, playlists: Array<string>): Promise<void> {
    await this.validateUserPlaylists(id, playlists);
    const user_playlists = await this.findUserPlaylistsByUserId(id);
    user_playlists.playlists = playlists;

    await this.userPlaylistRepository.save(user_playlists);
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
