'use client';

import { ReactElement } from 'react';
import styles from './RichEditor.module.scss';
import Image from 'next/image';
import LexicalEditor from './LexicalEditor/LexicalEditor';
import { SerializedEditorState } from 'lexical';

interface RichEditorProps {
  value: string;
  onChange: (value: SerializedEditorState, text: string) => void;
  label?: string;
  labelSize?: number;
  labelHeight?: number;
  labelWeight?: number;
  labelMargin?: number;
  placeholder?: string;
  errorMessage?: string;
  withError?: boolean;
}

export function RichEditor(props: RichEditorProps): ReactElement {
  const {
    onChange,
    label,
    labelSize = 14,
    labelHeight = 1,
    labelWeight = 500,
    labelMargin = 4,
    placeholder,
    errorMessage,
    withError = false,
  } = props;

  const labelStyle = {
    fontSize: `${labelSize}px`,
    lineHeight: labelHeight,
    fontWeight: labelWeight,
    marginBottom: `${labelMargin}px`,
  };

  return (
    <div className={styles['rich-editor']}>
      {label && (
        <span className={styles['rich-editor__label']} style={labelStyle}>
          {label}
        </span>
      )}
      <LexicalEditor
        placeholder={placeholder}
        onChange={onChange}
        withError
        errorMessage={errorMessage}
      />
      {withError ? (
        errorMessage ? (
          <p className={styles['rich-editor__error']}>
            <Image
              src="/images/alert-circle.svg"
              alt={'alert'}
              width={16}
              height={16}
            />
            {errorMessage}
          </p>
        ) : (
          <p className={styles['rich-editor__error']} />
        )
      ) : null}
    </div>
  );
}
