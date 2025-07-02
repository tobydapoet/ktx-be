import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blacklist } from './blacklist.entity';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

@Injectable()
export class BlacklistService {
  constructor(
    @InjectRepository(Blacklist)
    private readonly blackListRepo: Repository<Blacklist>,
  ) {}

  async logout(
    accessToken: string,
    refreshToken: string,
  ): Promise<{ message: string }> {
    try {
      const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
      if (!decoded || !decoded.exp) {
        throw new Error('Token không hợp lệ');
      }

      const expiresAt = new Date(decoded.exp * 1000);

      const blacklist = this.blackListRepo.create({
        access_token: accessToken,
        refresh_token: refreshToken,
        expiresAt,
      });

      await this.blackListRepo.save(blacklist);

      return { message: 'Đăng xuất thành công' };
    } catch (error) {
      throw new Error('Không thể xử lý logout: ' + error.message);
    }
  }

  async isTokenBlacklisted(access_token: string): Promise<boolean> {
    const found = await this.blackListRepo.findOne({ where: { access_token } });
    return !!found;
  }
}
