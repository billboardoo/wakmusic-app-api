import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaylistJobDto {
  @ApiProperty()
  @IsString()
  playlist_key: string;

  @ApiProperty()
  @IsString()
  new_playlist_key: string;

  @ApiProperty()
  @IsNumber()
  datetime: number;
}
