import { Test, TestingModule } from '@nestjs/testing';
import { CihazKullaniciService } from './cihaz_kullanici.service';

describe('CihazKullaniciService', () => {
  let service: CihazKullaniciService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CihazKullaniciService],
    }).compile();

    service = module.get<CihazKullaniciService>(CihazKullaniciService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
