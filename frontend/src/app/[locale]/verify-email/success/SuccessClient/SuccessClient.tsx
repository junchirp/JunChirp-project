'use client';

import { ReactElement } from 'react';
import VerificationResultContent from '@/shared/components/VerificationResultContent/VerificationResultContent';
import Button from '@/shared/components/Button/Button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SuccessClient(): ReactElement {
  const router = useRouter();
  const tButtons = useTranslations('buttons');
  const tSuccess = useTranslations('confirmationResult.success');
  const tContent: string[] = tSuccess.raw('description');

  const handleLogin = (): void => router.push('/auth/login');

  return (
    <VerificationResultContent
      title={tSuccess('title')}
      titleType="success"
      button={
        <Button color="green" onClick={handleLogin}>
          {tButtons('signIn')}
        </Button>
      }
      content={
        <div>
          {tContent.map((chunk, index) => (
            <p key={index}>{chunk}</p>
          ))}
        </div>
      }
    />
  );
}
