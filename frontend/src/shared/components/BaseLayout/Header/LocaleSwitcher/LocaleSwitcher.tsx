'use client';

import { ReactElement, useTransition } from 'react';
import Dropdown from '../../../Dropdown/Dropdown';
import { Locale, routing, usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import styles from './LocaleSwitcher.module.scss';

export default function LocaleSwitcher(): ReactElement {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();

  const onSelectChange = (nextLocale: Locale): void => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale },
      );
    });
  };

  return (
    <div className={styles['locale-switcher']}>
      <Image src="/images/language.svg" alt="language" width={32} height={32} />
      <Dropdown<Locale>
        options={[...routing.locales]}
        defaultValue={locale}
        disabled={isPending}
        getOptionLabel={(o) => o.toUpperCase()}
        getOptionValue={(o) => o}
        onValueChange={(v) => onSelectChange(v as Locale)}
      />
    </div>
  );
}
