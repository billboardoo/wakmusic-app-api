import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';

@Module({
  controllers: [RedirectController],
  providers: [],
})
export class RedirectModule {}
