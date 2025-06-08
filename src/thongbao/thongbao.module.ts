import { Module } from '@nestjs/common';
import { ThongbaoController } from './thongbao.controller';
import { ThongbaoService } from './thongbao.service';

@Module({
  controllers: [ThongbaoController],
  providers: [ThongbaoService]
})
export class ThongbaoModule {}
