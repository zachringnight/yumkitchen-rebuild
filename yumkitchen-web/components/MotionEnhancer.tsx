'use client';

import { useEffect } from 'react';

export function MotionEnhancer() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (items.length === 0) return;

    for (const item of items) item.classList.add('reveal-pending');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
    );

    for (const item of items) observer.observe(item);
    return () => observer.disconnect();
  }, []);

  return null;
}
