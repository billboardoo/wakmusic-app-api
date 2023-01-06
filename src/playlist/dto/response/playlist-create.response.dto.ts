import { IsNotEmpty, IsString } from 'class-validator';

export class PlaylistCreateResponseDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}
