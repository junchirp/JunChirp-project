import {
  type ParticipationInvite,
  type ParticipationRequest,
} from '@prisma/client';

export type ParticipationModelType = ParticipationRequest | ParticipationInvite;
