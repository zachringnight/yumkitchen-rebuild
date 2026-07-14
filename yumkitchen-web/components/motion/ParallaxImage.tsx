'use client';

import { useRef, type ReactNode } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useMotionPaused } from './useMotionPaused';

/**
 * Subtle scroll-linked drift for large photos, capped at ±6%. The caller's
 * className MUST include positioning (`relative ...` for standalone blocks,
 * `absolute inset-0` when layered inside an existing positioned card).
 * Children are next/image `fill` images, they position against the inner div.
 */
export function ParallaxImage({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
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
