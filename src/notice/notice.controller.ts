import { Controller, Get } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeEntity } from '../entitys/main/notice.entity';
import { CategoriesService } from '../categories/categories.service';

@Controller('notice')
export class NoticeController {
  constructor(
    private readonly noticeService: NoticeService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  async findAll(): Promise<Array<NoticeEntity>> {
    return await this.noticeService.findAll();
  }

  @Get('/latest')
  async findLatest(): Promise<NoticeEntity> {
    return await this.noticeService.findLatest();
  }

  @Get('/categories')
  async getAllCategories(): Promise<Array<string>> {
    const categories = await this.categoriesService.findCategoriesByType(
      'notice',
    );
    return categories;
  }
}
