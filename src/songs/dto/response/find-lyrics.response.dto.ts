import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindLyricsResponseDto {
  @ApiProperty()
  @IsString()
  identifier: string;

  @ApiProperty()
  @IsNumber()
  start: number;

  @ApiProperty()
  @IsNumber()
  end: number;

  @ApiProperty()
  @IsString()
  text: string;
  @ApiProperty()
  @IsString()
  styles: string;
}
