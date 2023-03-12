import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistVersionEntity } from 'src/entitys/version/artist.entity';
import { PlaylistVersionEntity } from 'src/entitys/version/playlist.entity';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ArtistVersionEntity, PlaylistVersionEntity],
      'version',
    ),
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
