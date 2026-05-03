import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin', 'greek'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin', 'greek'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://spathismetaforiki.gr'),
  title: { default: 'ΣΠΑΘΗΣ — Μεταφορική Κεφαλονιάς', template: '%s | ΣΠΑΘΗΣ' },
  description: 'Συμπαγή φορτία, containers, τρακτορεύσεις από και προς την Κεφαλονιά.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
