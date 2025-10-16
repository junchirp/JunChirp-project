import { ReactElement } from 'react';
import styles from './RadioGroup.module.scss';
import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';
import Radio from '@/assets/icons/radio.svg';

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: ProjectRoleInterface[];
  name: string;
  roleTypeIds: string[];
}

export default function RadioGroup(props: RadioGroupProps): ReactElement {
  const { value, onChange, options, name, roleTypeIds } = props;

  return (
    <div className={styles['radio-group']}>
      {options.map((option) => {
        const checked = value === option.id;
        const disabled = !roleTypeIds.some((id) => id === option.roleType.id);

        return (
          <div key={option.id} className={styles['radio-group__option']}>
            <input
              id={option.id}
              className={styles['radio-group__hidden-input']}
              type="radio"
              name={name}
              value={option.id}
              checked={checked}
              onChange={() => onChange(option.id)}
              disabled={disabled}
            />
            <label className={styles['radio-group__label']} htmlFor={option.id}>
              <Radio
                className={`
                  ${styles['radio-group__radio']}
                  ${!checked && !disabled ? styles['radio-group__radio--default'] : ''}
                  ${!checked && disabled ? styles['radio-group__radio--disabled'] : ''}
                  ${checked && !disabled ? styles['radio-group__radio--checked'] : ''}
                  ${checked && disabled ? styles['radio-group__radio--checked--disabled'] : ''}
                `}
              />
              <span
                className={`${disabled ? styles['radio-group__label--disabled'] : ''}`}
              >
                {option.roleType.roleName}
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
}
