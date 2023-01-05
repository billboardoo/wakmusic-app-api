import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { NewsEntity } from './entitys/main/news.entity';
import { DataSource, Repository } from 'typeorm';
import { TeamsEntity } from './entitys/main/teams.entity';
import { ArtistsEntity } from './entitys/chart/artists.entity';
import { TotalEntity } from './entitys/chart/total.entity';
import { MonthlyEntity } from './entitys/chart/monthly.entity';
import { WeeklyEntity } from './entitys/chart/weekly.entity';
import { DailyEntity } from './entitys/chart/daily.entity';
import { HourlyEntity } from './entitys/chart/hourly.entity';
import { UpdatedEntity } from './entitys/chart/updated.entity';
import { moment } from './utils/moment.utils';

export type ChartsType = 'monthly' | 'weekly' | 'daily' | 'hourly';
export const entityByType = {
  monthly: MonthlyEntity,
  weekly: WeeklyEntity,
  daily: DailyEntity,
  hourly: HourlyEntity,
};

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
