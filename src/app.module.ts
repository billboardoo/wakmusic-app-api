import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { chartDataSource, mainDataSource } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { NewsEntity } from './entity/main/news.entity';
import { TeamsEntity } from './entity/main/teams.entity';
import { ArtistsEntity } from './entity/chart/artists.entity';
import { DailyEntity } from './entity/chart/daily.entity';
import { HourlyEntity } from './entity/chart/hourly.entity';
import { MonthlyEntity } from './entity/chart/monthly.entity';
import { WeeklyEntity } from './entity/chart/weekly.entity';
import { TotalEntity } from './entity/chart/total.entity';
import { UpdatedEntity } from './entity/chart/updated.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(mainDataSource),
    TypeOrmModule.forRoot(chartDataSource),
    TypeOrmModule.forFeature([NewsEntity, TeamsEntity]),
    TypeOrmModule.forFeature(
      [
        MonthlyEntity,
        WeeklyEntity,
        DailyEntity,
        HourlyEntity,
        TotalEntity,
        UpdatedEntity,
        ArtistsEntity,
      ],
      'chart',
    ),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
