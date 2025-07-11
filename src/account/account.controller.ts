import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountService } from './account.service';

import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { Roles } from './roles.decorator';
import { Public } from './public.decorator';
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Roles(0, 1, 2)
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }

  @Roles(2)
  @Get('')
  getAllAccounts() {
    return this.accountService.GetAllAccount();
  }

  @Roles(0, 1, 2)
  @Get(':user')
  async getUser(@Param('user') username: string) {
    return await this.accountService.getAccount(username);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDTO: RegisterDTO): Promise<any> {
    try {
      const account = await this.accountService.Register(registerDTO);
      return {
        success: true,
        data: account,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message || 'Đăng ký thất bại',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<any> {
    const account = await this.accountService.Login(loginDTO);
    if (account) {
      return {
        success: true,
        access_token: account.access_token,
        refresh_token: account.refresh_token,
      };
    } else {
      return {
        success: false,
        error: 'Tài khoản hoặc mật khẩu không chính xác!',
      };
    }
  }

  @Public()
  @Post('refresh')
  async handleRefreshToken(@Body() body: { refresh_token: string }) {
    const result = await this.accountService.refreshToken(body.refresh_token);
    if (!result) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
    return result;
  }
}
