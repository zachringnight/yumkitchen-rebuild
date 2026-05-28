import type { Metadata } from 'next';
import { Archivo_Narrow, Trocchi } from 'next/font/google';
import { AnalyticsEvents } from '@/components/AnalyticsEvents';
import { DeferredGoogleTagManager } from '@/components/DeferredGoogleTagManager';
import { SiteShell } from '@/components/SiteShell';
import { pageMeta, siteUrl } from '@/lib/site';
import './globals.css';

const sans = Archivo_Narrow({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-archivo-narrow',
  display: 'swap',
});

const serif = Trocchi({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-trocchi',
  display: 'swap',
});

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: pageMeta.home.title,
    template: '%s · yum! Kitchen',
  },
  description: pageMeta.home.description,
  openGraph: {
    type: 'website',
    siteName: 'yum! Kitchen',
    images: [pageMeta.home.image],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="bg-page font-sans text-body antialiased">
        {gtmId && <DeferredGoogleTagManager gtmId={gtmId} />}
        <AnalyticsEvents />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
