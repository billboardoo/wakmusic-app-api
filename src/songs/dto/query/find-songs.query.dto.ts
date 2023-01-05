import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const songsType = ['title', 'artist', 'remix', 'ids'];
const songsSortType = ['popular', 'new', 'old'];

export class FindSongsQueryDto {
  @ApiProperty({ description: '검색 타입 : ' + songsType.join(',') })
  @IsString()
  @IsNotEmpty()
  @IsIn(songsType)
  type: string;

  @ApiProperty({ description: '정렬 타입 : ' + songsSortType.join(',') })
  @IsString()
  @IsNotEmpty()
  @IsIn(songsSortType)
  sort: string;

  @ApiProperty({ description: '검색어' })
  @IsString()
  @IsNotEmpty()
  keyword: string;
}
