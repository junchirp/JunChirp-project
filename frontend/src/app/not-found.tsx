import Page404 from '@/shared/components/Page404/Page404';
import { ReactElement } from 'react';
import BaseLayout from '@/shared/components/BaseLayout/BaseLayout';
import { routing } from '@/i18n/routing';

export default function NotFound(): ReactElement {
  return (
    <BaseLayout locale={routing.defaultLocale}>
      <Page404 />
    </BaseLayout>
  );
}
