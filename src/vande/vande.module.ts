import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VandeController } from './vande.controller';
import { VandeService } from './vande.service';
import { VanDe } from './vande.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VanDe])],
  controllers: [VandeController],
  providers: [VandeService],
})
export class VandeModule {}
