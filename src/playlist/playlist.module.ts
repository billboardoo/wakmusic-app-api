import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { RecommendPlaylistEntity } from '../entitys/like/playlist.entity';
import { SongsModule } from '../songs/songs.module';
import { UserPlaylistsEntity } from '../entitys/user/user-playlists.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlaylistEntity, UserPlaylistsEntity], 'user'),
    TypeOrmModule.forFeature([RecommendPlaylistEntity], 'like'),
    SongsModule,
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {}
