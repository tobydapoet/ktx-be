import { Module } from '@nestjs/common';
import { HoadonController } from './hoadon.controller';
import { HoadonService } from './hoadon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoaDon } from './hoadon.entity';
import { ChiTietHoaDon } from './chitiethoadon.entity';
import { SinhVien } from 'src/sinhvien/sinhvien.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HoaDon, ChiTietHoaDon, SinhVien])],
  controllers: [HoadonController],
  providers: [HoadonService],
})
export class HoadonModule {}
