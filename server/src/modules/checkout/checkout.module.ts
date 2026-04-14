import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { CollegesModule } from '../colleges/colleges.module';

@Module({
  imports: [EnrollmentsModule, CollegesModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
