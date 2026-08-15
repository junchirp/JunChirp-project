'use client';

import { ReactElement } from 'react';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, EditorState, SerializedEditorState } from 'lexical';

interface EditorChangePluginProps {
  onChange: (value: SerializedEditorState, text: string) => void;
}

export default function EditorChangePlugin({
  onChange,
}: EditorChangePluginProps): ReactElement {
  return (
    <OnChangePlugin
      onChange={(editorState: EditorState) => {
        const value = editorState.toJSON();
        let text = '';
        editorState.read(() => {
          text = $getRoot().getTextContent();
        });
        onChange(value, text);
      }}
    />
  );
}
