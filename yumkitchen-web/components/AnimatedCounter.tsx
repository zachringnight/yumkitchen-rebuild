'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  format?: (value: number) => string;
};

export function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1.3, className, format }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !ref.current) {
      setDisplay(value);
      return;
    }

    setDisplay(0);
    let frame = 0;
    let start = 0;
    const target = Number.isFinite(value) ? value : 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const run = (time: number) => {
          if (!start) start = time;
          const progress = Math.min((time - start) / (duration * 1000), 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(eased * target);
          if (progress < 1) {
            frame = requestAnimationFrame(run);
          } else {
            setDisplay(target);
          }
        };
        frame = requestAnimationFrame(run);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.35 },
    );

    observer.observe(ref.current);
    const fallback = window.setTimeout(() => setDisplay(target), 1600);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      cancelAnimationFrame(frame);
    };
  }, [duration, value]);

  const rounded = Math.round(display);
  const text = format ? format(display) : `${prefix}${rounded.toLocaleString()}${suffix}`;

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
