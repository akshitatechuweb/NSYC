import { Controller, Post, Body, Get, Param, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentStatus } from './schemas/enrollment.schema';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findById(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: EnrollmentStatus,
  ) {
    return this.enrollmentsService.updateStatus(id, status);
  }
}
