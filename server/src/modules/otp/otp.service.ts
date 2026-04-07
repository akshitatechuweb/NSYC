import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from './otp.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    private configService: ConfigService,
  ) {}

  async generateOtp(phoneNumber: string): Promise<string> {
    const length = this.configService.get<number>('otp.length') || 6;
    const otp = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
    
    const expiryMinutes = this.configService.get<number>('otp.expiryMinutes') || 5;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

    // Remove any existing OTP for this phone number
    await this.otpModel.deleteMany({ phoneNumber });

    // Store new OTP
    await new this.otpModel({
      phoneNumber,
      otp,
      expiresAt,
    }).save();

    return otp;
  }

  async sendOtp(phoneNumber: string, otp: string): Promise<void> {
    const useRealSms = this.configService.get<boolean>('otp.useRealSms');
    
    if (useRealSms) {
      // Integration with Fast2SMS or other providers would go here
      this.logger.log(`Sending real SMS to ${phoneNumber} with OTP: ${otp}`);
    } else {
      // Mock SMS
      this.logger.log(`[MOCK SMS] Sending OTP ${otp} to ${phoneNumber}`);
      console.log(`\n************************************************`);
      console.log(`[DEV] OTP for ${phoneNumber} is: ${otp}`);
      console.log(`************************************************\n`);
    }
  }

  async verifyOtp(phoneNumber: string, otp: string): Promise<boolean> {
    const record = await this.otpModel.findOne({
      phoneNumber,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (record) {
      // Consume the OTP after verification
      await this.otpModel.deleteOne({ _id: record._id });
      return true;
    }

    return false;
  }
}
