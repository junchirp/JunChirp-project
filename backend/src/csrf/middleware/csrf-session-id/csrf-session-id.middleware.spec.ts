import { CsrfSessionIdMiddleware } from './csrf-session-id.middleware';

describe('CsrfSessionIdMiddleware', () => {
  it('should be defined', () => {
    expect(new CsrfSessionIdMiddleware()).toBeDefined();
  });
});
