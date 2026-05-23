import { DocumentActionType } from '@/shared/types/document-action.type';

export const documentActionTranslationKeys: Record<
  NonNullable<DocumentActionType>['type'],
  string
> = {
  'edit-document': 'actions.edit',
  'add-document': 'actions.add',
};
