'use client';

import { ReactElement, useEffect, useId, useRef, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import styles from './Dropdown.module.scss';
import Image from 'next/image';

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
  errorMessages?: string[] | string;
  autoFocus?: boolean;
  defaultValue?: string | number | null;
  onValueChange?: (value: string | number | null) => void;
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
    withError,
    errorMessages,
    autoFocus = false,
    defaultValue,
    onValueChange,
    disabled = false,
  } = props;

  const [internalValue, setInternalValue] = useState<
    string | number | null | undefined
  >(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const labelFn = getOptionLabel ?? ((opt: unknown): string => String(opt));
  const valueFn = getOptionValue ?? ((opt: unknown): string => String(opt));

  useEffect(() => {
    if (autoFocus) {
      buttonRef.current?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (!options.length) {
      setSelectedLabel(null);
      return;
    }

    const selected = options.find((opt) => valueFn(opt) === currentValue);

    setSelectedLabel(selected ? labelFn(selected) : null);
  }, [currentValue, options]);

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

  const handleSelect = (option: T): void => {
    const newValue = valueFn(option);

    if (isControlled) {
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    }

    setIsOpen(false);
  };

  const dropdownClassNames = [
    styles.dropdown__button,
    errorMessages?.length && styles['dropdown__button--invalid'],
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
          {selectedLabel ? (
            <span className={styles.dropdown__selected}>{selectedLabel}</span>
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
        errorMessages?.length ? (
          <p className={styles.dropdown__error}>
            <Image
              src="/images/alert-circle.svg"
              alt={'alert'}
              width={12}
              height={12}
            />
            {errorMessages[0]}
          </p>
        ) : (
          <p className={styles.dropdown__error}></p>
        )
      ) : null}
      {isOpen && (
        <ul
          className={styles.dropdown__list}
          style={{
            top: `${withError ? 'calc(100% - 17px)' : 'calc(100% + 4px)'}`,
          }}
        >
          {options.map((option) => {
            const optionLabel = labelFn(option);
            const optionValue = valueFn(option);
            const optionDisabled = isOptionDisabled?.(option) ?? false;
            const isSelected = optionValue === currentValue;
            return (
              <li
                key={optionValue === null ? 'null' : optionValue.toString()}
                className={`
                  ${styles.dropdown__item} 
                  ${optionDisabled ? styles['dropdown__item--disabled'] : ''}
                  ${isSelected ? styles['dropdown__item--selected'] : ''}  
                `}
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
      )}
    </div>
  );
}
