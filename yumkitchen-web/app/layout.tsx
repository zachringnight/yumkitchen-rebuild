import type { Metadata } from 'next';
import { Archivo_Narrow, Trocchi } from 'next/font/google';
import { AnalyticsEvents } from '@/components/AnalyticsEvents';
import { DeferredGoogleTagManager } from '@/components/DeferredGoogleTagManager';
import { SiteShell } from '@/components/SiteShell';
import { pageMeta, patticakeOpenGraph, patticakeSiteName, siteUrl } from '@/lib/site';
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
  title: pageMeta.patticakeHome.title,
  description: pageMeta.patticakeHome.description,
  openGraph: {
    type: 'website',
    ...patticakeOpenGraph(pageMeta.patticakeHome.image),
  },
  applicationName: patticakeSiteName,
  twitter: { card: 'summary_large_image', images: [pageMeta.patticakeHome.image] },
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="bg-cream font-sans text-body antialiased">
        <noscript>
          <style>{`[data-motion-el]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {gtmId && <DeferredGoogleTagManager gtmId={gtmId} />}
        <AnalyticsEvents />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
