import { UserBaseInterface } from '@/shared/interfaces/user-base.interface';
import { UserParticipationInMyProjectsInterface } from '@/shared/interfaces/user-participation-in-my-projects.interface';

export interface UserCardInterface extends UserBaseInterface {
  projectParticipationSummary: UserParticipationInMyProjectsInterface;
}
