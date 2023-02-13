import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesEntity } from '../entitys/main/categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesEntity])],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
