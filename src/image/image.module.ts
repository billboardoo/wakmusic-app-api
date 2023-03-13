import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './image.service';
import { ArtistVersionEntity } from '../entitys/version/artist.entity';
import { PlaylistVersionEntity } from '../entitys/version/playlist.entity';
import { RecommendedPlaylistVersionEntity } from '../entitys/version/recommended-playlist.entitiy';
import { ProfileVersionEntity } from 'src/entitys/version/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        ArtistVersionEntity,
        PlaylistVersionEntity,
        RecommendedPlaylistVersionEntity,
        ProfileVersionEntity,
      ],
      'version',
    ),
  ],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
