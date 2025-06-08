import { Test, TestingModule } from '@nestjs/testing';
import { ThongbaoService } from './thongbao.service';

describe('ThongbaoService', () => {
  let service: ThongbaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThongbaoService],
    }).compile();

    service = module.get<ThongbaoService>(ThongbaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
