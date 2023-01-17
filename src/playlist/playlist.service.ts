import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { Like, Repository } from 'typeorm';
import { PlaylistCreateBodyDto } from './dto/body/playlist-create.body.dto';
import { PlaylistEditBodyDto } from './dto/body/playlist-edit.body.dto';
import { RecommendPlaylistEntity } from '../entitys/like/playlist.entity';
// import { cryptoRandomStringAsync } from 'crypto-random-string';

@Injectable()
export class PlaylistService {
  constructor(
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

  async findPlaylistRecommended(): Promise<Array<RecommendPlaylistEntity>> {
    const playlists = await this.recommendRepository.find({
      where: {
        public: true,
      },
    });

    return playlists;
  }

  async findOneByKeyAndClientId(
    key: string,
    clientId: string,
  ): Promise<PlaylistEntity> {
    return await this.playlistRepository.findOne({
      where: {
        key: key,
        clientId: clientId,
      },
    });
  }

  async findByClientId(clientId: string): Promise<Array<PlaylistEntity>> {
    return await this.playlistRepository.find({
      where: {
        subscribe: Like(`%${clientId}%`),
      },
    });
  }

  async create(body: PlaylistCreateBodyDto): Promise<PlaylistEntity> {
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
    newPlaylist.creator = body.creator;
    newPlaylist.platform = body.platform;
    newPlaylist.image = body.image;
    newPlaylist.songlist = body.songlist.join('|:|');
    newPlaylist.public = String(body.public);
    newPlaylist.clientId = body.clientId;
    newPlaylist.subscribe = body.clientId;

    return await this.playlistRepository.save(newPlaylist);
  }

  async edit(key: string, body: PlaylistEditBodyDto): Promise<PlaylistEntity> {
    const currentPlaylist = await this.findOneByKeyAndClientId(
      key,
      body.clientId,
    );
    if (!currentPlaylist) throw new NotFoundException();

    currentPlaylist.title = body.title;
    currentPlaylist.image = body.image;
    currentPlaylist.songlist = body.songlist.join('|:|');
    currentPlaylist.public = String(body.public);

    return await this.playlistRepository.save(currentPlaylist);
  }

  async delete(key: string, clientId: string): Promise<PlaylistEntity> {
    const playlist = await this.findOneByKeyAndClientId(key, clientId);

    if (!playlist) throw new NotFoundException('playlist not found');

    return await this.playlistRepository.remove(playlist);
  }

  async addSubscriber(
    key: string,
    subscriberId: string,
  ): Promise<PlaylistEntity> {
    const playlist = await this.findOne(key);
    if (!playlist) throw new NotFoundException();

    const subscribers = playlist.subscribe.split('|:|');
    if (subscribers.includes(subscriberId))
      throw new BadRequestException('already subscribed user');

    subscribers.push(subscriberId);
    playlist.subscribe = subscribers.join('|:|');

    return await this.playlistRepository.save(playlist);
  }

  async removeSubscriber(
    key: string,
    subscriberId: string,
  ): Promise<PlaylistEntity> {
    const playlist = await this.findOne(key);
    if (!playlist) throw new NotFoundException();

    let subscribers = playlist.subscribe.split('|:|');
    if (!subscribers.includes(subscriberId))
      throw new BadRequestException('user not subscribed');

    subscribers = subscribers.filter((e) => e !== subscriberId);
    playlist.subscribe = subscribers.join('|:|');

    return await this.playlistRepository.save(playlist);
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
