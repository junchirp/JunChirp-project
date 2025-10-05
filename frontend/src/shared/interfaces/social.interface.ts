import { CreateSocialInterface } from './create-social.interface';

export interface SocialInterface extends CreateSocialInterface {
  id: string;
}

export interface ClientSocialInterface extends CreateSocialInterface {
  icon: string;
  urlRegex: RegExp;
}
