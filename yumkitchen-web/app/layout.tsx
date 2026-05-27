import type { Metadata } from 'next';
import Script from 'next/script';
import { Archivo_Narrow, Trocchi } from 'next/font/google';
import { AnalyticsEvents } from '@/components/AnalyticsEvents';
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
        {gtmId && (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                className="hidden"
                title="Google Tag Manager"
              />
            </noscript>
            <AnalyticsEvents />
          </>
        )}
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
