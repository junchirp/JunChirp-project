'use client';

import { ReactElement } from 'react';
import Dialog from '@/shared/components/Dialog/Dialog';
import { DocumentInterface } from '@/shared/interfaces/ducument.interface';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import Button from '@/shared/components/Button/Button';
import { useTranslations } from 'next-intl';
import styles from './DeleteDocumentPopup.module.scss';

interface DeleteDocumentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: DocumentInterface) => void;
  doc: DocumentInterface;
  loading: boolean;
}

export default function DeleteDocumentPopup(
  props: DeleteDocumentPopupProps,
): ReactElement {
  const { isOpen, doc, onClose, onConfirm, loading } = props;
  const tButtons = useTranslations('buttons');
  const tPopup = useTranslations('deleteDocumentPopup');

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={tPopup('title')} />
      <DialogBody>
        <div className={styles['delete-document-popup__body']}>
          <p className={styles['delete-document-popup__warning']}>
            {tPopup('warning')}
          </p>
          <p>
            {tPopup.rich('description', {
              doc: (chunks) => (
                <span className={styles['delete-document-popup__description']}>
                  [{chunks}]
                </span>
              ),
              documentName: doc.documentName,
            })}
          </p>
        </div>
      </DialogBody>
      <DialogFooter>
        <DialogFooter>
          <Button color="green" variant="secondary-frame" onClick={onClose}>
            {tButtons('cancel')}
          </Button>
          <Button
            color="green"
            loading={loading}
            onClick={() => onConfirm(doc)}
          >
            {tButtons('delete')}
          </Button>
        </DialogFooter>
      </DialogFooter>
    </Dialog>
  );
}
