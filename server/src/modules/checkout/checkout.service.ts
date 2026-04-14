import { Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { CollegesService } from '../colleges/colleges.service';
import { CheckoutResponseDto } from './dto/checkout-response.dto';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    private readonly collegesService: CollegesService,
  ) {}

  async getCheckoutDetails(enrollmentId: string): Promise<CheckoutResponseDto> {
    // 1. Fetch enrollment
    const enrollment = await this.enrollmentsService.findById(enrollmentId);

    // 2. Fetch course details to get current registration fee
    const courseDetails = this.collegesService.findOneCourse(
      enrollment.collegeId,
      enrollment.courseId,
    );

    if (!courseDetails) {
      throw new NotFoundException(
        `Course details not found for College: ${enrollment.collegeId}, Course: ${enrollment.courseId}`,
      );
    }

    // 3. Fee Calculations
    const registrationFee = courseDetails.fees;
    const platformFee = 150;
    const subtotal = registrationFee + platformFee;
    const gstRate = 0.18;
    const gst = Math.round(subtotal * gstRate * 100) / 100;
    const total = subtotal + gst;

    // 4. Return structured response
    return {
      enrollmentId: enrollment._id.toString(),
      collegeName: enrollment.collegeId,
      courseName: enrollment.courseId,
      currency: 'INR',
      feeBreakdown: {
        registrationFee,
        platformFee,
        gst,
        total,
      },
    };
  }
}
