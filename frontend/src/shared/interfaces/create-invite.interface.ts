import { CreateRequestInterface } from './create-request.interface';

export interface CreateInviteInterface extends CreateRequestInterface {
  userId: string;
}
