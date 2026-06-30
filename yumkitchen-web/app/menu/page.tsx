import type { Metadata } from 'next';
import { MenuClient } from './MenuClient';
import { menuJsonLd } from '@/lib/menu';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: pageMeta.menu.title,
  description: pageMeta.menu.description,
  alternates: { canonical: '/menu' },
  openGraph: { images: [pageMeta.menu.image] },
  twitter: { images: [pageMeta.menu.image] },
};

export default function MenuPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd()) }} />
      <MenuClient />
    </main>
  );
}
