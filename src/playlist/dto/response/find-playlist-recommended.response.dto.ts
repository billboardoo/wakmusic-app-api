import { ApiProperty } from '@nestjs/swagger';
import { TotalEntity } from '../../../entitys/chart/total.entity';

export class FindPlaylistRecommendedResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: () => TotalEntity, isArray: true })
  songs: Array<TotalEntity>;

  @ApiProperty()
  public: boolean;
}
