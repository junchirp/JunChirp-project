import { ReactElement, ReactNode, Suspense } from 'react';

export default function ProjectsLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <Suspense fallback={<div />}>
      <div>{children}</div>
    </Suspense>
  );
}
