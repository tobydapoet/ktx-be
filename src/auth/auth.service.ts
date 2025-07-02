import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { NhanVien } from 'src/nhanvien/nhanvien.entity';
import { SinhVien } from 'src/sinhvien/sinhvien.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,

    @InjectRepository(SinhVien)
    private readonly svRepo: Repository<SinhVien>,

    @InjectRepository(NhanVien)
    private readonly nvRepo: Repository<NhanVien>,
  ) {}

  async generateSecret(cccd: string) {
    const secret = speakeasy.generateSecret({
      name: `utt (${cccd})`,
      issuer: 'utt',
    });

    const sinhVien = await this.svRepo.findOne({ where: { CCCD: cccd } });
    let cccdUser: string | null = null;

    if (sinhVien) {
      cccdUser = sinhVien.CCCD;
    } else {
      const nhanVien = await this.nvRepo.findOne({ where: { CCCD: cccd } });
      if (nhanVien) {
        cccdUser = nhanVien.CCCD;
      }
    }

    if (!cccdUser) {
      throw new NotFoundException('Không tìm thấy người dùng với CCCD này.');
    }

    let auth = await this.authRepo.findOne({ where: { cccd } });

    if (!auth) {
      auth = this.authRepo.create({ cccd });
    }

    auth.twoFaSecret = secret.base32;
    await this.authRepo.save(auth);

    // const otp = speakeasy.totp({
    //   secret: secret.base32,
    //   encoding: 'base32',
    // });

    return {
      secret: secret.base32,
      // otp,
    };
  }

  async generateQrCode(secret: string, cccd: string): Promise<string> {
    const otpAuthUrl = speakeasy.otpauthURL({
      secret,
      label: cccd,
      issuer: 'utt',
      encoding: 'base32',
    });

    const qr = await qrcode.toDataURL(otpAuthUrl);
    return qr;
  }

  async verifyOtp(cccd: string, otp: string) {
    const auth = await this.authRepo.findOne({ where: { cccd } });

    if (!auth || !auth.twoFaSecret) {
      throw new NotFoundException('Người dùng chưa thiết lập 2FA');
    }

    const isValid = speakeasy.totp.verify({
      secret: auth.twoFaSecret,
      encoding: 'base32',
      token: otp,
      window: 1,
    });

    if (!isValid) {
      throw new UnauthorizedException('Mã OTP không đúng');
    }

    return { success: true };
  }
}
