'use client';

import { Dispatch, RefObject, SetStateAction, useState } from 'react';

interface UseOpenDirectionResult {
  openUp: boolean;
  handleToggle: () => void;
}

export function useOpenDirection(
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  popupHeight: number,
): UseOpenDirectionResult {
  const [openUp, setOpenUp] = useState(false);

  const handleToggle = (): void => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const rect = ref.current?.getBoundingClientRect();

    if (!rect) {
      setIsOpen(true);
      return;
    }

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    setOpenUp(spaceBelow < popupHeight && spaceAbove >= popupHeight);

    setIsOpen(true);
  };

  return { openUp, handleToggle };
}
