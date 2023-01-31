import { Controller, Get } from '@nestjs/common';
import { QnaService } from './qna.service';
import { qnaCategories } from './data/qna.data';

@Controller('qna')
export class QnaController {
  constructor(private readonly qnaService: QnaService) {}

  @Get('/getAllCategories')
  async getAllCategories(): Promise<Array<string>> {
    return qnaCategories;
  }
}
