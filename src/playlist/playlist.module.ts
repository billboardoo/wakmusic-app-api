import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity } from '../entitys/user/playlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistEntity], 'user')],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
