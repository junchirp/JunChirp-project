'use client';

import { ReactElement, Suspense } from 'react';
import Footer from './Footer/Footer';

export default function FooterWrapper(): ReactElement {
  return (
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
  );
}
