import { UserBaseInterface } from '@/shared/interfaces/user-base.interface';
import { RoleInterface } from './role.interface';

export interface AuthInterface extends UserBaseInterface {
  googleId: string | null;
  discordId: string | null;
  email: string;
  isVerified: boolean;
  role: RoleInterface;
  isBlocked: boolean;
}
