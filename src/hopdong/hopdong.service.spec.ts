import { Test, TestingModule } from '@nestjs/testing';
import { HopdongService } from './hopdong.service';

describe('HopdongService', () => {
  let service: HopdongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HopdongService],
    }).compile();

    service = module.get<HopdongService>(HopdongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
