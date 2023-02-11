import { NestExpressApplication } from '@nestjs/platform-express';
import * as process from 'process';

export const setupPm2 = (app: NestExpressApplication): void => {
  let isDisableKeepAlive = false;

  app.use(function (req, res, next) {
    if (isDisableKeepAlive) {
      res.set('Connection', 'close');
    }
    next();
  });

  process.on('SIGINT', async function () {
    isDisableKeepAlive = true;
    await app.close();
    console.log('server closed');
  });
};
