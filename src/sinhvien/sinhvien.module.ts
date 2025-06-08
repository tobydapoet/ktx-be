import { Module } from '@nestjs/common';
import { SinhvienController } from './sinhvien.controller';
import { SinhvienService } from './sinhvien.service';

@Module({
  controllers: [SinhvienController],
  providers: [SinhvienService],
})
export class SinhvienModule {}
