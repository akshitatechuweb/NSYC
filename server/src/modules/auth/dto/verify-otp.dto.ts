import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid E.164 format (e.g., +1234567890)',
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 6)
  otp: string;
}
