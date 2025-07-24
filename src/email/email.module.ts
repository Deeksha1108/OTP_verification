import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [ConfigModule, RedisModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
