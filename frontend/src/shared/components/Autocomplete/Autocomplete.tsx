'use client';

import {
  useId,
  useEffect,
  useState,
  ChangeEvent,
  useRef,
  ReactElement,
  InputHTMLAttributes,
  forwardRef,
  ForwardedRef,
} from 'react';
import Input from '@/shared/components/Input/Input';
import styles from './Autocomplete.module.scss';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useOpenDirection } from '@/hooks/useOpenDirection';

interface AutocompleteProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelSize?: number;
  labelHeight?: number;
  labelWeight?: number;
  labelMargin?: number;
  errorMessage?: string;
  withError?: boolean;
  normalize?: boolean;
  placeholder?: string;
  onSelectOption?: (value: string | null) => void;
  options?: string[];
  fetcher?: (
    query: string,
  ) => Promise<{ data?: string[] } | string[] | undefined>;
  minLength?: number;
  debounce?: number;
}

function AutocompleteComponent(
  {
    label,
    labelSize = 14,
    labelHeight = 1,
    labelWeight = 500,
    labelMargin = 4,
    errorMessage,
    withError = false,
    normalize = false,
    placeholder,
    onSelectOption,
    options,
    fetcher,
    minLength = 2,
    debounce = 500,
    value,
    onChange,
    onBlur,
    ...rest
  }: AutocompleteProps,
  ref: ForwardedRef<HTMLInputElement>,
): ReactElement {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value?.toString() ?? '');
  const [filtered, setFiltered] = useState<string[]>([]);
  const debouncedValue = useDebouncedValue(inputValue, debounce);
  const fetcherRef = useRef(fetcher);
  const { openUp, handleToggle } = useOpenDirection(
    containerRef,
    isOpen,
    setIsOpen,
    Math.min((options ?? []).length * 41, 205),
  );

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    setInputValue(value?.toString() ?? '');
  }, [value]);

  useEffect(() => {
    const query = debouncedValue.trim();

    if (!isOpen || query.length < minLength) {
      setFiltered([]);
      return;
    }

    if (options) {
      setFiltered(
        options.filter((item) =>
          item.toLowerCase().includes(query.toLowerCase()),
        ),
      );
      return;
    }

    if (!fetcherRef.current) {
      return;
    }

    let cancelled = false;

    void (async (): Promise<void> => {
      try {
        const result = await fetcherRef.current?.(query);

        if (cancelled) {
          return;
        }

        if (Array.isArray(result)) {
          setFiltered(result);
        } else if (result && typeof result === 'object' && 'data' in result) {
          setFiltered(result.data ?? []);
        } else {
          setFiltered([]);
        }
      } catch {
        if (!cancelled) {
          setFiltered([]);
        }
      }
    })();

    return (): void => {
      cancelled = true;
    };
  }, [debouncedValue, isOpen, minLength, options]);

  useClickOutside({
    isOpen,
    onOutside: () => setIsOpen(false),
    isOutside: (e) => {
      const target = e.target as Node;
      return !!containerRef.current && !containerRef.current.contains(target);
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);
    onChange?.(e);
    onSelectOption?.(null);
  };

  const handleSelect = (item: string): void => {
    setIsOpen(false);
    setInputValue(item);
    const syntheticEvent = {
      target: { value: item },
    } as ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticEvent);
    onSelectOption?.(item);
  };

  const labelOffset = label ? labelSize * labelHeight + labelMargin - 4 : -4;
  const errorOffset = withError ? 16 : -4;

  return (
    <div className={styles.autocomplete} ref={containerRef}>
      <Input
        label={label}
        labelSize={labelSize}
        labelHeight={labelHeight}
        labelWeight={labelWeight}
        labelMargin={labelMargin}
        placeholder={placeholder}
        {...rest}
        ref={ref}
        id={id}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleToggle}
        onBlur={onBlur}
        withError={withError}
        normalize={normalize}
        errorMessage={errorMessage}
      />
      {isOpen && filtered.length > 0 && (
        <ul
          className={styles.autocomplete__list}
          style={
            openUp
              ? {
                  bottom: `calc(100% - ${labelOffset}px)`,
                }
              : {
                  top: `calc(100% - ${errorOffset}px)`,
                }
          }
        >
          {filtered.map((item: string) => (
            <li
              key={item}
              className={styles.autocomplete__item}
              onMouseDown={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const Autocomplete = forwardRef(AutocompleteComponent);
export default Autocomplete;
