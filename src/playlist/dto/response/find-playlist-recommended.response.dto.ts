import { ApiProperty } from '@nestjs/swagger';
import { TotalEntity } from '../../../entitys/chart/total.entity';
import { IsBoolean, IsString } from 'class-validator';

export class FindPlaylistRecommendedResponseDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: () => TotalEntity, isArray: true })
  songs: Array<TotalEntity>;

  @ApiProperty()
  @IsBoolean()
  public: boolean;
}
