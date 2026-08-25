import { RoleWithProjectInterface } from './role-with-project.interface';
import { ParticipationStatusType } from '@/shared/types/participation-status.type';

export interface ProjectParticipationInterface {
  id: string;
  userId: string;
  status: ParticipationStatusType;
  createdAt: Date;
  acceptedAt: Date | null;
  reservedAt: Date | null;
  canceledAt: Date | null;
  rejectedAt: Date | null;
  projectRole: RoleWithProjectInterface;
}
