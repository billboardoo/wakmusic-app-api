import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AppService, ChartsType } from './app.service';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { NewsEntity } from './entity/main/news.entity';
import { TeamsEntity } from './entity/main/teams.entity';
import { ArtistsEntity } from './entity/chart/artists.entity';
import { TotalEntity } from './entity/chart/total.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: '뉴스 조회',
    description: 'start부터 start+30까지의 뉴스 정보를 받아옵니다. (최신순)',
  })
  @ApiCreatedResponse({
    description: 'start부터 start+30까지의 뉴스 정보를 반환합니다.',
    type: () => NewsEntity,
    isArray: true,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/news')
  async findNews(@Query('start') start?: number): Promise<Array<NewsEntity>> {
    return await this.appService.findNews(start);
  }

  @ApiOperation({
    summary: '팀원 목록 조회',
    description: '팀원 목록을 받아옵니다.',
  })
  @ApiCreatedResponse({
    description: '팀원 목록입니다.',
    type: () => TeamsEntity,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/teams')
  async findAllTeams(): Promise<Array<TeamsEntity>> {
    return await this.appService.findAllTeams();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/charts/:type')
  async findCharts(
    @Param('type') type: ChartsType,
    @Query('limit') limit?: number,
  ): Promise<Array<TotalEntity>> {
    return await this.appService.findCharts(type, limit);
  }

  @Post('/charts')
  async createCharts() {}
}
