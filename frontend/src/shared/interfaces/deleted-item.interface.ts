import { ReactElement } from 'react';

export interface DeletedItemInterface<T> {
  item: T;
  title: string;
  message: ReactElement<HTMLParagraphElement>;
}
