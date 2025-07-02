import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import * as jwt from 'jsonwebtoken';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Blacklist } from 'src/blacklist/blacklist.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Blacklist)
    private blackListRepository: Repository<Blacklist>,
    private readonly jwtService: JwtService,
  ) {}

  async GetAllAccount(): Promise<Account[]> {
    return await this.accountRepository.find();
  }

  async getAccount(username: string): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: { Username: username },
    });
  }

  async Login(
    loginDTO: LoginDTO,
  ): Promise<{ access_token: string; refresh_token: string } | null> {
    const account = await this.accountRepository.findOne({
      where: {
        Username: loginDTO.Username,
        Password: loginDTO.Password,
      },
    });
    if (!account) return null;
    const payload = {
      Username: account.Username,
      Password: account.Password,
      ChucVu: account.ChucVu,
    };

    const refresh_token = this.jwtService.sign(payload, {
      secret: 'KTX_REFRESH_KEY',
      expiresIn: '7d',
    });

    const access_token = this.jwtService.sign(payload, {
      secret: 'KTX_ACCESS_KEY',
      expiresIn: '15m',
    });

    const isBlacklisted = await this.blackListRepository.findOne({
      where: {
        access_token: access_token,
        refresh_token: refresh_token,
      },
    });

    if (isBlacklisted) {
      throw new UnauthorizedException('Refresh token đã bị khóa');
    }

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(
    refresh_token: string,
  ): Promise<{ access_token: string } | null> {
    try {
      const payload = jwt.verify(refresh_token, 'KTX_REFRESH_KEY') as any;

      const account = await this.accountRepository.findOne({
        where: { Username: payload.Username },
      });

      if (!account) return null;

      const newAccessToken = this.jwtService.sign({
        Username: account.Username,
        Password: account.Password,
        ChucVu: account.ChucVu,
      });

      return { access_token: newAccessToken };
    } catch (err) {
      return null;
    }
  }

  async Register(registerDTO: RegisterDTO): Promise<Account> {
    const existing = await this.accountRepository.findOne({
      where: {
        Username: registerDTO.Username,
      },
    });
    if (existing) {
      throw new Error('Username đã tồn tại!');
    }

    const newAccount = this.accountRepository.create({
      Username: registerDTO.Username,
      Password: registerDTO.Password,
      ChucVu: registerDTO.ChucVu,
    });

    return await this.accountRepository.save(newAccount);
  }
}
