import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CollegesService } from './colleges.service';
import { GetCollegesQueryDto } from './dto/get-colleges-query.dto';

@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  findAll(@Query() query: GetCollegesQueryDto) {
    return this.collegesService.findAll(query);
  }
}
