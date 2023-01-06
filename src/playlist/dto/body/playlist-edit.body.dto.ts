import { IsArray, IsBoolean, IsString } from 'class-validator';

export class PlaylistEditBodyDto {
  @IsString()
  title: string;

  @IsString()
  image: string;

  @IsArray()
  songlist: Array<string>;

  @IsBoolean()
  public: boolean;

  @IsString()
  clientId: string;
}
