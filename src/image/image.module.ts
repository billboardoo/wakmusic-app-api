import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './image.service';
import { ArtistVersionEntity } from '../entitys/version/artist.entity';
import { PlaylistVersionEntity } from '../entitys/version/playlist.entity';
import { RecommendedPlaylistVersionEntity } from '../entitys/version/recommended-playlist.entitiy';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        ArtistVersionEntity,
        PlaylistVersionEntity,
        RecommendedPlaylistVersionEntity,
      ],
      'version',
    ),
  ],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
