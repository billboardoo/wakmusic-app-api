import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaylistCreateBodyDto {
  @ApiProperty({ description: '제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '플레이리스트 이미지 타입' })
  @IsString()
  image: string;

  @ApiProperty({ nullable: true })
  @IsArray()
  @IsOptional()
  songlist?: Array<string>;
}
