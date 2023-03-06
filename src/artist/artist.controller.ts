import {
  CacheTTL,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { MainArtistsEntity } from '../entitys/main/artists.entity';
import { FindQueryDto } from './dto/query/find.query.dto';
import { TotalEntity } from '../entitys/chart/total.entity';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpCacheInterceptor } from '../core/interceptor/http-cache.interceptor';

const artistExample = {
  id: 'woowakgood',
  name: '우왁굳',
  short: '우왁굳',
  group: 'woowakgood',
  title:
    '언더 출신 갱스터부터 음악의 왕까지\r\n노래 부른 적이 없는데 음반이 나오는 신세계의 신',
  app_title: '노래 부른 적이 없는데 음반이 나오는 신세계의 신',
  description:
    "2008년, 뒷골목 언더그라운드 출신이었던 그는 갱스터의 삶을 보내던 중 가수로서의 꿈을 가지게 된다. \r\n그 후, 그는 2018년 [왁바나]를 공개하면서 스스로를 '가수'라고 칭하기 시작하며 여태껏 보지 못한 새로운 가사와 가창력으로 대중들에게 신선한 충격을 주었고, 혹자는 음악의 모든 장르를 소화하는 그를 '음악의 왕'이라고 부르기도 했다.\r\n이는 그가 당당히 음악 레이블의 수장 자리를 맡을 수 있는 계기가 되었으며, 현재 그는 인간 아쟁이자 왁 엔터테인먼트의 CEO로서 후배 양성에도 힘을 쏟고 있다.",
  color: [
    ['5EA585', '100', '0'],
    ['5EA585', '0', '100'],
  ],
  youtube: 'https://www.youtube.com/user/woowakgood',
  twitch: 'https://www.twitch.tv/woowakgood',
  instagram: 'https://www.instagram.com/instawakgood/',
};

@ApiTags('artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @ApiOperation({
    summary: '아티스트 목록',
    description: '아티스트 목록을 가져옵니다.',
  })
  @ApiOkResponse({
    description: '아티스트 목록',
    schema: {
      example: [artistExample],
    },
  })
  @Get('/list')
  async findAll(): Promise<Array<MainArtistsEntity>> {
    return await this.artistService.findAll();
  }

  @ApiOperation({
    summary: '아티스트 노래 목록',
    description: '아티스트의 노래를 start부터 start+30까지 불러옵니다.',
  })
  @ApiOkResponse({
    description: '아티스트 노래 목록',
    type: () => TotalEntity,
    isArray: true,
  })
  @Get('/albums')
  async find(@Query() query: FindQueryDto): Promise<Array<TotalEntity>> {
    return await this.artistService.find(query);
  }
}
