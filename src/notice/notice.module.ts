import { Module } from '@nestjs/common';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeEntity } from '../entitys/main/notice.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeEntity]), CategoriesModule],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
