import { Controller, Get } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeEntity } from '../entitys/main/notice.entity';
import { noticeCategories } from './data/notice.data';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

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
    return noticeCategories;
  }
}
