import type { Metadata } from 'next';
import { PreviewSplash } from '@/components/PreviewSplash';

export const metadata: Metadata = {
  title: 'private preview | Patticake',
  description: 'Private Patticake preview.',
  robots: { index: false, follow: false },
};

function safeNextPath(value: string | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/preview')) return '/';
  return value;
}

export default async function PreviewPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <PreviewSplash nextPath={safeNextPath(next)} />;
}
