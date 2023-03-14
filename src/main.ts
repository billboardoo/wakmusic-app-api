import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupSwagger } from './utils/swagger.utils';
import * as process from 'process';
import { setupPm2 } from './utils/pm2.utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

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
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api');

  setupSwagger(app);
  // setupPm2(app);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  process.send = process.send || function () {};

  await app.listen(process.env.PORT, () => {
    // process.send('ready');

    console.log(`application is listening on port ${process.env.PORT}`);
  });
}
bootstrap();
