import { Module } from '@nestjs/common';
import { QnaService } from './qna.service';
import { QnaController } from './qna.controller';

@Module({
  providers: [QnaService],
  controllers: [QnaController]
})
export class QnaModule {}
