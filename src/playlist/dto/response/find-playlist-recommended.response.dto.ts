import { ApiProperty } from '@nestjs/swagger';
import { TotalEntity } from '../../../entitys/chart/total.entity';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class FindPlaylistRecommendedResponseDto {
  @ApiProperty()
  @IsNumber()
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
