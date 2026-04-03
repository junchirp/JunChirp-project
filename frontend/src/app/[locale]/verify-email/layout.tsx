import React, { ReactElement } from 'react';
import BirdBackground from '@/shared/components/BirdBackground/BirdBackground';

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  return <BirdBackground>{children}</BirdBackground>;
}
