import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  chartDataSource,
  dataDataSource,
  likeDataSource,
  mainDataSource,
  userDataSource,
} from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { NewsEntity } from './entitys/main/news.entity';
import { TeamsEntity } from './entitys/main/teams.entity';
import { DataSource } from 'typeorm';
import { ChartsModule } from './charts/charts.module';
import { SongsModule } from './songs/songs.module';
import { ArtistModule } from './artist/artist.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RedirectModule } from './redirect/redirect.module';
import { PlaylistModule } from './playlist/playlist.module';
import { LikeModule } from './like/like.module';
import { QnaModule } from './qna/qna.module';
import { NoticeModule } from './notice/notice.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { CategoriesModule } from './categories/categories.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TypeOrmModule.forRoot(mainDataSource),
    TypeOrmModule.forRoot(chartDataSource),
    TypeOrmModule.forRoot(userDataSource),
    TypeOrmModule.forRoot(likeDataSource),
    TypeOrmModule.forRoot(dataDataSource),
    TypeOrmModule.forFeature([NewsEntity, TeamsEntity]),
    ChartsModule,
    SongsModule,
    ArtistModule,
    AuthModule,
    UserModule,
    RedirectModule,
    PlaylistModule,
    LikeModule,
    QnaModule,
    NoticeModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
