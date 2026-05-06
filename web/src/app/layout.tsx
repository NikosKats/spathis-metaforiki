import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import type { Metadata, Viewport } from 'next';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { ServiceWorker } from '@/components/site/ServiceWorker';

const inter = Inter({ variable: '--font-sans', subsets: ['latin', 'greek'], display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ variable: '--font-mono', subsets: ['latin'], display: 'swap' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#c8102e' },
    { media: '(prefers-color-scheme: dark)', color: '#190602' },
  ],
  colorScheme: 'light',
};

export const metadata: Metadata = {
  applicationName: 'ΣΠΑΘΗΣ — Μεταφορική Κεφαλονιάς',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ΣΠΑΘΗΣ',
  },
  formatDetection: {
    telephone: true,
    address: false,
    email: true,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let lang: string = routing.defaultLocale;
  try {
    lang = await getLocale();
  } catch {
    /* no locale context (e.g. /admin) — use default */
  }

  return (
    <html lang={lang} className={cn('h-full antialiased', inter.variable, jetbrainsMono.variable)}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
