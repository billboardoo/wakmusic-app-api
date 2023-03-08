import {
  CacheInterceptor,
  CallHandler,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { Cluster, Redis } from 'ioredis';
import {
  CACHE_DEACTIVATE_METADATA,
  CACHE_EVICT_METADATA,
} from '../constants/cache.constants';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from 'src/auth/auth.service';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  private readonly CACHE_EVICT_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

  trackBy(context: ExecutionContext): string | undefined {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as JwtPayload;
    const url = super.trackBy(context);

    if (url == undefined) return url;
    if (user) return `(${user.id}) ${url}`;

    return url;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const reflector: Reflector = this.reflector;
    const deactivate = reflector.getAllAndOverride(CACHE_DEACTIVATE_METADATA, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (deactivate === true) return next.handle();

    const req = context.switchToHttp().getRequest<Request>();
    if (this.CACHE_EVICT_METHODS.includes(req.method)) {
      const evictKeys = reflector.getAllAndMerge(CACHE_EVICT_METADATA, [
        context.getClass(),
        context.getHandler(),
      ]);
      // 캐시 무효화 처리
      return next.handle().pipe(
        tap(() => {
          if (evictKeys.length > 0) return this._clearCaches(evictKeys);
          return this._clearCaches([req.originalUrl]);
        }),
      );
    }

    return super.intercept(context, next);
  }

  /**
   * @param cacheKeys 삭제할 캐시 키 목록
   */
  private async _clearCaches(cacheKeys: string[]): Promise<boolean> {
    const client: Redis = await this.cacheManager.store.getClient();

    const _keys = await Promise.all(
      cacheKeys.map((cacheKey) => client.keys(`*${cacheKey}*`)),
    );
    const keys = _keys.flat();
    const result = await Promise.all(
      keys.map((key) => !!this.cacheManager.del(key)),
    );
    return result.flat().every((r) => !!r);

    // const client: Cluster = await this.cacheManager.store.getClient();
    // const redisNodes = client.nodes();

    // const result2 = await Promise.all(
    //   redisNodes.map(async (redis) => {
    //     const _keys = await Promise.all(
    //       cacheKeys.map((cacheKey) => redis.keys(`*${cacheKey}*`)),
    //     );
    //     const keys = _keys.flat();
    //     return Promise.all(keys.map((key) => !!this.cacheManager.del(key)));
    //   }),
    // );
    // return result2.flat().every((r) => !!r);
  }
}
