import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
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
  staticPlaylistIconPath,
  staticPlaylistPath,
  staticProfilePath,
} from './utils/path.utils';
import { setupSwagger } from './utils/swagger.utils';

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
  app.useStaticAssets(staticPlaylistIconPath, {
    prefix: '/static/playlist/icon',
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
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api');

  setupSwagger(app);

  await app.listen(8080);
}
bootstrap();
