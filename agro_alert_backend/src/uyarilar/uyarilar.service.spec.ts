import { Test, TestingModule } from '@nestjs/testing';
import { UyarilarService } from './uyarilar.service';

describe('UyarilarService', () => {
  let service: UyarilarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UyarilarService],
    }).compile();

    service = module.get<UyarilarService>(UyarilarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
