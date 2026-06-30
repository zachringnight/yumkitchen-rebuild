import type { Metadata } from 'next';
import { PatticakeHome } from '@/components/PatticakeHome';
import { JsonLd } from '@/components/JsonLd';
import { brandJsonLd } from '@/lib/locations';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: pageMeta.patticakeHome.title,
  description: pageMeta.patticakeHome.description,
  alternates: { canonical: '/' },
  openGraph: { images: [pageMeta.patticakeHome.image] },
  twitter: { images: [pageMeta.patticakeHome.image] },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={brandJsonLd()} />
      <PatticakeHome />
    </>
  );
}
