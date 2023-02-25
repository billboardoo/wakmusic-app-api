import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PlaylistEditTitleBodyDto {
  @ApiProperty()
  @IsString()
  title: string;
}
