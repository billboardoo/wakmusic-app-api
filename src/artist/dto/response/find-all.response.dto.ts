import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class FindAllResponseDto {
  @ApiProperty({ description: '아티스트 id' })
  @IsString()
  id: string;

  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '짧은 이름' })
  @IsString()
  short: string;

  @ApiProperty({ description: '소속 그룹' })
  @IsString()
  group: string;

  @ApiProperty({ description: '한 줄 소개' })
  @IsString()
  title: string;

  @ApiProperty({ description: '한 줄 소개(앱)' })
  @IsString()
  app_title: string;

  @ApiProperty({ description: '긴 소개글' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'HEX 색깔 코드',
    example: '5EA585|100|0,5EA585|0|0',
  })
  @IsArray()
  color: Array<Array<string>>;

  @ApiProperty({ description: '유튜브 URL' })
  @IsString()
  youtube: string;

  @ApiProperty({ description: '트위치 URL' })
  @IsString()
  twitch: string;

  @ApiProperty({ description: '인스타그램 URL' })
  @IsString()
  instagram: string;

  @ApiProperty()
  @IsNumber()
  image_round_version: number;

  @ApiProperty()
  @IsNumber()
  image_square_version: number;
}
