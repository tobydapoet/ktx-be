import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NhanVien } from 'src/nhanvien/nhanvien.entity';
import { SinhVien } from 'src/sinhvien/sinhvien.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, NhanVien, SinhVien])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
