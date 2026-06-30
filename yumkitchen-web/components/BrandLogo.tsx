import Link from 'next/link';
import { AnimatedYumLogo } from './AnimatedYumLogo';

export function BrandLogo({
  ariaLabel = 'yum! Kitchen and Bakery home',
  className = '',
  href = '/',
}: {
  ariaLabel?: string;
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`site-brand inline-flex items-center leading-none text-ink ${className}`}
      aria-label={ariaLabel}
    >
      <AnimatedYumLogo className="site-brand-mark" decorative priority />
    </Link>
  );
}
