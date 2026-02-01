'use client';

import {
  ReactElement,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { Locale, routing, usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import styles from './LocaleSwitcher.module.scss';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';

export default function LocaleSwitcher(): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const [currentLocale, setLocale] = useState(locale);
  const options = routing.locales;
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const labelFn = (opt: Locale): string => String(opt).toUpperCase();

  useEffect(() => {
    if (!options.length) {
      setSelectedLabel(null);
      return;
    }

    const selected = options.find((opt) => opt === currentLocale);

    setSelectedLabel(selected ? labelFn(selected) : null);
  }, [currentLocale, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return (): void =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSelectChange = (nextLocale: Locale): void => {
    setLocale(nextLocale);
    setIsOpen(false);
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
      <div className={styles['locale-switcher__language']}>
        <Image src="/images/globe.svg" alt="language" width={16} height={16} />|
      </div>
      <div className={styles['locale-switcher__dropdown']} ref={ref}>
        <button
          className={styles['locale-switcher__button']}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          ref={buttonRef}
          disabled={isPending}
        >
          <span className={styles.dropdown__selected}>{selectedLabel}</span>
          {isOpen ? (
            <Up className={styles['locale-switcher__icon']} />
          ) : (
            <Down className={styles['locale-switcher__icon']} />
          )}
        </button>
        {isOpen && (
          <ul className={styles['locale-switcher__list']}>
            {options.map((option) => {
              const optionLabel = labelFn(option);
              const optionValue = option;
              const isSelected = optionValue === currentLocale;
              return (
                <li
                  key={optionValue}
                  className={`
                  ${styles['locale-switcher__item']} 
                  ${isSelected ? styles['locale-switcher__item--selected'] : ''}
                `}
                  onClick={() => onSelectChange(option)}
                >
                  {optionLabel}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
