import { Controller, Get, Query } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { MainArtistsEntity } from '../entitys/main/artists.entity';
import { FindQueryDto } from './dto/query/find.query.dto';
import { TotalEntity } from '../entitys/chart/total.entity';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

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
    type: () => MainArtistsEntity,
    isArray: true,
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
