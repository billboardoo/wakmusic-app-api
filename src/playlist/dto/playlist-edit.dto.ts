import { IsArray, IsOptional, IsString } from 'class-validator';

export class PlaylistEditDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  songs?: Array<string>;
}
