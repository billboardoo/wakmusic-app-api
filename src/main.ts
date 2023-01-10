import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as process from 'process';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  staticArtistPath,
  staticNewsPath,
  staticPath,
  staticPlaylistPath,
  staticProfilePath,
} from './utils/path.utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useStaticAssets(staticPath, {
    prefix: '/static',
  });
  app.useStaticAssets(staticNewsPath, {
    prefix: '/static/news',
  });
  app.useStaticAssets(staticArtistPath, {
    prefix: '/static/artist',
  });
  app.useStaticAssets(staticPlaylistPath, {
    prefix: '/static/playlist',
  });
  app.useStaticAssets(staticProfilePath, {
    prefix: '/static/profile',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .addCookieAuth()
    .setTitle('wakmusic app backend')
    .setDescription('왁타버스 뮤직 api 설명서')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      supportedSubmitMethods: [],
    },
  });

  await app.listen(8080);
}
bootstrap();
