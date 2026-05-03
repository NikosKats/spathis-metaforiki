import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ variable: '--font-geist-sans', subsets: ['latin', 'greek'], display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ variable: '--font-geist-mono', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://spathismetaforiki.gr'),
  title: { default: 'ΣΠΑΘΗΣ — Μεταφορική Κεφαλονιάς', template: '%s | ΣΠΑΘΗΣ' },
  description: 'Συμπαγή φορτία, containers, τρακτορεύσεις από και προς την Κεφαλονιά.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
