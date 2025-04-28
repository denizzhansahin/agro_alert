import { Test, TestingModule } from '@nestjs/testing';
import { KullanicilarService } from './kullanicilar.service';

describe('KullanicilarService', () => {
  let service: KullanicilarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KullanicilarService],
    }).compile();

    service = module.get<KullanicilarService>(KullanicilarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
