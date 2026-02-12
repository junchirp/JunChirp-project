'use client';

import { ReactElement } from 'react';
import VerificationResultContent from '@/shared/components/VerificationResultContent/VerificationResultContent';
import Button from '@/shared/components/Button/Button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function DeletedClient(): ReactElement {
  const router = useRouter();
  const tButtons = useTranslations('buttons');
  const tDeleted = useTranslations('confirmationResult.deleted');

  const handleRegistration = (): void => router.push('/auth/registration');

  return (
    <VerificationResultContent
      title={tDeleted('title')}
      titleType="error"
      button={
        <Button color="green" onClick={handleRegistration}>
          {tButtons('signUp')}
        </Button>
      }
      content={
        <div>
          <p>{tDeleted('description')}</p>
        </div>
      }
    />
  );
}
