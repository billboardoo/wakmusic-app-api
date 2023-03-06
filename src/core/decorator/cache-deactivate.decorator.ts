import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { CACHE_DEACTIVATE_METADATA } from '../constants/cache.constants';

export const CacheDeactivate = (): CustomDecorator<string> =>
  SetMetadata(CACHE_DEACTIVATE_METADATA, true);
