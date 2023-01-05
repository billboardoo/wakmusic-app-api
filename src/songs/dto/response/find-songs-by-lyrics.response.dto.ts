import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindSongsByLyricsResponseDto {
  @ApiProperty({ description: '음악 id' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '아티스트' })
  @IsString()
  @IsNotEmpty()
  artist: string;

  @ApiProperty({ description: '업로드 날짜' })
  @IsNumber()
  date: number;
}
