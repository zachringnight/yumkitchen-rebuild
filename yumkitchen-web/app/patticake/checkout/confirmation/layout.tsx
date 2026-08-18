import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { patticakeTitle } from '@/lib/site';

// Without this the confirmation screen inherits the parent checkout segment's
// title, so the last tab of the walkthrough still reads "demo checkout".
export const metadata: Metadata = {
  title: patticakeTitle('demo order placed'),
  description: 'Demo order confirmation for Patticake nationwide delivery. No card was charged.',
  robots: { index: false, follow: false },
};

export default function PatticakeConfirmationLayout({ children }: { children: ReactNode }) {
  return children;
}
