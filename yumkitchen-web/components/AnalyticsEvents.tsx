'use client';

import { useEffect } from 'react';
import { pushAnalyticsEvent } from '@/lib/analytics';
import { isLocationSlug, setPreferredLocationSlug } from '@/lib/locationPreference';

export function AnalyticsEvents() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-event]') : null;
      if (!target) return;
      const eventName = target.dataset.event;
      if (!eventName) return;
      const location = target.dataset.location ?? '';
      if ((eventName === 'click_order_online' || eventName === 'click_call_location') && isLocationSlug(location)) {
        setPreferredLocationSlug(location);
      }
      pushAnalyticsEvent({
        event: eventName,
        location,
        source: target.dataset.source ?? '',
        path: window.location.pathname,
        label: target.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) ?? '',
      });
    }

    window.addEventListener('click', onClick, { passive: true });
    return () => window.removeEventListener('click', onClick);
  }, []);

  return null;
}
