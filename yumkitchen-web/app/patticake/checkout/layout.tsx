import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { patticakeTitle } from '@/lib/site';

export const metadata: Metadata = {
  title: patticakeTitle('demo checkout'),
  description: 'Demo checkout for Patticake nationwide delivery. No card is charged.',
  robots: { index: false, follow: false },
};

export default function PatticakeCheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}
