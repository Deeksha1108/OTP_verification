import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    example: 'deek123@example.com',
    description: 'Valid email address to receive the OTP',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
