import { Test, TestingModule } from '@nestjs/testing';
import { ThongbaoController } from './thongbao.controller';

describe('ThongbaoController', () => {
  let controller: ThongbaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThongbaoController],
    }).compile();

    controller = module.get<ThongbaoController>(ThongbaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
