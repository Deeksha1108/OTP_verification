import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { EmailModule } from 'src/email/email.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [EmailModule, RedisModule],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
