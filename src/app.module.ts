import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  chartDataSource,
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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { QnaModule } from './qna/qna.module';
import { rootPath } from './utils/path.utils';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(rootPath, 'build'),
      exclude: ['/api/(.*)', '/static/(.*)'],
    }),
    TypeOrmModule.forRoot(mainDataSource),
    TypeOrmModule.forRoot(chartDataSource),
    TypeOrmModule.forRoot(userDataSource),
    TypeOrmModule.forRoot(likeDataSource),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
