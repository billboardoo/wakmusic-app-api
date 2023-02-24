import { ApiProperty } from '@nestjs/swagger';
import { TotalEntity } from '../../../entitys/chart/total.entity';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PlaylistGetDetailResponseDto {
  @ApiProperty({ description: '플레이리스트 고유 key' })
  @IsString()
  key: string;

  @ApiProperty({ description: '플레이리스트 이름' })
  @IsString()
  title: string;

  @ApiProperty({ description: '생성자 OAuth Id' })
  @IsString()
  creator_id: string;

  @ApiProperty({ description: '플레이리스트 프로필 타입' })
  @IsString()
  image: string;

  @ApiProperty({
    description: '플레이리스트 노래 목록',
    type: () => TotalEntity,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TotalEntity)
  songs: Array<TotalEntity>;
}
