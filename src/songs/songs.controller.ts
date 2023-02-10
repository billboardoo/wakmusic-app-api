import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { TotalEntity } from '../entitys/chart/total.entity';
import { FindSongsByPeriodQueryDto } from './dto/query/find-songs-by-period.query.dto';
import { FindSongsQueryDto } from './dto/query/find-songs.query.dto';
import { FindSongsByLyricsResponseDto } from './dto/response/find-songs-by-lyrics.response.dto';
import { CheckLyricsQueryDto } from './dto/query/check-lyrics.query.dto';
import { CheckLyricsResponseDto } from './dto/response/check-lyrics.response.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindNewSongsParamDto } from './dto/param/find-new-songs.param.dto';
import { FindLyricsResponseDto } from './dto/response/find-lyrics.response.dto';

@ApiTags('songs')
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @ApiOperation({
    summary: '신곡 목록',
    description: '이번달의 신곡 목록을 받아옵니다.',
  })
  @ApiOkResponse({
    description: '이번달의 신곡 목록',
    type: () => TotalEntity,
    isArray: true,
  })
  @Get('/new/monthly')
  async findNewSongsByMonth(): Promise<Array<TotalEntity>> {
    return await this.songsService.findNewSongsByMonth();
  }

  @ApiOperation({
    summary: '그룹별 최신곡 목록',
    description: '각 그룹의 최신곡 10개를 반환합니다.',
  })
  @ApiOkResponse({
    description: '최신곡 목록',
    type: () => TotalEntity,
    isArray: true,
  })
  @Get('/new/:group')
  async findNewSongsByGroup(
    @Param() param: FindNewSongsParamDto,
  ): Promise<Array<TotalEntity>> {
    const newSongs = await this.songsService.findNewSongsByGroup(param.group);

    return newSongs;
  }

  @ApiOperation({
    summary: '노래 목록',
    description:
      '지정된 기간의 start부터 start+30까지의 노래 목록을 받아옵니다. (최신순)',
  })
  @ApiOkResponse({
    description: '지정된 기간의 start부터 start+30까지의 노래 목록 (최신순)',
    type: () => TotalEntity,
    isArray: true,
  })
  @Get('/list')
  async findSongsByPeriod(
    @Query() query: FindSongsByPeriodQueryDto,
  ): Promise<Array<TotalEntity>> {
    return await this.songsService.findSongsByPeriod(query);
  }

  @ApiOperation({
    summary: '노래 검색',
    description: 'keyword 검색어를 통한 노래 목록을 받아옵니다.',
  })
  @ApiOkResponse({
    description: 'keyword 검색어를 통한 노래 목록',
    type: () => TotalEntity,
    isArray: true,
  })
  @Get('/search')
  async findSongsBySearch(
    @Query() query: FindSongsQueryDto,
  ): Promise<Array<TotalEntity>> {
    return await this.songsService.findSongsBySearch(query);
  }

  @ApiOperation({
    summary: '가사 없는 노래 목록',
    description:
      '가사가 없는 노래 목록을 받아옵니다.\n 가사 작업용으로만 사용되는 엔드포인트입니다.',
  })
  @ApiOkResponse({
    description: '가사가 없는 노래 목록',
    type: () => FindSongsByLyricsResponseDto,
    isArray: true,
  })
  @Get('/lyrics-all')
  async findAllSongsByLyrics(): Promise<Array<FindSongsByLyricsResponseDto>> {
    return await this.songsService.findSongsByLyrics();
  }

  @ApiOperation({
    summary: '가사 존재 여부 확인',
    description:
      'id에 음악 ID를 넣어 해당 음악의 가사 존재 여부를 확인할 수 있습니다.\n사용을 권장하지 않습니다.',
  })
  @ApiOkResponse({
    description: '해당 음악의 가사 존재 여부',
    type: () => CheckLyricsResponseDto,
  })
  @Get('/check-lyrics')
  async checkLyrics(
    @Query() query: CheckLyricsQueryDto,
  ): Promise<CheckLyricsResponseDto> {
    const isLyricExist = await this.songsService.checkLyrics(query);
    if (!isLyricExist) return { status: 404 };

    return { status: 200 };
  }

  @ApiOperation({
    summary: '가사 가져오기',
    description:
      '가사 파일을 가져옵니다.\n사용하기 쉽게 json형태로 파싱된 데이터를 가져옵니다.',
  })
  @ApiOkResponse({
    description: 'json으로 파싱된 vtt 파일',
    type: () => FindLyricsResponseDto,
    isArray: true,
  })
  @Get('lyrics/:id')
  async findLyrics(
    @Param('id') id: string,
  ): Promise<Array<FindLyricsResponseDto>> {
    const lyrics = await this.songsService.findLyrics(id);

    if (!lyrics) throw new NotFoundException();

    return lyrics as Array<FindLyricsResponseDto>;
  }
}
