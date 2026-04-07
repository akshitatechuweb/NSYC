import { IsNotEmpty, IsString, IsEmail, IsOptional, IsNumber, IsDateString, Min, Max } from 'class-validator';

export class CompleteProfileDto {
  // Personal Info
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsDateString()
  dob: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  fullAddress: string;

  // Academic Details
  @IsNotEmpty()
  @IsString()
  class: string;

  @IsNotEmpty()
  @IsString()
  board: string;

  @IsNotEmpty()
  @IsString()
  schoolName: string;

  @IsNotEmpty()
  @IsString()
  schoolType: string;

  @IsNotEmpty()
  @IsString()
  passingYear: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  marksPercentage: number;

  @IsOptional()
  @IsString()
  referenceCode?: string;
}
