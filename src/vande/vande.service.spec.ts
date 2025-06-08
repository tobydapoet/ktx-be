import { Test, TestingModule } from '@nestjs/testing';
import { VandeService } from './vande.service';

describe('VandeService', () => {
  let service: VandeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VandeService],
    }).compile();

    service = module.get<VandeService>(VandeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
