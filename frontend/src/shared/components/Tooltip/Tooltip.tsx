'use client';

import {
  ReactElement,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './Tooltip.module.scss';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
}

export default function Tooltip({
  children,
  content,
}: TooltipProps): ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });

  useLayoutEffect(() => {
    if (!isVisible || !wrapperRef.current || !tooltipRef.current) {
      return;
    }

    const triggerRect = wrapperRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const spacing = 6;
    const viewportPadding = 8;

    const top =
      (triggerRect.top - tooltipRect.height - spacing >= viewportPadding
        ? triggerRect.top - tooltipRect.height - spacing
        : triggerRect.bottom + spacing) + window.scrollY;

    const left =
      Math.min(
        Math.max(
          triggerRect.left + triggerRect.width / 2,
          tooltipRect.width / 2 + viewportPadding,
        ),
        window.innerWidth - tooltipRect.width / 2 - viewportPadding,
      ) + window.scrollX;

    setPosition({ top, left });
  }, [isVisible, content]);

  return (
    <>
      <div
        ref={wrapperRef}
        className={styles.tooltip__wrapper}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={styles.tooltip}
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
