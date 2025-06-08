import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  async GetAllAccount(): Promise<Account[]> {
    return await this.accountRepository.find();
  }

  async Login(loginDTO: LoginDTO): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: { Username: loginDTO.username, Password: loginDTO.password },
    });
  }

  async Register(registerDTO: RegisterDTO): Promise<Account> {
    const existing = await this.accountRepository.findOne({
      where: {
        Username: registerDTO.username,
        Password: registerDTO.password,
        ChucVu: registerDTO.ChucVu,
      },
    });
    if (existing) {
      throw new Error('Username đã tồn tại!');
    }

    const newAccount = this.accountRepository.create({
      Username: registerDTO.username,
      Password: registerDTO.password,
      ChucVu: registerDTO.ChucVu,
      DateTime: new Date(),
      online: 0,
      log: '',
    });

    return await this.accountRepository.save(newAccount);
  }
}
