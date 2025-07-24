import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';
import { generateOtp } from 'src/common/utils/otp-generator.util';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('EMAIL_HOST'),
      port: configService.get<number>('EMAIL_PORT'),
      secure: true,
      service: this.configService.get<string>('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get<string>('EMAIL_FROM'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const from = this.configService.get<string>('EMAIL_FROM');

    const mailOptions = {
      from: `"Deeksha-Appinventiv" <${from}>`,
      to,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is: <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`OTP email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${to}`, error.stack);
      throw new Error('Failed to send OTP email');
    }
  }
}
