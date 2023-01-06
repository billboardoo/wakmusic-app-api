import { IsArray, IsBoolean, IsString } from 'class-validator';

export class PlaylistCreateBodyDto {
  @IsString()
  title: string;

  @IsString()
  creator: string;

  @IsString()
  platform: string;

  @IsString()
  image: string;

  @IsArray()
  songlist: Array<string>;

  @IsBoolean()
  public: boolean;

  @IsString()
  clientId: string;
}
