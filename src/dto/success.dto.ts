import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessDto {
  @ApiProperty()
  @IsNumber()
  status: number;
}
