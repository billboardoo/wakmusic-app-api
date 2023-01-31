import { Module } from '@nestjs/common';
import { QnaService } from './qna.service';
import { QnaController } from './qna.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QnaEntity } from '../entitys/main/qna.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QnaEntity])],
  providers: [QnaService],
  controllers: [QnaController],
})
export class QnaModule {}
