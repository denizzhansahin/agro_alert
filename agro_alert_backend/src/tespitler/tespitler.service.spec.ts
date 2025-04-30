import { Test, TestingModule } from '@nestjs/testing';
import { TespitlerService } from './tespitler.service';

describe('TespitlerService', () => {
  let service: TespitlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TespitlerService],
    }).compile();

    service = module.get<TespitlerService>(TespitlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
