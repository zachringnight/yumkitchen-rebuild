import type { Metadata } from 'next';
import { LogoAnimation } from '@/components/LogoAnimation';

export const metadata: Metadata = {
  title: 'logo animation',
  description: 'A yum! Kitchen and Bakery animated logo treatment.',
  openGraph: {
    title: 'yum! logo animation',
    description: 'A yum! Kitchen and Bakery animated logo treatment.',
    images: ['/og/default.jpg'],
  },
  twitter: { images: ['/og/default.jpg'] },
};

export default function LogoAnimationPage() {
  return (
    <main>
      <LogoAnimation />
    </main>
  );
}
