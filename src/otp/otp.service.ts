import {
  Injectable,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { generateOtp } from 'src/common/utils/otp-generator.util';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private emailService: EmailService,
    private configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  private getOtpKey(email: string): string {
    return `otp:${email}`;
  }

  private getRateLimitKey(email: string): string {
    return `otp:rate-limit:${email}`;
  }

  async sendOtp(dto: SendOtpDto): Promise<{ message: string }> {
    const { email } = dto;
    const redisOtpKey = this.getOtpKey(email);
    const redisRateKey = this.getRateLimitKey(email);
    const expirySeconds =
      Number(this.configService.get('OTP_EXPIRY_MINUTES') || 5) * 60;
    const rateLimitTTL = 60;
    const isRateLimited = await this.redisService.get(redisRateKey);
    if (isRateLimited) {
      throw new BadRequestException(
        'Please wait before requesting another OTP.',
      );
    }

    const otp = generateOtp();

    const hashedOtp = await bcrypt.hash(otp, 10);

    let attempts = 3;
    while (attempts > 0) {
      try {
        await this.emailService.sendOtpEmail(email, otp);
        break;
      } catch (err) {
        this.logger.warn(
          `Failed to send OTP to ${email}, attempts left: ${attempts - 1}`,
        );
        attempts--;
        if (attempts === 0) {
          throw new InternalServerErrorException(
            'Failed to send OTP after multiple attempts.',
          );
        }
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (4 - attempts)),
        );
      }
    }

    await this.redisService.set(redisOtpKey, hashedOtp, expirySeconds);
    await this.redisService.set(redisRateKey, '1', rateLimitTTL);

    this.logger.log(`OTP sent successfully to ${email}`);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(
    dto: VerifyOtpDto,
  ): Promise<{ valid: boolean; message: string }> {
    const { email, otp } = dto;

    const redisOtpKey = this.getOtpKey(email);
    const storedHashedOtp = await this.redisService.get(redisOtpKey);

    if (!storedHashedOtp) {
      throw new BadRequestException('OTP expired or not found.');
    }
    const isMatch = await bcrypt.compare(otp, storedHashedOtp);
    if (!isMatch) {
      throw new BadRequestException('Invalid OTP.');
    }

    await this.redisService.del(redisOtpKey);
    this.logger.log(`OTP verified for ${email}`);
    return { valid: true, message: 'OTP verified successfully' };
  }
}
