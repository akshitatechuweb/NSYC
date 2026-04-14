import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { EnrollmentStatus } from '../schemas/enrollment.schema';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  collegeId: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;
}
