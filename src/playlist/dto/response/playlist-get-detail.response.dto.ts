import { ApiProperty } from '@nestjs/swagger';
import { TotalEntity } from '../../../entitys/chart/total.entity';

export class PlaylistGetDetailResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: '플레이리스트 고유 key' })
  key: string;

  @ApiProperty({ description: '플레이리스트 이름' })
  title: string;

  @ApiProperty({ description: '생성자 OAuth Id' })
  creator_id: string;

  @ApiProperty({ description: '플레이리스트 프로필 타입' })
  image: string;

  @ApiProperty({
    description: '플레이리스트 노래 목록',
    type: () => TotalEntity,
    isArray: true,
  })
  songs: Array<TotalEntity>;
}
