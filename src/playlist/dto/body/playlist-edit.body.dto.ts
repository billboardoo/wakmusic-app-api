import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaylistEditBodyDto {
  @ApiProperty({ description: '플레이리스트 노래 목록' })
  @IsArray()
  songs: Array<string>;
}
