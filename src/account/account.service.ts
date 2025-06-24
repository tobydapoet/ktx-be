import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
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

  async Login(loginDTO: LoginDTO): Promise<{ access_token: string } | null> {
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
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
    };
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
