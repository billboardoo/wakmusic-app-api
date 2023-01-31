import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotalEntity } from '../entitys/chart/total.entity';
import { ArtistModule } from '../artist/artist.module';
import { MainArtistsEntity } from '../entitys/main/artists.entity';
import { ArtistService } from '../artist/artist.service';
import { ArtistsEntity } from '../entitys/chart/artists.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TotalEntity], 'chart'), ArtistModule],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
