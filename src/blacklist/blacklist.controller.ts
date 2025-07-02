import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { Roles } from 'src/account/roles.decorator';

@Controller('blacklist')
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Roles(0, 1, 2)
  @Post('logout')
  async logout(@Body() body: { access_token: string; refresh_token: string }) {
    try {
      const result = await this.blacklistService.logout(
        body.access_token,
        body.refresh_token,
      );
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
