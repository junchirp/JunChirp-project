import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  public constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  public async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl && ttl > 0) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  public async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  public async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  public async addGmailAccessToken(token: string, ttl: number): Promise<void> {
    await this.set('gmail_access_token', token, ttl);
  }

  public async addToWhitelist(jti: string, ttl: number): Promise<void> {
    await this.set(jti, 'whitelisted', ttl);
  }

  public async isTokenValid(jti: string): Promise<boolean> {
    return (await this.redis.get(jti)) !== null;
  }
}
