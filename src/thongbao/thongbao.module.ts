import { Module } from '@nestjs/common';
import { ThongbaoController } from './thongbao.controller';
import { ThongbaoService } from './thongbao.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThongBao } from './thongbao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThongBao])],
  controllers: [ThongbaoController],
  providers: [ThongbaoService],
})
export class ThongbaoModule {}
