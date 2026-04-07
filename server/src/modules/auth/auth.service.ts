import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '../otp/otp.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private otpService: OtpService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(phoneNumber: string): Promise<{ message: string }> {
    const otp = await this.otpService.generateOtp(phoneNumber);
    await this.otpService.sendOtp(phoneNumber, otp);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(phoneNumber: string, otp: string): Promise<{ accessToken: string }> {
    const isValid = await this.otpService.verifyOtp(phoneNumber, otp);
    
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    let user = await this.usersService.findByPhoneNumber(phoneNumber);
    
    if (!user) {
      // If user doesn't exist, register them
      user = await this.usersService.create(phoneNumber);
    }

    const payload = { 
      sub: user._id, 
      phoneNumber: user.phoneNumber 
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
