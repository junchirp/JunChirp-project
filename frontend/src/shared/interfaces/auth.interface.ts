import { UserCardInterface } from './user-card.interface';
import { RoleInterface } from './role.interface';

export interface AuthInterface extends UserCardInterface {
  googleId: string | null;
  discordId: string | null;
  email: string;
  isVerified: boolean;
  role: RoleInterface;
}
