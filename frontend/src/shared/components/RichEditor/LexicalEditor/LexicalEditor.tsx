'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ReactElement, useState } from 'react';
import styles from './LexicalEditor.module.scss';
import Toolbar from './Toolbar/Toolbar';
import EditorChangePlugin from './plugins/EditorChangePlugin';
import { SerializedEditorState } from 'lexical';

interface LexicalEditorProps {
  onChange: (value: SerializedEditorState, text: string) => void;
  placeholder?: string;
  withError?: boolean;
  errorMessage?: string;
}

export default function LexicalEditor({
  onChange,
  placeholder,
  withError = false,
  errorMessage,
}: LexicalEditorProps): ReactElement {
  const [isFocused, setIsFocused] = useState(false);

  const editorClassNames = [
    styles['lexical-editor'],
    withError && errorMessage && styles['lexical-editor--invalid'],
    isFocused && styles['lexical-editor--focused'],
  ]
    .filter(Boolean)
    .join(' ');

  const initialConfig = {
    namespace: 'LexicalEditor',
    onError(error: Error): void {
      console.error(error);
    },
    theme: {
      paragraph: styles['lexical-editor__paragraph'],
      text: {
        bold: styles['lexical-editor__bold'],
        italic: styles['lexical-editor__italic'],
      },
    },
  };

  return (
    <div className={editorClassNames}>
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />
        <div className={styles['lexical-editor__content-wrapper']}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={styles['lexical-editor__content']}
                aria-label={'lexical text editor'}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            }
            placeholder={
              placeholder ? (
                <div className={styles['lexical-editor__placeholder']}>
                  {placeholder}
                </div>
              ) : null
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <EditorChangePlugin onChange={onChange} />
      </LexicalComposer>
    </div>
  );
}
