import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum EnrollmentStatus {
  CREATED = 'created',
  PAYMENT_PENDING = 'payment_pending',
  PAID = 'paid',
}

@Schema({ timestamps: true })
export class Enrollment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  collegeId: string; // Using College Name from JSON as ID

  @Prop({ required: true })
  courseId: string; // Using Course Name from JSON as ID

  @Prop({
    type: String,
    enum: Object.values(EnrollmentStatus),
    default: EnrollmentStatus.CREATED,
  })
  status: EnrollmentStatus;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
