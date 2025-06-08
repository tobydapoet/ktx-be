import { Module } from '@nestjs/common';
import { VandeController } from './vande.controller';
import { VandeService } from './vande.service';

@Module({
  controllers: [VandeController],
  providers: [VandeService]
})
export class VandeModule {}
