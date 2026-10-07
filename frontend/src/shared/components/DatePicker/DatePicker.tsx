'use client';

import { ReactElement, useRef, useState } from 'react';
import styles from './DatePicker.module.scss';
import { DayPicker } from '@daypicker/react';
import { useFormatter } from 'next-intl';
import { useClickOutside } from '@/hooks/useClickOutside';
import Input from '@/shared/components/Input/Input';
import { ShortLocaleType } from '@/shared/types/short-locale.type';
import { enGB, uk } from '@daypicker/react/locale';
import { useOpenDirection } from '@/hooks/useOpenDirection';

interface DatePickerProps {
  label?: string;
  labelSize?: number;
  labelHeight?: number;
  labelWeight?: number;
  labelMargin?: number;
  placeholder?: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
  withError?: boolean;
  errorMessage?: string;
  locale?: ShortLocaleType;
}

export default function DatePicker({
  label,
  labelSize = 14,
  labelHeight = 1,
  labelWeight = 500,
  labelMargin = 4,
  placeholder = '',
  value,
  onChange,
  withError = false,
  errorMessage,
  locale = 'ua',
}: DatePickerProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const formatter = useFormatter();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { openUp, handleToggle } = useOpenDirection(
    ref,
    isOpen,
    setIsOpen,
    338,
  );

  useClickOutside({
    isOpen,
    onOutside: () => setIsOpen(false),
    isOutside: (event) => {
      const target = event.target as Node;

      return !!ref.current && !ref.current.contains(target);
    },
  });

  const formattedValue = value
    ? formatter.dateTime(value, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  const handleSelect = (date: Date | undefined): void => {
    onChange(date ?? null);
    setIsOpen(false);
  };

  const labelOffset = label ? labelSize * labelHeight + labelMargin - 4 : -4;
  const errorOffset = withError ? 16 : -4;

  return (
    <div className={styles['date-picker']} ref={ref}>
      <Input
        label={label}
        labelHeight={labelHeight}
        labelWeight={labelWeight}
        labelMargin={labelMargin}
        placeholder={placeholder}
        value={formattedValue}
        readOnly
        withError={withError}
        errorMessage={errorMessage}
        onClick={handleToggle}
      />

      {isOpen && (
        <DayPicker
          className={styles['date-picker__day-picker']}
          style={
            openUp
              ? {
                  bottom: `calc(100% - ${labelOffset}px)`,
                }
              : {
                  top: `calc(100% - ${errorOffset}px)`,
                }
          }
          locale={locale === 'ua' ? uk : enGB}
          mode="single"
          fixedWeeks
          selected={value ?? undefined}
          onSelect={handleSelect}
          disabled={{ before: today }}
          startMonth={today}
        />
      )}
    </div>
  );
}
