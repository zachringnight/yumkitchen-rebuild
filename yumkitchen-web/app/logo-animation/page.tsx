import type { Metadata } from 'next';
import { LogoAnimation } from '@/components/LogoAnimation';
import { yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle('logo animation'),
  description: 'A yum! Kitchen and Bakery animated logo treatment.',
  openGraph: {
    ...yumOpenGraph('/og/default.jpg'),
    title: 'yum! logo animation',
    description: 'A yum! Kitchen and Bakery animated logo treatment.',
  },
  twitter: { images: ['/og/default.jpg'] },
  robots: { index: false, follow: false },
};

export default function LogoAnimationPage() {
  return (
    <main>
      <LogoAnimation />
    </main>
  );
}
