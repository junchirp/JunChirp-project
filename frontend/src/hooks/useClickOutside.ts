'use client';

import { useEffect, useRef } from 'react';

interface UseClickOutsideOptions {
  isOpen: boolean;
  isOutside: (event: MouseEvent) => boolean;
  onOutside: () => void;
}

export const useClickOutside = ({
  isOpen,
  isOutside,
  onOutside,
}: UseClickOutsideOptions): void => {
  const handlerRef = useRef(onOutside);

  useEffect(() => {
    handlerRef.current = onOutside;
  }, [onOutside]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClick = (event: MouseEvent): void => {
      if (isOutside(event)) {
        handlerRef.current();
      }
    };

    document.addEventListener('mousedown', handleClick);

    return (): void => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, isOutside]);
};
