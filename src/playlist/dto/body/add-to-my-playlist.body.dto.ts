import { IsNotEmpty, IsString } from 'class-validator';

export class AddToMyPlaylistBodyDto {
  @IsString()
  @IsNotEmpty()
  creatorId: string;
}
