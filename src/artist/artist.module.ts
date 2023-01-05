import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainArtistsEntity } from '../entitys/main/artists.entity';
import { ArtistsEntity } from '../entitys/chart/artists.entity';
import { TotalEntity } from '../entitys/chart/total.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MainArtistsEntity]),
    TypeOrmModule.forFeature([ArtistsEntity, TotalEntity], 'chart'),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
