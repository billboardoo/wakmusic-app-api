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
import { TotalEntity } from '../entitys/chart/total.entity';
import { PlaylistGetDetailResponseDto } from './dto/response/playlist-get-detail.response.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @Inject(SongsService)
    private readonly songsService: SongsService,

    @InjectRepository(PlaylistEntity, 'user')
    private readonly playlistRepository: Repository<PlaylistEntity>,
    @InjectRepository(RecommendPlaylistEntity, 'like')
    private readonly recommendRepository: Repository<RecommendPlaylistEntity>,
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
    newPlaylist.songlist = [];

    return await this.playlistRepository.save(newPlaylist);
  }

  async edit(key: string, body: PlaylistEditBodyDto): Promise<PlaylistEntity> {
    const currentPlaylist = await this.findOneByKeyAndClientId(
      key,
      body.clientId,
    );
    if (!currentPlaylist)
      throw new NotFoundException('플레이리스트가 없습니다.');

    currentPlaylist.title = body.title;
    currentPlaylist.songlist = body.songlist;

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

    const newPlaylist = await this.create(playlist.creator_id, playlist);
    return newPlaylist;
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
}
