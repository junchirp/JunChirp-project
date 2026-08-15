'use client';

import { ReactElement, useEffect, useState } from 'react';
import styles from './Toolbar.module.scss';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import ToolbarButton from './ToolbarButton/ToolbarButton';

export default function Toolbar(): ReactElement {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
          setIsBold(false);
          setIsItalic(false);
          return;
        }

        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
      });
    });
  }, [editor]);

  const handleBold = (): void => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const handleItalic = (): void => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  return (
    <div className={styles.toolbar}>
      <ToolbarButton active={isBold} label="Bold" onClick={handleBold}>
        <span className={styles.toolbar__bold}>B</span>
      </ToolbarButton>
      <ToolbarButton active={isItalic} label="Italic" onClick={handleItalic}>
        <span className={styles.toolbar__italic}>I</span>
      </ToolbarButton>
    </div>
  );
}
