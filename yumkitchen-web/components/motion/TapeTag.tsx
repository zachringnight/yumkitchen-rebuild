'use client';

import { useState, type ReactNode } from 'react';
import { m } from 'motion/react';
import { frosting } from './springs';

/**
 * A taped label that drifts in, overshoots, and settles. After the entrance
 * it adds `tape-tag-settled`, which hands the element to the CSS ambient bob
 * (patticake-tag-bob) — so the pause button and reduced-motion reset keep
 * governing the loop exactly as before.
 */
export function TapeTag({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [settled, setSettled] = useState(false);
  return (
    <m.span
      className={settled ? 'tape-tag-settled' : undefined}
      data-motion-el=""
      initial={{ opacity: 0, y: -18, scale: 0.92, rotate: -6 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ ...frosting, delay }}
      onAnimationComplete={() => setSettled(true)}
    >
      {children}
    </m.span>
  );
}
