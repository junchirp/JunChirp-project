'use client';

import { ReactElement } from 'react';
import styles from './Pagination.module.scss';
import Button from '@/shared/components/Button/Button';
import { getPaginationPages } from '@/shared/utils/getPaginationPages';
import ArrowLeft from '@/assets/icons/arrow-left.svg';
import ArrowRight from '@/assets/icons/arrow-right.svg';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import { limitOptions } from '@/shared/constants/limit-options';

interface PaginationProps {
  total: number;
  limit: number;
  page: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newPage: number) => void;
}

export default function Pagination(props: PaginationProps): ReactElement {
  const { total, limit, page, onPageChange, onLimitChange } = props;
  const totalPages = Math.ceil(total / limit);
  const pages = getPaginationPages(page, totalPages);

  return (
    <div className={styles.pagination}>
      <div className={styles.pagination__size}>
        <Dropdown
          options={limitOptions}
          value={limit}
          onChange={(value) => onLimitChange(Number(value))}
          getOptionLabel={(option) => String(option)}
          getOptionValue={(option) => option}
        />
      </div>
      <div className={styles.pagination__paginator}>
        <Button
          color="green"
          variant="tertiary"
          icon={<ArrowLeft />}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        />
        <div className={styles.pagination__pages}>
          {pages.map((p, idx) =>
            p === 'ellipsis' ? (
              <span className={styles.pagination__ellipsis} key={`dots-${idx}`}>
                &hellip;
              </span>
            ) : (
              <Button
                className={`${styles.pagination__page} ${p === page && styles['pagination__page--selected']}`}
                color={p === page ? 'green' : 'gray'}
                variant="tertiary"
                key={p}
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>
            ),
          )}
        </div>
        <Button
          color="green"
          variant="tertiary"
          icon={<ArrowRight />}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        />
      </div>
    </div>
  );
}
