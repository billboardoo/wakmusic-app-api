import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from '../entitys/like/like.entity';
import { LikeManagerEntity } from '../entitys/like/manager.entity';
import { ChartsService } from '../charts/charts.service';
import { ChartsModule } from '../charts/charts.module';
import { TotalEntity } from '../entitys/chart/total.entity';
import { UpdatedEntity } from '../entitys/chart/updated.entity';

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
