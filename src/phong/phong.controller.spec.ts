import { Test, TestingModule } from '@nestjs/testing';
import { PhongController } from './phong.controller';

describe('PhongController', () => {
  let controller: PhongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhongController],
    }).compile();

    controller = module.get<PhongController>(PhongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
