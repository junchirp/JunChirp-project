'use client';

import { useState, useId, useRef, useEffect, ReactElement } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import styles from './ProjectParticipantsDropdown.module.scss';
import Button from '@/shared/components/Button/Button';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import { ParticipantsOptionsInterface } from '../../interfaces/participants-options.interface';

interface ProjectParticipantsDropdownProps
  extends Partial<ControllerRenderProps> {
  label?: string;
  options: ParticipantsOptionsInterface[];
  placeholder?: string;
}

export default function ProjectParticipantsDropdown({
  label,
  options,
  value,
  onChange,
  onBlur,
  placeholder = '',
}: ProjectParticipantsDropdownProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selected =
      options.find(
        (opt) =>
          opt.min === value.minParticipants &&
          opt.max === value.maxParticipants,
      ) ?? options[0];
    setSelectedLabel(selected.label);
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

  const handleSelect = (option: ParticipantsOptionsInterface): void => {
    onChange?.({ minParticipants: option.min, maxParticipants: option.max });
    setIsOpen(false);
  };

  return (
    <div className={styles['project-participants-dropdown']} ref={ref}>
      <div className={styles['project-participants-dropdown__field']}>
        {label && (
          <label
            className={styles['project-participants-dropdown__label']}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <Button
          type="button"
          id={id}
          className={styles['project-participants-dropdown__button']}
          fullWidth
          onClick={() => setIsOpen((prev) => !prev)}
          onBlur={onBlur}
          iconPosition="right"
          icon={isOpen ? <Up /> : <Down />}
        >
          {selectedLabel ? (
            <span className={styles['project-participants-dropdown__selected']}>
              {selectedLabel}
            </span>
          ) : (
            <span className={styles['project-participants-dropdown__selected']}>
              {placeholder}
            </span>
          )}
        </Button>
      </div>
      {isOpen && (
        <ul className={styles['project-participants-dropdown__list']}>
          {options.map((option) => (
            <li
              key={option.id}
              className={styles['project-participants-dropdown__item']}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
