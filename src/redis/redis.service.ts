import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  async set(
    key: string,
    value: string,
    expireInSeconds: number,
  ): Promise<void> {
    await this.redisClient.set(key, value, 'EX', expireInSeconds);
    this.logger.debug(`SET ${key} -> "${value}" (TTL: ${expireInSeconds}s)`);
  }

  async get(key: string): Promise<string | null> {
    const value = await this.redisClient.get(key);
    this.logger.debug(`GET ${key} -> "${value}"`);
    return value;
  }

  async del(key: string): Promise<number> {
    const result = await this.redisClient.del(key);
    this.logger.debug(`DEL ${key} -> ${result}`);
    return result;
  }

  async ttl(key: string): Promise<number> {
    const ttl = await this.redisClient.ttl(key);
    this.logger.debug(`TTL ${key} -> ${ttl}s`);
    return ttl;
  }

  async incr(key: string): Promise<number> {
    const count = await this.redisClient.incr(key);
    this.logger.debug(`INCR ${key} -> ${count}`);
    return count;
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    const result = await this.redisClient.expire(key, seconds);
    this.logger.debug(`EXPIRE ${key} -> ${seconds}s => ${result}`);
    return result === 1;
  }
}
