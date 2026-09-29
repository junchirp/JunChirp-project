import { z } from 'zod';
import { socialNetworks } from '@/shared/constants/social-networks';
import { TFunctionType } from '@/shared/types/t-function.type';

interface SocialCheckData {
  network: string;
  url: string;
}

export const socialRefinement =
  (t: TFunctionType) =>
  ({ network, url }: SocialCheckData, ctx: z.RefinementCtx): void => {
    const match = socialNetworks.find(
      (item) => item.network.toLowerCase() === network.toLowerCase(),
    );

    if (!match) {
      return;
    }

    if (!match.urlRegex.test(url)) {
      ctx.addIssue({
        code: 'custom',
        message: t('errors.invalidUrl'),
        path: ['url'],
      });
    }
  };
