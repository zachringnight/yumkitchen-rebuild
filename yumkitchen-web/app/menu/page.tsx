import type { Metadata } from 'next';
import { MenuClient } from './MenuClient';
import { GiftCardBand } from '@/components/GiftCardBand';
import { menuJsonLd } from '@/lib/menu';
import { pageMeta, yumCanonical, yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle(pageMeta.menu.title),
  description: pageMeta.menu.description,
  alternates: { canonical: yumCanonical('/menu') },
  openGraph: yumOpenGraph(pageMeta.menu.image),
  twitter: { images: [pageMeta.menu.image] },
};

export default function MenuPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd()) }} />
      <MenuClient />
      <GiftCardBand source="menu_page" />
    </main>
  );
}
