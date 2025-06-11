import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HopdongController } from './hopdong.controller';
import { HopdongService } from './hopdong.service';
import { HopDong } from './hopdong.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HopDong])],
  controllers: [HopdongController],
  providers: [HopdongService],
})
export class HopdongModule {}
