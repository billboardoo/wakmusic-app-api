import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotalEntity } from '../entitys/chart/total.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TotalEntity], 'chart')],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
