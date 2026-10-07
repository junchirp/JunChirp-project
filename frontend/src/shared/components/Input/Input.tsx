'use client';

import {
  InputHTMLAttributes,
  useState,
  forwardRef,
  ForwardedRef,
  ReactElement,
  useId,
  ChangeEvent,
} from 'react';
import styles from './Input.module.scss';
import Image from 'next/image';
import { normalizeInputValue } from '@/shared/utils/normalizeInputValue';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelSize?: number;
  labelHeight?: number;
  labelWeight?: number;
  labelMargin?: number;
  placeholder?: string;
  errorMessage?: string;
  className?: string;
  withError?: boolean;
  normalize?: boolean;
  required?: boolean;
}

function InputComponent(
  props: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
): ReactElement {
  const {
    label,
    labelSize = 14,
    labelHeight = 1,
    labelWeight = 500,
    labelMargin = 4,
    placeholder,
    errorMessage,
    value,
    type = 'text',
    className,
    withError = false,
    normalize = false,
    required = false,
    onChange,
    ...rest
  } = props;
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();

  const isPasswordField = props.type === 'password';
  const inputType = isPasswordField
    ? showPassword
      ? 'text'
      : 'password'
    : type;

  const inputClassNames = [
    styles.input__input,
    withError && !!errorMessage && styles['input__input--invalid'],
    isPasswordField && styles['input__input--password'],
  ]
    .filter(Boolean)
    .join(' ');

  const labelClassNames = [
    styles.input__label,
    required && styles['input__label--required'],
  ]
    .filter(Boolean)
    .join(' ');

  const labelStyle = {
    fontSize: `${labelSize}px`,
    lineHeight: labelHeight,
    fontWeight: labelWeight,
    marginBottom: `${labelMargin}px`,
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ): void => {
    if (!normalize) {
      onChange?.(event);
      return;
    }

    const input = event.target;
    const cursorPosition = input.selectionStart ?? input.value.length;
    const valueBeforeCursor = input.value.slice(0, cursorPosition);
    const normalizedValue = normalizeInputValue(input.value);
    const normalizedBeforeCursor = normalizeInputValue(valueBeforeCursor);

    input.value = normalizedValue;
    onChange?.(event);

    requestAnimationFrame(() => {
      input.setSelectionRange(
        normalizedBeforeCursor.length,
        normalizedBeforeCursor.length,
      );
    });
  };

  return (
    <div className={`${styles.input} ${className ?? ''}`}>
      {label && (
        <label className={labelClassNames} style={labelStyle} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={styles.input__wrapper}>
        <input
          {...rest}
          id={id}
          ref={ref}
          type={inputType}
          value={value}
          className={inputClassNames}
          placeholder={placeholder}
          onChange={handleChange}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={styles['input__toggle-button']}
          >
            <Image
              src={showPassword ? '/images/eye.svg' : '/images/eye-off.svg'}
              alt="eye"
              width={16}
              height={16}
            />
          </button>
        )}
      </div>
      {withError ? (
        errorMessage ? (
          <p className={styles.input__error}>
            <Image
              src="/images/alert-circle.svg"
              alt={'alert'}
              width={12}
              height={12}
            />
            {errorMessage}
          </p>
        ) : (
          <p className={styles.input__error}></p>
        )
      ) : null}
    </div>
  );
}

const Input = forwardRef(InputComponent);

export default Input;
