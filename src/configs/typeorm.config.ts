import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ArtistsEntity } from '../entitys/chart/artists.entity';
import { MainArtistsEntity } from '../entitys/main/artists.entity';
import { UpdatedEntity } from '../entitys/chart/updated.entity';
import { TotalEntity } from '../entitys/chart/total.entity';
import { MonthlyEntity } from '../entitys/chart/monthly.entity';
import { WeeklyEntity } from '../entitys/chart/weekly.entity';
import { DailyEntity } from '../entitys/chart/daily.entity';
import { HourlyEntity } from '../entitys/chart/hourly.entity';
import { NewsEntity } from '../entitys/main/news.entity';
import { TeamsEntity } from '../entitys/main/teams.entity';
import { rootPath } from '../utils/path.utils';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { UserEntity } from '../entitys/user/user.entity';
import { LikeEntity } from '../entitys/like/like.entity';
import { LikeManagerEntity } from '../entitys/like/manager.entity';
import { RecommendPlaylistEntity } from '../entitys/like/playlist.entity';
import { QnaEntity } from '../entitys/main/qna.entity';
import { NoticeEntity } from '../entitys/main/notice.entity';

export const mainDataSource: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: `${rootPath}/src/database/static.db`,
  entities: [
    NewsEntity,
    TeamsEntity,
    MainArtistsEntity,
    QnaEntity,
    NoticeEntity,
  ],
};

export const chartDataSource: TypeOrmModuleOptions = {
  name: 'chart',
  type: 'sqlite',
  database: `${rootPath}/src/database/charts.db`,
  entities: [
    ArtistsEntity,
    UpdatedEntity,
    TotalEntity,
    MonthlyEntity,
    WeeklyEntity,
    DailyEntity,
    HourlyEntity,
  ],
};

export const userDataSource: TypeOrmModuleOptions = {
  name: 'user',
  type: 'sqlite',
  database: `${rootPath}/src/database/user.db`,
  entities: [PlaylistEntity, UserEntity],
};

export const likeDataSource: TypeOrmModuleOptions = {
  name: 'like',
  type: 'sqlite',
  database: `${rootPath}/src/database/like.db`,
  entities: [LikeEntity, LikeManagerEntity, RecommendPlaylistEntity],
  synchronize: false,
};
