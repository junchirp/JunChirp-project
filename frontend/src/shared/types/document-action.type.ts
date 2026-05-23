import { DocumentInterface } from '@/shared/interfaces/ducument.interface';

export type DocumentActionType =
  | ((
      | { type: 'edit-document'; item: DocumentInterface }
      | { type: 'add-document' }
    ) & { key: string })
  | null;
