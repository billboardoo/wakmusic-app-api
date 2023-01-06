import { IsArray, IsBoolean, IsString } from 'class-validator';

export class PlaylistDetailResponseDto {
  @IsString()
  key: string;

  @IsString()
  title: string;

  @IsString()
  creator: string;

  @IsString()
  platform: string;

  @IsString()
  image: string;

  @IsBoolean()
  public: boolean;

  @IsString()
  clientId: string;

  @IsArray()
  songlist: Array<string>;

  @IsArray()
  subscribe: Array<string>;
}
