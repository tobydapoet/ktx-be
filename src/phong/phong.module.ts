import { Module } from '@nestjs/common';
import { PhongController } from './phong.controller';
import { PhongService } from './phong.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phong } from './phong.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Phong])],
  controllers: [PhongController],
  providers: [PhongService],
})
export class PhongModule {}
