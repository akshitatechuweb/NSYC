import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, required: true })
  phoneNumber: string;

  @Prop({ default: false })
  isVerified: boolean;

  // Personal Info
  @Prop()
  fullName?: string;

  @Prop()
  email?: string;

  @Prop()
  gender?: string;

  @Prop()
  dob?: Date;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  fullAddress?: string;

  // Academic Details
  @Prop()
  class?: string;

  @Prop()
  board?: string;

  @Prop()
  schoolName?: string;

  @Prop()
  schoolType?: string;

  @Prop()
  passingYear?: string;

  @Prop()
  marksPercentage?: number;

  @Prop()
  referenceCode?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
