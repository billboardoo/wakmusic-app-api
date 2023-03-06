import { CacheTTL, Controller, Get } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeEntity } from '../entitys/main/notice.entity';
import { CategoriesService } from '../categories/categories.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('notice')
@Controller('notice')
export class NoticeController {
  constructor(
    private readonly noticeService: NoticeService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @ApiOperation({
    summary: '모든 공지 가져오기',
    description: '모든 공지를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '모든 공지',
    type: () => NoticeEntity,
    isArray: true,
  })
  @Get()
  @CacheTTL(60)
  async findAll(): Promise<Array<NoticeEntity>> {
    return await this.noticeService.findAll();
  }

  @ApiOperation({
    summary: '최근 공지 가져오기',
    description: '최근 공지를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '최근 공지',
    type: () => NoticeEntity,
  })
  @Get('/latest')
  @CacheTTL(60)
  async findLatest(): Promise<NoticeEntity> {
    return await this.noticeService.findLatest();
  }

  @ApiOperation({
    summary: '공지 카테고리 가져오기',
    description: '모든 공지 카테고리를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '카테고리들',
    type: 'string',
    isArray: true,
  })
  @Get('/categories')
  async getAllCategories(): Promise<Array<string>> {
    const categories = await this.categoriesService.findCategoriesByType(
      'notice',
    );
    return categories;
  }
}
