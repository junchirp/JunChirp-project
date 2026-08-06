import { CsrfProtectionMiddleware } from './csrf-protection.middleware';

describe('CsrfProtectionMiddleware', () => {
  it('should be defined', () => {
    expect(new CsrfProtectionMiddleware()).toBeDefined();
  });
});
