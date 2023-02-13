import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity } from '../entitys/main/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  async findCategoriesByType(type: string): Promise<Array<string>> {
    const categories = await this.categoriesRepository.findOne({
      where: {
        type: type,
      },
    });
    if (!categories) throw new NotFoundException('categories entity not found');

    return categories.categories;
  }
}
