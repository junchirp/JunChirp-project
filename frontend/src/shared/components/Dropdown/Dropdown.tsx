'use client';

import { ReactElement, useEffect, useId, useRef, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import styles from './Dropdown.module.scss';

interface DropdownProps<T> extends Partial<ControllerRenderProps> {
  label?: string;
  options: T[];
  placeholder?: string;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string | number | null;
  isOptionDisabled?: (option: T) => boolean;
}

export default function Dropdown<T>(props: DropdownProps<T>): ReactElement {
  const {
    label,
    options,
    value,
    onChange,
    onBlur,
    placeholder = '',
    getOptionLabel,
    getOptionValue,
    isOptionDisabled,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const labelFn = getOptionLabel ?? ((opt: unknown): string => String(opt));
  const valueFn = getOptionValue ?? ((opt: unknown): string => String(opt));

  useEffect(() => {
    if (!options.length) {
      setSelectedLabel(null);
      return;
    }

    const selected = options.find((opt) => valueFn(opt) === value);
    setSelectedLabel(selected ? labelFn(selected) : null);
  }, [value, options]);

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
    onChange?.(valueFn(option));
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown} ref={ref}>
      <div className={styles.dropdown__field}>
        {label && (
          <label className={styles.dropdown__label} htmlFor={id}>
            {label}
          </label>
        )}
        <button
          id={id}
          className={styles.dropdown__button}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          onBlur={onBlur}
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
      {isOpen && (
        <ul className={styles.dropdown__list}>
          {options.map((option) => {
            const optionLabel = labelFn(option);
            const optionValue = valueFn(option);
            const optionDisabled = isOptionDisabled?.(option) ?? false;
            return (
              <li
                key={optionValue === null ? 'null' : optionValue.toString()}
                className={`${styles.dropdown__item} ${optionDisabled ? styles['dropdown__item--disabled'] : ''}`}
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
