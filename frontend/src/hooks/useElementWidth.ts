'use client';

import { RefObject, useEffect, useState } from 'react';

export function useElementWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const element = ref.current;

    const update = (): void => {
      setWidth(element.getBoundingClientRect().width);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return (): void => observer.disconnect();
  }, [ref]);

  return width;
}
