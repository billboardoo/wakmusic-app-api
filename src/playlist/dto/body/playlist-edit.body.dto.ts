import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaylistEditBodyDto {
  @ApiProperty({ description: '제목' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '플레이리스트 노래 목록' })
  @IsOptional()
  @IsArray()
  songs?: Array<string>;
}
