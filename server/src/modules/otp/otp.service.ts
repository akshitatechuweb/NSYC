import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from './otp.schema';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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
    const renflairConfig = this.configService.get('otp.renflair');
    
    if (useRealSms && renflairConfig.apiKey) {
      try {
        const url = `${renflairConfig.baseUrl}?API=${renflairConfig.apiKey}&PHONE=${phoneNumber}&OTP=${otp}`;
        this.logger.log(`Sending real SMS via Renflair: ${phoneNumber}`);
        
        const response = await axios.get(url);
        this.logger.log(`Renflair response: ${JSON.stringify(response.data)}`);
      } catch (error) {
        this.logger.error(`Failed to send SMS via Renflair: ${error.message}`);
        throw new Error('Failed to send OTP. Please try again later.');
      }
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
