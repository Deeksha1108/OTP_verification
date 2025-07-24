import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'deek123@example.com',
    description: 'Email associated with the OTP',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    minLength: 6,
    maxLength: 6,
    description: '6-digit OTP code received on email',
  })
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}
