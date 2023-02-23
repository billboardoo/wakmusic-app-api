import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class EditUserPlaylistsBodyDto {
  @ApiProperty()
  @IsArray()
  playlists: Array<string>;
}
