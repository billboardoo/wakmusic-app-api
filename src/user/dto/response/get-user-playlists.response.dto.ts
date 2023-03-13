import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class GetUserPlaylistsResponseDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  creator_id: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsArray()
  songlist: Array<string>;

  @ApiProperty()
  @IsNumber()
  image_version: number;
}
