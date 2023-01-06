import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlaylistEntity, 'user')
    private readonly playlistRepository: Repository<PlaylistEntity>,
  ) {}

  async findAll(): Promise<Array<PlaylistEntity>> {
    return await this.playlistRepository.find({
      where: {
        public: 'true',
      },
    });
  }

  async findOne(id: string): Promise<PlaylistEntity> {
    return await this.playlistRepository.findOne({
      where: {
        key: id,
      },
    });
  }

  async findByClientId(clientId: string): Promise<Array<PlaylistEntity>> {
    console.log(clientId);
    console.log('114810075525382097724');
    return await this.playlistRepository.find({
      where: {
        clientId: clientId,
      },
    });
  }
}
