import { IsNumber, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TotalEntity } from '../../entitys/chart/total.entity';
import { Type } from 'class-transformer';

export class LikeDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty({ type: () => TotalEntity })
  @IsObject()
  @ValidateNested()
  @Type(() => TotalEntity)
  song: TotalEntity;

  @ApiProperty()
  @IsNumber()
  likes: number;
}
