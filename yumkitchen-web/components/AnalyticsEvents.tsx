'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, string>>;
  }
}

export function AnalyticsEvents() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-event]') : null;
      if (!target) return;
      const eventName = target.dataset.event;
      if (!eventName) return;
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        event: eventName,
        location: target.dataset.location ?? '',
      });
    }

    window.addEventListener('click', onClick, { passive: true });
    return () => window.removeEventListener('click', onClick);
  }, []);

  return null;
}
