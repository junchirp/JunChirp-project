'use client';

import React, { useState, useEffect, useId, useRef, ReactElement } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import styles from './MultiSelectWithChips.module.scss';
import CheckboxChecked from '@/assets/icons/checkbox-checked.svg';
import Checkbox from '@/assets/icons/checkbox-empty.svg';
import Image from 'next/image';
import Button from '../Button/Button';
import X from '@/assets/icons/x.svg';

interface MultiSelectWithChipsProps<T> extends Partial<ControllerRenderProps> {
  label?: string;
  labelSize?: number;
  labelHeight?: number;
  labelWeight?: number;
  labelMargin?: number;
  options: T[];
  placeholder?: string;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string | number;
  isOptionDisabled?: (option: T) => boolean;
  withError?: boolean;
  errorMessages?: string[] | string;
  autoFocus?: boolean;
}

export default function MultiSelectWithChips<T>(
  props: MultiSelectWithChipsProps<T>,
): ReactElement {
  const {
    label,
    labelSize = 14,
    labelHeight = 1,
    labelWeight = 500,
    labelMargin = 4,
    options,
    value = [],
    onChange,
    onBlur,
    placeholder = '',
    getOptionLabel,
    getOptionValue,
    isOptionDisabled,
    withError,
    errorMessages,
    autoFocus = false,
  } = props;

  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const labelFn = getOptionLabel ?? ((opt: unknown): string => String(opt));
  const valueFn =
    getOptionValue ?? ((opt: unknown): string | number => String(opt));

  const selectedValues = Array.isArray(value) ? value : [];

  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(valueFn(opt)),
  );

  useEffect(() => {
    if (autoFocus) {
      buttonRef.current?.focus();
    }
  }, [autoFocus]);

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

  const toggleSelect = (option: T): void => {
    const optionValue = valueFn(option);
    const alreadySelected = selectedValues.includes(optionValue);
    const newValues = alreadySelected
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange?.(newValues);
  };

  const removeSelected = (optionValue: string | number): void => {
    onChange?.(selectedValues.filter((v) => v !== optionValue));
  };

  const labelStyle = {
    fontSize: `${labelSize}px`,
    lineHeight: labelHeight,
    fontWeight: labelWeight,
    marginBottom: `${labelMargin}px`,
  };

  const buttonClassNames = [
    styles['multi-select-with-chips__button'],
    isOpen && styles['multi-select-with-chips__button--focused'],
    withError && errorMessages
      ? styles['multi-select-with-chips__button--invalid']
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles['multi-select-with-chips']} ref={ref}>
      <div className={styles['multi-select-with-chips__field']}>
        {label && (
          <label
            className={styles['multi-select-with-chips__label']}
            style={labelStyle}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <div
          id={id}
          ref={buttonRef}
          className={buttonClassNames}
          onClick={() => setIsOpen((prev) => !prev)}
          onBlur={onBlur}
        >
          {selectedOptions.length > 0 ? (
            <div className={styles['multi-select-with-chips__chips']}>
              {selectedOptions.map((opt) => {
                const optionValue = valueFn(opt);
                const optionLabel = labelFn(opt);
                return (
                  <div
                    key={optionValue.toString()}
                    className={styles['multi-select-with-chips__chip']}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      className={styles['multi-select-with-chips__chip-label']}
                    >
                      {optionLabel}
                    </span>
                    <Button
                      icon={<X />}
                      color="black"
                      size="ssm"
                      variant="link"
                      onClick={() => removeSelected(optionValue)}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <span className={styles['multi-select-with-chips__placeholder']}>
              {placeholder}
            </span>
          )}
          {isOpen ? (
            <Up className={styles['multi-select-with-chips__icon']} />
          ) : (
            <Down className={styles['multi-select-with-chips__icon']} />
          )}
        </div>
      </div>

      {withError ? (
        errorMessages?.length ? (
          <p className={styles['multi-select-with-chips__error']}>
            <Image
              src="/images/alert-circle.svg"
              alt={'alert'}
              width={16}
              height={16}
            />
            {errorMessages[0]}
          </p>
        ) : (
          <p className={styles['multi-select-with-chips__error']}></p>
        )
      ) : null}

      {isOpen && (
        <ul
          className={styles['multi-select-with-chips__list']}
          style={{
            top: `${withError ? 'calc(100% - 17px)' : 'calc(100% + 4px)'}`,
          }}
        >
          {options.map((option) => {
            const optionLabel = labelFn(option);
            const optionValue = valueFn(option);
            const selected = selectedValues.includes(optionValue);
            const disabled = isOptionDisabled?.(option) ?? false;
            return (
              <li
                key={optionValue.toString()}
                className={`${styles['multi-select-with-chips__item']} ${
                  selected
                    ? styles['multi-select-with-chips__item--selected']
                    : ''
                } ${disabled ? styles['multi-select-with-chips__item--disabled'] : ''}`}
                onClick={() => {
                  if (!disabled) {
                    toggleSelect(option);
                  }
                }}
              >
                <div
                  className={styles['multi-select-with-chips__checkbox-label']}
                >
                  {selected ? (
                    <CheckboxChecked
                      className={
                        styles['multi-select-with-chips__checkbox-icon']
                      }
                    />
                  ) : (
                    <Checkbox
                      className={
                        styles['multi-select-with-chips__checkbox-icon']
                      }
                    />
                  )}
                  <span
                    className={
                      styles['multi-select-with-chips__checkbox-label-text']
                    }
                  >
                    {optionLabel}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
