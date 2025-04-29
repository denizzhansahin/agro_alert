import { Test, TestingModule } from '@nestjs/testing';
import { CihazlarService } from './cihazlar.service';

describe('CihazlarService', () => {
  let service: CihazlarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CihazlarService],
    }).compile();

    service = module.get<CihazlarService>(CihazlarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
