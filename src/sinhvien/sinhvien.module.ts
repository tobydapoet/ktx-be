import { Module } from '@nestjs/common';
import { SinhvienController } from './sinhvien.controller';
import { SinhvienService } from './sinhvien.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SinhVien } from './sinhvien.entity';
import { Phong } from 'src/phong/phong.entity';
import { Account } from 'src/account/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SinhVien, Phong, Account])],
  controllers: [SinhvienController],
  providers: [SinhvienService],
})
export class SinhvienModule {}
