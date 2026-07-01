'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const scrollRetryDelays = [80, 220, 520, 1000, 1600];

function currentHashTargetId() {
  const hash = window.location.hash;
  if (!hash || hash === '#main-content') return undefined;

  const decoded = decodeURIComponent(hash.slice(1));
  const hashParts = decoded.split('#').filter(Boolean);
  return hashParts[hashParts.length - 1];
}

function scrollToCurrentHash() {
  const targetId = currentHashTargetId();
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  target.scrollIntoView({ block: 'start', behavior: 'auto' });
}

export function HashAnchorScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    let timeouts: number[] = [];

    const clearScheduledScrolls = () => {
      if (frame) window.cancelAnimationFrame(frame);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      frame = 0;
      timeouts = [];
    };

    const scheduleScroll = () => {
      clearScheduledScrolls();

      frame = window.requestAnimationFrame(() => {
        scrollToCurrentHash();
        timeouts = scrollRetryDelays.map((delay) => window.setTimeout(scrollToCurrentHash, delay));
      });
    };

    scheduleScroll();
    window.addEventListener('hashchange', scheduleScroll);
    window.addEventListener('load', scheduleScroll);

    return () => {
      clearScheduledScrolls();
      window.removeEventListener('hashchange', scheduleScroll);
      window.removeEventListener('load', scheduleScroll);
    };
  }, [pathname]);

  return null;
}
