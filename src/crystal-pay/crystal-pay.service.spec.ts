import { Test, TestingModule } from '@nestjs/testing';
import { CrystalPayService } from './crystal-pay.service';

describe('CrystalPayService', () => {
  let service: CrystalPayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrystalPayService],
    }).compile();

    service = module.get<CrystalPayService>(CrystalPayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
