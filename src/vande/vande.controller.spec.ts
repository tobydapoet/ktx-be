import { Test, TestingModule } from '@nestjs/testing';
import { VandeController } from './vande.controller';

describe('VandeController', () => {
  let controller: VandeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VandeController],
    }).compile();

    controller = module.get<VandeController>(VandeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
