import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from 'src/account/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Roles(0, 1, 2)
  @Post('generate')
  async generate(@Body() body: { cccd: string }) {
    const { cccd } = body;
    const data = await this.authService.generateSecret(cccd);
    const qr = await this.authService.generateQrCode(data.secret, cccd);
    return { cccd, ...data, qr };
  }

  @Roles(0, 1, 2)
  @Post('verify')
  async verify(@Body() body: { cccd: string; otp: string }) {
    return await this.authService.verifyOtp(body.cccd, body.otp);
  }
}
