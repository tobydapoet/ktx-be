import { Module } from '@nestjs/common';
import { PhongController } from './phong.controller';
import { PhongService } from './phong.service';

@Module({
  controllers: [PhongController],
  providers: [PhongService]
})
export class PhongModule {}
