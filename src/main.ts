import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
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
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

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

  let isDisableKeepAlive = false;

  app.use(function (req, res, next) {
    if (isDisableKeepAlive) {
      res.set('Connection', 'close');
    }
    next();
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  process.send = process.send || function () {};

  await app.listen(process.env.PORT, () => {
    process.send('ready');

    console.log(`application is listening on port ${process.env.PORT}`);
  });

  process.on('SIGINT', function () {
    isDisableKeepAlive = true;
    app.close();
    console.log('server closed');
  });
}
bootstrap();
