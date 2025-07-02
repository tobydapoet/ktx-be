import { Module } from '@nestjs/common';
import { HoadonController } from './hoadon.controller';
import { HoadonService } from './hoadon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoaDon } from './hoadon.entity';
import { ChiTietHoaDon } from './chitiethoadon.entity';
import { SinhVien } from 'src/sinhvien/sinhvien.entity';
import { SinhvienService } from 'src/sinhvien/sinhvien.service';
import { Phong } from 'src/phong/phong.entity';
import { Account } from 'src/account/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HoaDon, ChiTietHoaDon, SinhVien, Phong, Account])],
  controllers: [HoadonController],
  providers: [HoadonService, SinhvienService],
})
export class HoadonModule {}
