import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { main, chart } from '../../typeorm.config.json';
import { ArtistsEntity } from '../entity/chart/artists.entity';
import { UpdatedEntity } from '../entity/chart/updated.entity';
import { TotalEntity } from '../entity/chart/total.entity';
import { MonthlyEntity } from '../entity/chart/monthly.entity';
import { WeeklyEntity } from '../entity/chart/weekly.entity';
import { DailyEntity } from '../entity/chart/daily.entity';
import { HourlyEntity } from '../entity/chart/hourly.entity';
import { NewsEntity } from '../entity/main/news.entity';
import { TeamsEntity } from '../entity/main/teams.entity';

export const mainDataSource: TypeOrmModuleOptions = {
  type: 'mysql',
  host: main.host,
  port: main.port,
  username: main.username,
  password: main.password,
  database: main.database,
  entities: [NewsEntity, TeamsEntity],
  synchronize: true,
  timezone: '+09:00',
};

export const chartDataSource: TypeOrmModuleOptions = {
  name: 'chart',
  type: 'mysql',
  host: chart.host,
  port: chart.port,
  username: chart.username,
  password: chart.password,
  database: chart.database,
  entities: [
    ArtistsEntity,
    UpdatedEntity,
    TotalEntity,
    MonthlyEntity,
    WeeklyEntity,
    DailyEntity,
    HourlyEntity,
  ],
  synchronize: true,
  timezone: '+09:00',
};
