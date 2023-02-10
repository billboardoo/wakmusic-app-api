import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { RecommendPlaylistEntity } from '../entitys/like/playlist.entity';
import { SongsModule } from '../songs/songs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlaylistEntity], 'user'),
    TypeOrmModule.forFeature([RecommendPlaylistEntity], 'like'),
    SongsModule,
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {}
