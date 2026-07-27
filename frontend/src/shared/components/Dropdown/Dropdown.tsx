'use client';

import { ReactElement, useEffect, useId, useRef, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import styles from './Dropdown.module.scss';
import Image from 'next/image';
import { useClickOutside } from '@/hooks/useClickOutside';

interface DropdownProps<T> extends Partial<ControllerRenderProps> {
  label?: string;
  labelSize?: number;
  labelHeight?: number;
  labelWeight?: number;
  labelMargin?: number;
  options: T[];
  placeholder?: string;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string | number | null;
  isOptionDisabled?: (option: T) => boolean;
  withError?: boolean;
  errorMessage?: string;
  autoFocus?: boolean;
  defaultValue?: string | number | null;
}

export default function Dropdown<T>(props: DropdownProps<T>): ReactElement {
  const {
    label,
    labelSize = 14,
    labelHeight = 1,
    labelWeight = 500,
    labelMargin = 4,
    options,
    value,
    onChange,
    onBlur,
    placeholder = '',
    getOptionLabel,
    getOptionValue,
    isOptionDisabled,
    withError = false,
    errorMessage,
    autoFocus = false,
    defaultValue,
    disabled = false,
  } = props;

  const [internalValue, setInternalValue] = useState<
    string | number | null | undefined
  >(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const labelFn = getOptionLabel ?? ((opt: unknown): string => String(opt));
  const valueFn = getOptionValue ?? ((opt: unknown): string => String(opt));

  const selectedOption = options.find(
    (option) => valueFn(option) === currentValue,
  );

  useEffect(() => {
    if (autoFocus) {
      buttonRef.current?.focus();
    }
  }, [autoFocus]);

  useClickOutside({
    isOpen,
    onOutside: () => setIsOpen(false),
    isOutside: (e) => {
      const target = e.target as Node;
      return !!ref.current && !ref.current.contains(target);
    },
  });

  const handleSelect = (option: T): void => {
    const newValue = valueFn(option);

    if (!isControlled) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
    setIsOpen(false);
  };

  const dropdownClassNames = [
    styles.dropdown__button,
    withError && !!errorMessage && styles['dropdown__button--invalid'],
  ]
    .filter(Boolean)
    .join(' ');

  const labelStyle = {
    fontSize: `${labelSize}px`,
    lineHeight: labelHeight,
    fontWeight: labelWeight,
    marginBottom: `${labelMargin}px`,
  };

  return (
    <div className={styles.dropdown} ref={ref}>
      <div className={styles.dropdown__field}>
        {label && (
          <label
            className={styles.dropdown__label}
            style={labelStyle}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <button
          id={id}
          className={dropdownClassNames}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          onBlur={onBlur}
          ref={buttonRef}
          disabled={disabled}
        >
          {selectedOption ? (
            <span className={styles.dropdown__selected}>
              {labelFn(selectedOption)}
            </span>
          ) : (
            <span className={styles.dropdown__placeholder}>{placeholder}</span>
          )}
          {isOpen ? (
            <Up className={styles.dropdown__icon} />
          ) : (
            <Down className={styles.dropdown__icon} />
          )}
        </button>
      </div>
      {withError ? (
        errorMessage ? (
          <p className={styles.dropdown__error}>
            <Image
              src="/images/alert-circle.svg"
              alt={'alert'}
              width={12}
              height={12}
            />
            {errorMessage}
          </p>
        ) : (
          <p className={styles.dropdown__error}></p>
        )
      ) : null}
      {isOpen && (
        <div
          className={styles['dropdown__list-wrapper']}
          style={{
            top: `${withError ? 'calc(100% - 17px)' : 'calc(100% + 4px)'}`,
          }}
        >
          <ul className={styles.dropdown__list}>
            {options.map((option) => {
              const optionLabel = labelFn(option);
              const optionValue = valueFn(option);
              const optionDisabled = isOptionDisabled?.(option) ?? false;
              const isSelected = optionValue === currentValue;
              const optionClassNames = [
                styles.dropdown__item,
                optionDisabled && styles['dropdown__item--disabled'],
                isSelected && styles['dropdown__item--selected'],
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <li
                  key={String(optionValue)}
                  className={optionClassNames}
                  onClick={() => {
                    if (!optionDisabled) {
                      handleSelect(option);
                    }
                  }}
                >
                  {optionLabel}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
