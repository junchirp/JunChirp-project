'use client';

import {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styles from './WhatWeNeed.module.scss';
import Circle from '@/assets/icons/circle.svg';
import Button from '../../../../shared/components/Button/Button';
import { useRouter } from 'next/navigation';
import { UserInterface } from '../../../../shared/interfaces/user.interface';
import { authBlocks, noAuthBlocks } from '@/shared/constants/what-we-need';

const CENTER_GAP = 264;
const FIXED_INDEXES = [2, 3, 4];

interface WhatWeNeedProps {
  user: UserInterface | null;
}

export default function WhatWeNeed({ user }: WhatWeNeedProps): ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = useState<number[]>([]);
  const [containerH, setContainerH] = useState(1);
  const [translate, setTranslate] = useState(0);
  const router = useRouter();
  const blocks = user ? authBlocks : noAuthBlocks;

  useLayoutEffect(() => {
    const cH = containerRef.current?.offsetHeight ?? 0;
    const hs = itemRefs.current.map((el) => el?.offsetHeight ?? 0);
    setHeights(hs);
    setContainerH(cH);

    let totalH = 0;
    itemRefs.current.forEach((el) => {
      if (el) {
        totalH +=
          el.offsetHeight +
          parseFloat(getComputedStyle(el).marginTop) +
          parseFloat(getComputedStyle(el).marginBottom);
      }
    });

    if (sectionRef.current) {
      sectionRef.current.style.height = `${Math.max(totalH, cH + 1)}px`;
    }
  }, []);

  useEffect(() => {
    const onScroll = (): void => {
      const sec = sectionRef.current;
      const container = containerRef.current;
      if (!sec || !container) {
        return;
      }

      const rect = sec.getBoundingClientRect();
      const totalContentH = itemRefs.current.reduce((sum, el) => {
        if (!el) {
          return sum;
        }
        const style = getComputedStyle(el);
        return (
          sum +
          el.offsetHeight +
          parseFloat(style.marginTop) +
          parseFloat(style.marginBottom)
        );
      }, 0);

      const maxTranslate = totalContentH - container.offsetHeight;
      const passed = Math.min(Math.max(-rect.top, 0), maxTranslate);
      setTranslate(-passed);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return (): void => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [containerH]);

  const getMarginTop = (i: number): number => {
    if (i === 0) {
      return 0;
    }
    const prevH = heights[i - 1] ?? 0;
    const currH = heights[i] ?? 0;
    return CENTER_GAP - prevH / 2 - currH / 2;
  };

  const getNorm = (i: number): number => {
    const el = itemRefs.current[i];
    if (!el) {
      return 1;
    }
    const itemTop = el.offsetTop;
    const itemHeight = el.offsetHeight;
    const itemCenterY = itemTop + itemHeight / 2 + translate;
    const windowCenterY = containerH / 2;
    const dist = Math.abs(itemCenterY - windowCenterY);
    return Math.min(dist / (containerH / 2), 1);
  };

  const getColor = (color: string, norm: number): string => {
    const n = Math.min(Math.max(norm, 0), 1);

    if (n <= 0.45) {
      return color;
    } else {
      const t = (n - 0.45) / 0.55;

      const gray = { r: 161, g: 161, b: 161 };
      const white = { r: 255, g: 255, b: 255 };

      const r = Math.round(gray.r + (white.r - gray.r) * t);
      const g = Math.round(gray.g + (white.g - gray.g) * t);
      const b = Math.round(gray.b + (white.b - gray.b) * t);

      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const getTitleStyle = (i: number): Record<string, string | number> => {
    const norm = getNorm(i);

    return {
      fontSize: `${32 - 8 * norm}px`,
      lineHeight: norm >= 0.5 ? 1.2 + 0.4 * norm : 1.4,
      color: getColor('#1c851c', norm),
      fontWeight: 600,
      textAlign: 'right',
      whiteSpace: 'pre-line',
    };
  };

  const getTextStyle = (i: number): Record<string, string | number> => {
    const norm = getNorm(i);

    return {
      fontSize: `${20 - 8 * norm}px`,
      lineHeight: 1.4,
      color: getColor('#141416', norm),
      fontWeight: 600 - 200 * norm,
      textAlign: 'left',
    };
  };

  const getCircleStyle = (i: number): Record<string, string | number> => {
    const norm = getNorm(i);

    return {
      color: getColor('#1c851c', norm),
      width:
        norm <= 0.5
          ? `${84 - 80 * norm}px`
          : norm > 0.5 && norm < 0.9
            ? '44px'
            : '1px',
      height:
        norm <= 0.5
          ? `${84 - 80 * norm}px`
          : norm > 0.5 && norm < 0.9
            ? '44px'
            : '1px',
    };
  };

  const handleRedirect = (i: number): void => {
    if (blocks[i].buttonRoute) {
      router.push(blocks[i].buttonRoute);
    } else {
      window.open(blocks[i].buttonUrl, '_blank');
    }
  };

  return (
    <div className={styles['what-we-need__wrapper']} ref={sectionRef}>
      <div className={styles['what-we-need']}>
        <h2 className={styles['what-we-need__header']}>
          Все, що потрібно для ІТ-старту
        </h2>
        <div ref={containerRef} className={styles['what-we-need__container']}>
          <div style={{ transform: `translateY(${translate}px)` }}>
            {blocks.map((block, i) => {
              const fixedHeight = FIXED_INDEXES.includes(i)
                ? CENTER_GAP
                : 'auto';

              return (
                <div
                  key={i}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={styles['what-we-need__item']}
                  style={{
                    marginTop: getMarginTop(i),
                    height: fixedHeight,
                  }}
                >
                  <div className={styles['what-we-need__item-content']}>
                    {block.title && (
                      <h3 style={getTitleStyle(i)}>{block.title}</h3>
                    )}
                  </div>
                  <Circle
                    className={styles['what-we-need__circle']}
                    style={getCircleStyle(i)}
                  />
                  <div
                    className={`${styles['what-we-need__item-content']} ${styles['what-we-need__item-content--right']}`}
                  >
                    {block.text && <p style={getTextStyle(i)}>{block.text}</p>}
                    {block.buttonText && getNorm(i) <= 0.45 && (
                      <Button
                        color="green"
                        variant="secondary-frame"
                        onClick={() => handleRedirect(i)}
                      >
                        {block.buttonText}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
