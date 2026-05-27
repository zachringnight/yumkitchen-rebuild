import Link from 'next/link';
import { AnimatedYumLogo } from './AnimatedYumLogo';

export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      prefetch={false}
      className={`site-brand inline-flex items-center leading-none text-ink ${className}`}
      aria-label="yum! Kitchen and Bakery home"
    >
      <AnimatedYumLogo className="site-brand-mark" decorative priority />
    </Link>
  );
}
