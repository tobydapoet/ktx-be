import { Module } from '@nestjs/common';
import { NhanvienController } from './nhanvien.controller';
import { NhanvienService } from './nhanvien.service';
import { Phong } from 'src/phong/phong.entity';
import { NhanVien } from './nhanvien.entity';
import { Account } from 'src/account/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([NhanVien, Phong, Account])],
  controllers: [NhanvienController],
  providers: [NhanvienService],
})
export class NhanvienModule {}
