import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsEntity } from './entitys/main/news.entity';
import { Repository } from 'typeorm';
import { TeamsEntity } from './entitys/main/teams.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
    @InjectRepository(TeamsEntity)
    private readonly teamsRepository: Repository<TeamsEntity>,
  ) {}
  async findNews(start = 0): Promise<Array<NewsEntity>> {
    const news = await this.newsRepository.find({
      order: {
        time: {
          direction: 'desc',
        },
      },
    });
    return news.slice(start, start + 30);
  }

  async findAllTeams(): Promise<Array<TeamsEntity>> {
    const teams = await this.teamsRepository.find();
    return teams;
  }
}
