import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistVersionEntity } from '../entitys/version/artist.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ArtistVersionEntity, 'version')
    private readonly artistRepository: Repository<ArtistVersionEntity>,
  ) {}

  async getArtistImageVersion(artist: string): Promise<ArtistVersionEntity> {
    return await this.artistRepository.findOne({
      where: {
        artist: artist,
      },
    });
  }
}
