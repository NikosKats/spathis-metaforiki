import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

const inter = Inter({ variable: '--font-geist-sans', subsets: ['latin', 'greek'], display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ variable: '--font-geist-mono', subsets: ['latin'], display: 'swap' });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Falls back to default locale for /admin (which doesn't run through next-intl middleware)
  let lang: string = routing.defaultLocale;
  try {
    lang = await getLocale();
  } catch {
    /* no locale context (e.g. /admin) — use default */
  }

  return (
    <html lang={lang} className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
