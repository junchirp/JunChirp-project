import { ReactElement, ReactNode } from 'react';
import Header from './Header/Header';
import styles from './BaseLayout.module.scss';
import ReduxProvider from '@/providers/ReduxProvider';
import DataLoader from './DataLoader/DataLoader';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { MessageProvider } from '@/providers/MessageProvider';
import FooterWrapper from './FooterWrapper/FooterWrapper';
import { SupportProvider } from '@/providers/SupportProvider';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

interface BaseLayoutProps {
  children: ReactNode;
  locale: string;
}

export default async function BaseLayout({
  children,
  locale,
}: BaseLayoutProps): Promise<ReactElement> {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={styles.body}>
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            <PrimeReactProvider>
              <MessageProvider>
                <SupportProvider>
                  <DataLoader />
                  <div className={styles.body__container}>
                    <Header />
                    <div className={styles.body__inner}>{children}</div>
                    <FooterWrapper />
                  </div>
                </SupportProvider>
              </MessageProvider>
            </PrimeReactProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
