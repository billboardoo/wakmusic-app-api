import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToMyPlaylistBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  creatorId: string;
}
