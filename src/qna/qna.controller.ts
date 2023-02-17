import { Controller, Get } from '@nestjs/common';
import { QnaService } from './qna.service';
import { QnaEntity } from '../entitys/main/qna.entity';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from '../categories/categories.service';

@ApiTags('qna')
@Controller('qna')
export class QnaController {
  constructor(
    private readonly qnaService: QnaService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @ApiOperation({
    summary: 'qna 카테고리 가져오기',
    description: '모든 qna 카테고리를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '카테고리들',
    type: 'string',
    isArray: true,
  })
  @Get('/categories')
  async getAllCategories(): Promise<Array<string>> {
    return await this.categoriesService.findCategoriesByType('qna');
  }

  @ApiOperation({
    summary: 'qna 가져오기',
    description: '모든 qna를 가져옵니다.',
  })
  @ApiOkResponse({
    description: 'qna 목록',
    type: () => QnaEntity,
    isArray: true,
  })
  @Get()
  async getAllQna(): Promise<Array<QnaEntity>> {
    return await this.qnaService.findAll();
  }
}
