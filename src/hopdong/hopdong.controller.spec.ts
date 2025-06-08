import { Test, TestingModule } from '@nestjs/testing';
import { HopdongController } from './hopdong.controller';

describe('HopdongController', () => {
  let controller: HopdongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HopdongController],
    }).compile();

    controller = module.get<HopdongController>(HopdongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
