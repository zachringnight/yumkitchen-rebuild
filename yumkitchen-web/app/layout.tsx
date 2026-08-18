import type { Metadata, Viewport } from 'next';
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

// viewport-fit=cover lets the fixed bottom bars extend behind the iPhone home
// indicator; their safe-area padding (globals.css) keeps the tappable content
// above it. Without cover, env(safe-area-inset-*) is always 0.
export const viewport: Viewport = {
  viewportFit: 'cover',
};

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
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable}`}
      data-scroll-behavior="smooth"
    >
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
