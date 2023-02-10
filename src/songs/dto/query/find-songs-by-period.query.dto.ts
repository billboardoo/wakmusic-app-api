import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const songsType = ['month', 'year'];

export class FindSongsByPeriodQueryDto {
  @ApiProperty({ description: '노래 정렬 타입 : ' + songsType.join(',') })
  @IsString()
  @IsNotEmpty()
  @IsIn(songsType)
  type: string;

  @ApiProperty({
    description: '날짜\nmonth : 202208 꼴로 입력\nyear : 2022 꼴로 입력',
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1000)
  @Max(999999)
  period: number;

  @ApiProperty({
    description: '반환 지점',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  start?: number;
}
