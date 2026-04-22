'use client';

import { ReactElement } from 'react';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import styles from './RichEditor.module.scss';
import Image from 'next/image';

interface RichEditorProps {
  value: string;
  onChange: (html: string, text: string) => void;
  label?: string;
  labelSize?: number;
  labelHeight?: number;
  labelWeight?: number;
  labelMargin?: number;
  placeholder?: string;
  errorMessages?: string[] | string;
  withError?: boolean;
}

export function RichEditor(props: RichEditorProps): ReactElement {
  const {
    value,
    onChange,
    label,
    labelSize = 14,
    labelHeight = 1,
    labelWeight = 500,
    labelMargin = 4,
    placeholder,
    errorMessages,
    withError,
  } = props;
  const header = (
    <div className={styles['rich-editor__header']}>
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
      </span>
    </div>
  );

  const labelStyle = {
    fontSize: `${labelSize}px`,
    lineHeight: labelHeight,
    fontWeight: labelWeight,
    marginBottom: `${labelMargin}px`,
  };

  const editorClassNames = [
    styles['rich-editor__editor'],
    errorMessages?.length && styles['rich-editor__editor--invalid'],
  ]
    .filter(Boolean)
    .join(' ');

  const handleTextChange = (e: EditorTextChangeEvent): void => {
    const html = e.htmlValue ?? '';
    const text = e.textValue ?? '';
    onChange(html, text);
  };

  return (
    <div className={styles['rich-editor']}>
      {label && (
        <span className={styles['rich-editor__label']} style={labelStyle}>
          {label}
        </span>
      )}
      <Editor
        className={editorClassNames}
        value={value}
        placeholder={placeholder}
        headerTemplate={header}
        onTextChange={handleTextChange}
      />
      {withError ? (
        errorMessages?.length ? (
          <p className={styles['rich-editor__error']}>
            <Image
              src="/images/alert-circle.svg"
              alt={'alert'}
              width={16}
              height={16}
            />
            {errorMessages[0]}
          </p>
        ) : (
          <p className={styles['rich-editor__error']} />
        )
      ) : null}
    </div>
  );
}
