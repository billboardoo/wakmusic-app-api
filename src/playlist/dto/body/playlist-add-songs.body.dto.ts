import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class PlaylistAddSongsBodyDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  songs: Array<string>;
}
