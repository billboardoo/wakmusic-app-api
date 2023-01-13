import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .addCookieAuth(
      'token',
      {
        type: 'http',
        name: 'JWT',
        in: 'cookie',
        scheme: 'bearer',
      },
      'token',
    )
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
};
