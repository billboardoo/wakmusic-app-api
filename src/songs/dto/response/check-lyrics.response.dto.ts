import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const statusType = [200, 404];

export class CheckLyricsResponseDto {
  @ApiProperty({ description: '노래 가사 존재 여부 : ' + statusType.join(',') })
  @IsNumber()
  @IsNotEmpty()
  @IsIn(statusType)
  status: number;
}
