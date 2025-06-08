import { Module } from '@nestjs/common';
import { NhanvienController } from './nhanvien.controller';
import { NhanvienService } from './nhanvien.service';

@Module({
  controllers: [NhanvienController],
  providers: [NhanvienService]
})
export class NhanvienModule {}
