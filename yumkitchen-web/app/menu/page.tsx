import type { Metadata } from 'next';
import { MenuClient } from './MenuClient';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: pageMeta.menu.title,
  description: pageMeta.menu.description,
  alternates: { canonical: '/menu' },
  openGraph: { images: [pageMeta.menu.image] },
};

export default function MenuPage() {
  return (
    <main>
      <MenuClient />
    </main>
  );
}
