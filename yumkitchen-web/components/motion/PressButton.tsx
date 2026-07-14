'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { snap } from './springs';

/** Wraps an existing CTA (<a>, <Link>, <button>) without changing its classes. */
export function PressButton({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <m.span
      className={`press-wrap inline-flex ${className}`.trim()}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={snap}
    >
      {children}
    </m.span>
  );
}
