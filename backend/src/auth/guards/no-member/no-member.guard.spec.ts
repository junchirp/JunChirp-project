import { NoMemberGuard } from './no-member.guard';

describe('NoMemberGuard', () => {
  it('should be defined', () => {
    expect(new NoMemberGuard()).toBeDefined();
  });
});
