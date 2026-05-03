import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const inter = Inter({ variable: '--font-sans', subsets: ['latin', 'greek'], display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ variable: '--font-mono', subsets: ['latin'], display: 'swap' });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let lang: string = routing.defaultLocale;
  try {
    lang = await getLocale();
  } catch {
    /* no locale context (e.g. /admin) — use default */
  }

  return (
    <html lang={lang} className={cn('h-full antialiased', inter.variable, jetbrainsMono.variable)}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">{children}</body>
    </html>
  );
}
