import { Module } from '@nestjs/common';
import { HoadonController } from './hoadon.controller';
import { HoadonService } from './hoadon.service';

@Module({
  controllers: [HoadonController],
  providers: [HoadonService]
})
export class HoadonModule {}
