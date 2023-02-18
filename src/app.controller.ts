import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NewsEntity } from './entitys/main/news.entity';
import { TeamsEntity } from './entitys/main/teams.entity';

@ApiTags('main')
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
    isArray: true,
  })
  @Get('/teams')
  async findAllTeams(): Promise<Array<TeamsEntity>> {
    return await this.appService.findAllTeams();
  }
}
