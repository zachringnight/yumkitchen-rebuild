import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { menuJsonLd } from '@/lib/menu';
import { OrderClient } from './OrderClient';
import { pageMeta, yumCanonical, yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle(pageMeta.order.title),
  description: pageMeta.order.description,
  alternates: { canonical: yumCanonical('/order') },
  openGraph: yumOpenGraph(pageMeta.order.image),
  twitter: { images: [pageMeta.order.image] },
};

type OrderPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
    q?: string | string[];
  }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const params = searchParams ? await searchParams : {};
  return (
    <>
      <JsonLd data={menuJsonLd()} />
      <OrderClient initialCategory={firstParam(params.category)} initialQuery={firstParam(params.q)} />
    </>
  );
}
