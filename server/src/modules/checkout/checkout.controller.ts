import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutResponseDto } from './dto/checkout-response.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get(':enrollmentId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCheckout(@Param('enrollmentId') enrollmentId: string): Promise<CheckoutResponseDto> {
    return this.checkoutService.getCheckoutDetails(enrollmentId);
  }
}
