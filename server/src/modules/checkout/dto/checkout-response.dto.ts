export class FeeBreakdown {
  registrationFee: number;
  platformFee: number;
  gst: number;
  total: number;
}

export class CheckoutResponseDto {
  enrollmentId: string;
  collegeName: string;
  courseName: string;
  feeBreakdown: FeeBreakdown;
  currency: string;
}
