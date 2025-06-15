import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { AccountService } from './account.service';

import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('')
  async getALl() {
    return await this.accountService.GetAllAccount();
  }

  @Get(':user')
  async getSV(@Param('user') username: string) {
    return await this.accountService.getAccount(username);
  }

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

  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<any> {
    const account = await this.accountService.Login(loginDTO);
    if (account) {
      return {
        success: true,
        data: account,
      };
    } else {
      return {
        success: false,
        error: 'Tài khoản hoặc mật khẩu không chính xác!',
      };
    }
  }
}
