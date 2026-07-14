'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { frosting } from './springs';

const tags = {
  div: m.div,
  section: m.section,
  figure: m.figure,
  h1: m.h1,
  p: m.p,
  span: m.span,
} as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: keyof typeof tags;
  delay?: number;
  /** Rise distance in px. 0 = fade only (safe on elements with CSS transform animations). */
  y?: number;
  /** false = transform-only entrance (LCP-safe: element paints fully visible). */
  fade?: boolean;
};

export function Reveal({ children, className, id, as = 'div', delay = 0, y = 24, fade = true }: RevealProps) {
  const Tag = tags[as];
  const hidden: Record<string, number> = {};
  const shown: Record<string, number> = {};
  if (fade) {
    hidden.opacity = 0;
    shown.opacity = 1;
  }
  if (y !== 0) {
    hidden.y = y;
    shown.y = 0;
  }
  return (
    <Tag
      id={id}
      className={className}
      data-motion-el=""
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
      transition={{ ...frosting, delay }}
    >
      {children}
    </Tag>
  );
}
