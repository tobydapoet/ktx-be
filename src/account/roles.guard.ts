import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('account')
export class AccountController {
  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  getProfile(@Request() req) {
    return req.user;
  }
}
