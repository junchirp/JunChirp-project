'use client';

import { ReactElement, useEffect, useRef, useState } from 'react';
import styles from './DocsClient.module.scss';
import DocsList from './DocsList/DocsList';
import {
  useDeleteDocumentMutation,
  useGetDocumentsQuery,
} from '@/api/documentsApi';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { useGetProjectByIdQuery } from '@/api/projectsApi';
import { DocumentActionType } from '@/shared/types/document-action.type';
import { documentActionTranslationKeys } from '@/shared/constants/document-action-translation-keys';
import { DocumentInterface } from '@/shared/interfaces/ducument.interface';
import ActionDescription from '@/shared/components/ActionDescription/ActionDescription';
import DocsForm from './DocsForm/DocsForm';
import DeleteDocumentPopup from './DeleteDocumentPopup/DeleteDocumentPopup';
import { useToast } from '@/hooks/useToast';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useTranslations } from 'next-intl';
import DocsListSkeleton from './DocsListSkeleton/DocsListSkeleton';

export default function DocsClient(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const { data = [], isLoading: listLoading } = useGetDocumentsQuery(id);
  const user = useAppSelector(authSelector.selectRequiredUser);
  const { data: project, isLoading: projectLoading } =
    useGetProjectByIdQuery(id);
  const isLoading = listLoading || projectLoading;
  const isOwner = user.id === project?.ownerId;
  const [action, setAction] = useState<DocumentActionType>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [deletedItem, setDeletedItem] = useState<DocumentInterface | null>(
    null,
  );
  const [deleteDocument, { isLoading: deleteDocLoading }] =
    useDeleteDocumentMutation();
  const { showToast, isActive } = useToast();
  const t = useTranslations('documents');

  useEffect(() => {
    if (action && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [action]);

  const handleCancel = (): void => setAction(null);
  const openPopup = (item: DocumentInterface): void => setDeletedItem(item);
  const closePopup = (): void => setDeletedItem(null);

  const handleAddDocument = (): void =>
    setAction({
      type: 'add-document',
      key: documentActionTranslationKeys['add-document'],
    });

  const handleEditDocument = (item: DocumentInterface): void =>
    setAction({
      type: 'edit-document',
      key: documentActionTranslationKeys['edit-document'],
      item,
    });

  const handleDeleteDocument = async (
    item: DocumentInterface,
  ): Promise<void> => {
    if (isActive(ToastKeysEnum.DOCUMENT)) {
      return;
    }

    try {
      await deleteDocument({ id: item.id, projectId: item.projectId }).unwrap();
      closePopup();
      showToast({
        severity: 'success',
        summary: t('success'),
        life: 3000,
        actionKey: ToastKeysEnum.DOCUMENT,
      });
    } catch {
      closePopup();
      showToast({
        severity: 'error',
        summary: t('error'),
        life: 3000,
        actionKey: ToastKeysEnum.DOCUMENT,
      });
    }
  };

  return isLoading ? (
    <DocsListSkeleton />
  ) : (
    <>
      <div className={styles['docs-client']}>
        <DocsList
          docs={data}
          isOwner={isOwner}
          addDoc={handleAddDocument}
          editDoc={handleEditDocument}
          deleteDoc={openPopup}
        />
        {!!action && isOwner && (
          <div className={styles['docs-client__actions']} ref={formRef}>
            <ActionDescription actionKey={action.key} namespace="documents" />
            <DocsForm
              initialValues={
                action?.type === 'edit-document' ? action.item : undefined
              }
              onCancel={handleCancel}
            />
          </div>
        )}
      </div>
      {deletedItem && (
        <DeleteDocumentPopup
          isOpen={!!deletedItem}
          onClose={closePopup}
          onConfirm={handleDeleteDocument}
          doc={deletedItem}
          isLoading={deleteDocLoading}
        />
      )}
    </>
  );
}
