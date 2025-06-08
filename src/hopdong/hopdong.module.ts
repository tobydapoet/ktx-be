import { Module } from '@nestjs/common';
import { HopdongController } from './hopdong.controller';
import { HopdongService } from './hopdong.service';

@Module({
  controllers: [HopdongController],
  providers: [HopdongService]
})
export class HopdongModule {}
