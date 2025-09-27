'use client';

import { useState, useId, useRef, useEffect, ReactElement } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import styles from './CategoryDropdown.module.scss';
import Button from '@/shared/components/Button/Button';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import { ProjectCategoryInterface } from '../../interfaces/project-category.interface';

interface CategoryDropdownProps extends Partial<ControllerRenderProps> {
  label?: string;
  options: ProjectCategoryInterface[];
  placeholder?: string;
}

export default function CategoryDropdown({
  label,
  options,
  value,
  onChange,
  onBlur,
  placeholder = '',
}: CategoryDropdownProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selected = options.find((opt) => opt.id === value) ?? options[0];
    setSelectedLabel(selected.categoryName);
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

  const handleSelect = (option: ProjectCategoryInterface): void => {
    onChange?.(option.id);
    setIsOpen(false);
  };

  return (
    <div className={styles['category-dropdown']} ref={ref}>
      <div className={styles['category-dropdown__field']}>
        {label && (
          <label className={styles['category-dropdown__label']} htmlFor={id}>
            {label}
          </label>
        )}
        <Button
          type="button"
          id={id}
          className={styles['category-dropdown__button']}
          fullWidth
          onClick={() => setIsOpen((prev) => !prev)}
          onBlur={onBlur}
          iconPosition="right"
          icon={isOpen ? <Up /> : <Down />}
        >
          {selectedLabel ? (
            <span className={styles['category-dropdown__selected']}>
              {selectedLabel}
            </span>
          ) : (
            <span className={styles['category-dropdown__selected']}>
              {placeholder}
            </span>
          )}
        </Button>
      </div>
      {isOpen && (
        <ul className={styles['category-dropdown__list']}>
          {options.map((option) => (
            <li
              key={option.id}
              className={styles['category-dropdown__item']}
              onClick={() => handleSelect(option)}
            >
              {option.categoryName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
