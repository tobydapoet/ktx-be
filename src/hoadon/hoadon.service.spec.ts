import { Test, TestingModule } from '@nestjs/testing';
import { HoadonService } from './hoadon.service';

describe('HoadonService', () => {
  let service: HoadonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HoadonService],
    }).compile();

    service = module.get<HoadonService>(HoadonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
