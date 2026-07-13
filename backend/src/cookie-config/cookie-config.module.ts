import { Module } from '@nestjs/common';
import { CookieConfigService } from './cookie-config.service';

@Module({
  providers: [CookieConfigService],
  exports: [CookieConfigService],
})
export class CookieConfigModule {}
