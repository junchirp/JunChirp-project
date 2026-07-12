import { Test, TestingModule } from '@nestjs/testing';
import { CookieConfigService } from './cookie-config.service';

describe('CookieConfigService', () => {
  let service: CookieConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CookieConfigService],
    }).compile();

    service = module.get<CookieConfigService>(CookieConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
