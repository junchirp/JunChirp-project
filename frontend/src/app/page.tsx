import { redirect } from '@/i18n/routing';

export default function RootPage(): void {
  redirect(
    `/ua` as unknown as {
      href: { pathname: string; query?: Record<string, string> };
      locale: string;
    },
  );
}
