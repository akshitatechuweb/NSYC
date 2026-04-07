import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    // The decoded user data from JWT is available in req.user
    return this.usersService.findById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete-profile')
  async completeProfile(@Request() req: any, @Body() data: CompleteProfileDto) {
    const userId = req.user.sub;
    const user = await this.usersService.updateProfile(userId, data);
    return {
      message: 'Profile completed successfully',
      user,
    };
  }
}
