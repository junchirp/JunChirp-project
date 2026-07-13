import { Module } from '@nestjs/common';
import { CsrfService } from './csrf.service';
import { CsrfController } from './csrf.controller';
import { CookieConfigModule } from '../cookie-config/cookie-config.module';
import { CsrfProtectionMiddleware } from './middleware/csrf-protection/csrf-protection.middleware';
import { CsrfSessionIdMiddleware } from './middleware/csrf-session-id/csrf-session-id.middleware';

@Module({
  imports: [CookieConfigModule],
  controllers: [CsrfController],
  providers: [CsrfService, CsrfProtectionMiddleware, CsrfSessionIdMiddleware],
  exports: [CsrfService],
})
export class CsrfModule {}
