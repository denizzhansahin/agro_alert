import { Test, TestingModule } from '@nestjs/testing';
import { GozlemlerService } from './gozlemler.service';

describe('GozlemlerService', () => {
  let service: GozlemlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GozlemlerService],
    }).compile();

    service = module.get<GozlemlerService>(GozlemlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
