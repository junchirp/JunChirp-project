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

interface AutocompleteProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelSize?: number;
  labelHeight?: number;
  labelWeight?: number;
  labelMargin?: number;
  errorMessages?: string[] | string;
  withError?: boolean;
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
    errorMessages,
    withError,
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

    if (!fetcher) {
      return;
    }

    let cancelled = false;

    (async (): Promise<void> => {
      try {
        const result = await fetcher(query);
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
  }, [debouncedValue, isOpen, minLength]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return (): void =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        onBlur={onBlur}
        withError={withError}
        errorMessages={errorMessages}
      />
      {isOpen && filtered.length > 0 && (
        <ul className={styles.autocomplete__list}>
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
