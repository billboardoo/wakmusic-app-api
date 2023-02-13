import { Module } from '@nestjs/common';
import { QnaService } from './qna.service';
import { QnaController } from './qna.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QnaEntity } from '../entitys/main/qna.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([QnaEntity]), CategoriesModule],
  providers: [QnaService],
  controllers: [QnaController],
})
export class QnaModule {}
