import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entitys/user/user.entity';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { PlaylistModule } from '../playlist/playlist.module';
import { PlaylistService } from '../playlist/playlist.service';
import { LikeManagerEntity } from '../entitys/like/manager.entity';
import { LikeModule } from '../like/like.module';
import { LikeService } from '../like/like.service';
import { ChartsService } from '../charts/charts.service';
import { TotalEntity } from '../entitys/chart/total.entity';
import { UpdatedEntity } from '../entitys/chart/updated.entity';
import { ChartsModule } from '../charts/charts.module';
import { LikeEntity } from '../entitys/like/like.entity';
import { RecommendPlaylistEntity } from '../entitys/like/playlist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PlaylistEntity], 'user'),
    TypeOrmModule.forFeature(
      [LikeEntity, LikeManagerEntity, RecommendPlaylistEntity],
      'like',
    ),
    TypeOrmModule.forFeature([TotalEntity, UpdatedEntity], 'chart'),
    PlaylistModule,
    LikeModule,
  ],
  providers: [UserService, PlaylistService, LikeService, ChartsService],
  controllers: [UserController],
})
export class UserModule {}
