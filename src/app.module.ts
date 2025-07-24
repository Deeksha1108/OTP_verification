import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OtpModule } from './otp/otp.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OtpModule,
    EmailModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
