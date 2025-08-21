import { z } from 'zod';

export const agreementValidator = z.boolean().refine((val) => val, {
  message: 'Підтверди згоду з умовами та політикою конфіденційності',
});
