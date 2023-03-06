import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { CACHE_EVICT_METADATA } from '../constants/cache.constants';

export const CacheEvict = (
  ...cashEvictKeys: string[]
): CustomDecorator<string> => SetMetadata(CACHE_EVICT_METADATA, cashEvictKeys);
