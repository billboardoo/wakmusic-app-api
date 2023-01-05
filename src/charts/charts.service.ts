import { Injectable } from '@nestjs/common';
import { MonthlyEntity } from '../entitys/chart/monthly.entity';
import { WeeklyEntity } from '../entitys/chart/weekly.entity';
import { DailyEntity } from '../entitys/chart/daily.entity';
import { HourlyEntity } from '../entitys/chart/hourly.entity';
import { TotalEntity } from '../entitys/chart/total.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdatedEntity } from '../entitys/chart/updated.entity';
import { FindChartsQueryDto } from './dto/query/find-charts.query.dto';
export const entityByType = {
  monthly: MonthlyEntity,
  weekly: WeeklyEntity,
  daily: DailyEntity,
  hourly: HourlyEntity,
  total: TotalEntity,
};

@Injectable()
export class ChartsService {
  constructor(
    @InjectDataSource('chart')
    private readonly dataSourceChart: DataSource,
    @InjectRepository(TotalEntity, 'chart')
    private readonly totalRepository: Repository<TotalEntity>,
    @InjectRepository(UpdatedEntity, 'chart')
    private readonly updatedRepository: Repository<UpdatedEntity>,
  ) {}

  async findCharts(query: FindChartsQueryDto): Promise<Array<TotalEntity>> {
    const type = query.type;
    const limit = query.limit || 10;

    let charts: Array<TotalEntity>;

    if (type == 'total') charts = await this._findChartsByTotal(limit);
    else charts = await this._findCharts(type, limit);

    return charts;
  }

  private async _findCharts(
    type: string,
    limit: number,
  ): Promise<Array<TotalEntity>> {
    const chart = this.dataSourceChart
      .createQueryBuilder(entityByType[type], type)
      .orderBy(`${type}.increase`, 'DESC')
      .limit(limit);

    const result = await chart.getMany();

    const finalCharts: Array<TotalEntity> = [];

    for (const i of result) {
      const totalChart = await this.totalRepository.findOne({
        where: {
          id: i.id,
        },
      });
      finalCharts.push(totalChart);
    }

    return finalCharts;
  }

  private async _findChartsByTotal(limit: number): Promise<Array<TotalEntity>> {
    const chart = await this.totalRepository.find({
      order: {
        views: {
          direction: 'DESC',
        },
      },
      take: limit,
    });
    return chart;
  }

  async findUpdated(): Promise<number> {
    const updated = await this.updatedRepository.findOne({ where: {} });
    return updated.time;
  }
}
