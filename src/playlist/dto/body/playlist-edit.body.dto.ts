import { IsArray, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaylistEditBodyDto {
  @ApiProperty({ description: '제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '플레이리스트 노래 목록' })
  @IsArray()
  songlist: Array<string>;

  @ApiProperty({ description: '생성자 고유 Id' })
  @IsString()
  clientId: string;
}
