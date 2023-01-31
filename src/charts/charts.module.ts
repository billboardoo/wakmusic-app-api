import { Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotalEntity } from '../entitys/chart/total.entity';
import { UpdatedEntity } from '../entitys/chart/updated.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TotalEntity, UpdatedEntity], 'chart')],
  controllers: [ChartsController],
  providers: [ChartsService],
  exports: [ChartsService],
})
export class ChartsModule {}
