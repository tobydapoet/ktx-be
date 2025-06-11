import { Module } from '@nestjs/common';
import { HoadonController } from './hoadon.controller';
import { HoadonService } from './hoadon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoaDon } from './hoadon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HoaDon])],
  controllers: [HoadonController],
  providers: [HoadonService],
})
export class HoadonModule {}
