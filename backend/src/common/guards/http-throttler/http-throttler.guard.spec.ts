import { HttpThrottlerGuard } from './http-throttler.guard';

describe('HttpThrottlerGuard', () => {
  it('should be defined', () => {
    expect(new HttpThrottlerGuard()).toBeDefined();
  });
});
