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
} from '@nestjs/common';
import { AccountService } from './account.service';

import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { Public } from './public.decorator';
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('me')
  getMe(@Request() req) {
    console.log(req.user);
    return req.user;
  }

  @Roles(2)
  @Get('')
  getAllAccounts() {
    return this.accountService.GetAllAccount();
  }

  @Public()
  @Get(':user')
  async getSV(@Param('user') username: string) {
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
      };
    } else {
      return {
        success: false,
        error: 'Tài khoản hoặc mật khẩu không chính xác!',
      };
    }
  }
}
