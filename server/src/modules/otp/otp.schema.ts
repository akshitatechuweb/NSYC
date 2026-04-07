import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Otp extends Document {
  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true, default: Date.now, index: { expires: '5m' } })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// The 'expiresAt' field will have a TTL index. 
// Note: We might want to pass the expiry time from a config.
// Mongoose TTL index works by checking the field value.
