import { ReactElement, ReactNode } from 'react';
import Header from './Header/Header';
import styles from './BaseLayout.module.scss';
import ReduxProvider from '@/providers/ReduxProvider';
import UserLoader from '@/shared/components/BaseLayout/UserLoader/UserLoader';
import { MessageProvider } from '@/providers/MessageProvider';
import FooterWrapper from './FooterWrapper/FooterWrapper';
import { SupportProvider } from '@/providers/SupportProvider';
import { NextIntlClientProvider } from 'next-intl';
import OAuthDiscordHandler from './OAuthDiscordHandler/OAuthDiscordHandler';
import OAuthGoogleHandler from './OAuthGoogleHandler/OAuthGoogleHandler';

interface BaseLayoutProps {
  children: ReactNode;
  locale: string;
}

export default function BaseLayout({
  children,
  locale,
}: BaseLayoutProps): ReactElement {
  return (
    <html lang={locale}>
      <body className={styles.body}>
        <NextIntlClientProvider>
          <ReduxProvider>
            <MessageProvider>
              <SupportProvider>
                <UserLoader />
                <OAuthDiscordHandler />
                <OAuthGoogleHandler />
                <div className={styles.body__container}>
                  <Header />
                  <div className={styles.body__inner}>{children}</div>
                  <FooterWrapper />
                </div>
              </SupportProvider>
            </MessageProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
