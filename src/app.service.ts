import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { NewsEntity } from './entity/main/news.entity';
import { DataSource, getRepository, Repository } from 'typeorm';
import { TeamsEntity } from './entity/main/teams.entity';
import { ArtistsEntity } from './entity/chart/artists.entity';
import { TotalEntity } from './entity/chart/total.entity';
import { MonthlyEntity } from './entity/chart/monthly.entity';
import { WeeklyEntity } from './entity/chart/weekly.entity';
import { DailyEntity } from './entity/chart/daily.entity';
import { HourlyEntity } from './entity/chart/hourly.entity';

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

    @InjectDataSource('chart')
    private readonly dataSourceChart: DataSource,
  ) {}
  async findNews(start = 10): Promise<Array<NewsEntity>> {
    const news = await this.newsRepository.find({
      order: {
        time: {
          direction: 'desc',
        },
        type: {
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

  async findCharts(type: ChartsType, limit = 10): Promise<Array<TotalEntity>> {
    const chart = this.dataSourceChart
      .createQueryBuilder(entityByType[type], type)
      .leftJoin(`${type}.total`, 'total')
      .orderBy('increase', 'DESC')
      .limit(limit);

    const result = await chart.getMany();
    console.log(result);

    return result.map((entity) => {
      return entity.total;
    });
  }
}
