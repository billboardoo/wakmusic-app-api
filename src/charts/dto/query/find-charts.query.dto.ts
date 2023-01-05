import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const chartsType = ['monthly', 'weekly', 'daily', 'hourly', 'total'];

export class FindChartsQueryDto {
  @ApiProperty({ description: '차트 타입' })
  @IsString()
  @IsNotEmpty()
  @IsIn(chartsType)
  type: string;

  @ApiProperty({ description: '차트 노래 갯수', required: false, default: 10 })
  @IsNumber()
  @IsOptional()
  limit?: number;
}
