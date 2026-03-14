'use client';

import { ReactElement } from 'react';
import VerificationResultContent from '@/shared/components/VerificationResultContent/VerificationResultContent';
import Button from '@/shared/components/Button/Button';
import BirdBackground from '@/shared/components/BirdBackground/BirdBackground';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function ErrorClient(): ReactElement {
  const router = useRouter();
  const t = useTranslations('resetPassword.error');

  const handleRedirect = (): void => {
    router.push('/request-password-reset');
  };

  return (
    <BirdBackground>
      <VerificationResultContent
        title={t('title')}
        titleType="error"
        content={
          <div>
            <p>
              {t.rich('description', {
                button: (chunks) => (
                  <Button variant="link" color="green" onClick={handleRedirect}>
                    {chunks}
                  </Button>
                ),
              })}
            </p>
          </div>
        }
      />
    </BirdBackground>
  );
}
