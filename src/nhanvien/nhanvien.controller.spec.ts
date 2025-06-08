import { Test, TestingModule } from '@nestjs/testing';
import { NhanvienController } from './nhanvien.controller';

describe('NhanvienController', () => {
  let controller: NhanvienController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NhanvienController],
    }).compile();

    controller = module.get<NhanvienController>(NhanvienController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
