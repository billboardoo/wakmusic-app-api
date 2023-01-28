import { IsNumber, IsString } from 'class-validator';

export class FindLyricsResponseDto {
  @IsString()
  identifier: string;

  @IsNumber()
  start: number;

  @IsNumber()
  end: number;

  @IsString()
  text: string;

  @IsString()
  styles: string;
}
