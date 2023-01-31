import { Controller, Get } from '@nestjs/common';
import { QnaService } from './qna.service';
import { qnaCategories } from './data/qna.data';
import { QnaEntity } from '../entitys/main/qna.entity';

@Controller('qna')
export class QnaController {
  constructor(private readonly qnaService: QnaService) {}

  @Get('/getAllCategories')
  async getAllCategories(): Promise<Array<string>> {
    return qnaCategories;
  }

  @Get()
  async getAllQna(): Promise<Array<QnaEntity>> {
    return await this.qnaService.findAll();
  }
}
