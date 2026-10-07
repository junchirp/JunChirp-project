'use client';

import {
  forwardRef,
  ForwardedRef,
  ReactElement,
  useId,
  ChangeEvent,
  TextareaHTMLAttributes,
} from 'react';
import styles from './Textarea.module.scss';
import Image from 'next/image';
import { normalizeInputValue } from '@/shared/utils/normalizeInputValue';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  height?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

function TextareaComponent(
  props: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
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
    className,
    withError = false,
    normalize = false,
    onChange,
    height = 140,
    resize = 'vertical',
    ...rest
  } = props;
  const id = useId();

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
  ): void => {
    if (!normalize) {
      onChange?.(event);
      return;
    }

    const textarea = event.target;
    const cursorPosition = textarea.selectionStart ?? textarea.value.length;
    const valueBeforeCursor = textarea.value.slice(0, cursorPosition);
    const normalizedValue = normalizeInputValue(textarea.value);
    const normalizedBeforeCursor = normalizeInputValue(valueBeforeCursor);

    textarea.value = normalizedValue;
    onChange?.(event);

    requestAnimationFrame(() => {
      textarea.setSelectionRange(
        normalizedBeforeCursor.length,
        normalizedBeforeCursor.length,
      );
    });
  };

  const textAreaClassNames = [
    styles['textarea__textarea'],
    withError && !!errorMessage && styles['textarea__textarea--invalid'],
  ]
    .filter(Boolean)
    .join(' ');

  const labelStyle = {
    fontSize: `${labelSize}px`,
    lineHeight: labelHeight,
    fontWeight: labelWeight,
    marginBottom: `${labelMargin}px`,
  };

  const textareaStyle = {
    height: `${height}px`,
    resize: resize,
  };

  return (
    <div className={`${styles.textarea} ${className ?? ''}`}>
      {label && (
        <label
          className={styles.textarea__label}
          style={labelStyle}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <textarea
        {...rest}
        id={id}
        ref={ref}
        value={value}
        onChange={handleChange}
        className={textAreaClassNames}
        style={textareaStyle}
        placeholder={placeholder}
      />
      {withError ? (
        errorMessage ? (
          <p className={styles.textarea__error}>
            <Image
              src="/images/alert-circle.svg"
              alt={'alert'}
              width={12}
              height={12}
            />
            {errorMessage}
          </p>
        ) : (
          <p className={styles.textarea__error}></p>
        )
      ) : null}
    </div>
  );
}

const Textarea = forwardRef(TextareaComponent);

export default Textarea;
