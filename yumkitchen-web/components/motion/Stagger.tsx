'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { frosting, snap } from './springs';

const groupTags = { div: m.div, ul: m.ul } as const;
const itemTags = { div: m.div, article: m.article, li: m.li } as const;

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: keyof typeof groupTags;
  gap?: number;
};

export function Stagger({ children, className, as = 'div', gap = 0.07 }: StaggerProps) {
  const Tag = groupTags[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
      variants={{ visible: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </Tag>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: keyof typeof itemTags;
  /** 'stamp' scales down into place with a slight rotation, the ticket-stub entrance. */
  variant?: 'rise' | 'stamp';
  /** Spring hover lift for cards. */
  hoverLift?: boolean;
};

export function StaggerItem({ children, className, as = 'div', variant = 'rise', hoverLift = false }: StaggerItemProps) {
  const Tag = itemTags[as];
  const variants =
    variant === 'stamp'
      ? {
          hidden: { opacity: 0, scale: 1.16, rotate: -6 },
          visible: { opacity: 1, scale: 1, rotate: 0, transition: frosting },
        }
      : {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: frosting },
        };
  return (
    <Tag
      className={className}
      data-motion-el=""
      variants={variants}
      whileHover={hoverLift ? { y: -6 } : undefined}
      transition={hoverLift ? snap : undefined}
    >
      {children}
    </Tag>
  );
}
