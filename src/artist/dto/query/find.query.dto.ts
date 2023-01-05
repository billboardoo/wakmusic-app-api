import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const sortType = ['popular', 'new', 'old'];
export class FindQueryDto {
  @ApiProperty({ description: '아티스트 id' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '정렬 타입' })
  @IsString()
  @IsNotEmpty()
  @IsIn(sortType)
  sort: string;

  @ApiProperty({ description: '시작점', required: false })
  @IsNumber()
  @IsOptional()
  start?: number;
}
