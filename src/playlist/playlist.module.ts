import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { RecommendPlaylistEntity } from '../entitys/like/playlist.entity';
import { SongsModule } from '../songs/songs.module';
import { UserPlaylistsEntity } from '../entitys/user/user-playlists.entity';
import { BullModule } from '@nestjs/bull';
import { PlaylistProcessor } from './playlist.processor';
import { PlaylistCopyLogEntity } from '../entitys/data/playlist_copy_log.entity';
import { PlaylistCopyEntity } from '../entitys/data/playlist_copy.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'playlist',
    }),
    TypeOrmModule.forFeature([PlaylistEntity, UserPlaylistsEntity], 'user'),
    TypeOrmModule.forFeature([RecommendPlaylistEntity], 'like'),
    TypeOrmModule.forFeature(
      [PlaylistCopyEntity, PlaylistCopyLogEntity],
      'data',
    ),
    SongsModule,
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService, PlaylistProcessor],
  exports: [PlaylistService],
})
export class PlaylistModule {}
