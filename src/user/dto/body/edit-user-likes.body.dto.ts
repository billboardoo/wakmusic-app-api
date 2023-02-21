import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class EditUserLikesBodyDto {
  @ApiProperty()
  @IsArray()
  songs: Array<string>;
}
