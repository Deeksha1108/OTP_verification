import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

export const REDIS_CLIENT = 'REDIS_CLIENT';

const redisProvider = {
  provide: REDIS_CLIENT,
  useFactory: async (configService: ConfigService) => {
    const host = configService.get<string>('REDIS_HOST', 'localhost');
    const port = configService.get<number>('REDIS_PORT', 6379);
    const password = configService.get<string>('REDIS_PASSWORD');
    const tlsEnabled = configService.get<boolean>('REDIS_TLS', false);

    const redis = new Redis({
      host,
      port,
      password,
      tls: tlsEnabled ? {} : undefined,
    });

    redis.on('connect', () => console.log('Redis connected'));
    redis.on('error', (err) => console.error('Redis error', err));

    return redis;
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  providers: [redisProvider, RedisService],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
