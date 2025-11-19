'use client';

import { ReactElement, ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/redux/store';

export default function ReduxProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const storeRef = useRef<AppStore>(undefined);

  storeRef.current ??= makeStore();

  return <Provider store={storeRef.current}>{children}</Provider>;
}
