import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from '../entitys/like/like.entity';
import { LikeManagerEntity } from '../entitys/like/manager.entity';
import { ChartsModule } from '../charts/charts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeEntity, LikeManagerEntity], 'like'),
    ChartsModule,
  ],
  providers: [LikeService],
  controllers: [LikeController],
  exports: [LikeService],
})
export class LikeModule {}
