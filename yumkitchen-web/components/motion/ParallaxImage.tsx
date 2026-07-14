'use client';

import { useRef, useState, type ReactNode } from 'react';
import { m, useIsomorphicLayoutEffect, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useMotionPaused } from './useMotionPaused';

/**
 * Subtle scroll-linked drift for large photos, capped at ±6%. The caller's
 * className MUST include positioning (`relative ...` for standalone blocks,
 * `absolute inset-0` when layered inside an existing positioned card).
 * Children are next/image `fill` images, they position against the inner div.
 */
export function ParallaxImage({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  // `useReducedMotion()` resolves synchronously from `window.matchMedia` on the
  // client's very first render, but SSR has no window and always renders as if
  // motion were allowed. Reading it directly would make the client's first paint
  // disagree with the server-rendered HTML (a hydration mismatch) for any visitor
  // with reduced motion enabled. `mounted` starts `false` on both server and
  // client so the first render always matches, then flips to `true` in a layout
  // effect (client-only, pre-paint) so reduced-motion users never see a flash of
  // the parallax transform.
  const [mounted, setMounted] = useState(false);
  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);
  const reduce = mounted && prefersReducedMotion;
  const paused = useMotionPaused();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`.trim()}>
      <m.div className="absolute inset-x-0 -inset-y-[8%]" style={reduce || paused ? undefined : { y }}>
        {children}
      </m.div>
    </div>
  );
}
