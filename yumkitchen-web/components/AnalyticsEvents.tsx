'use client';

import { useEffect } from 'react';
import { pushAnalyticsEvent } from '@/lib/analytics';
import { isLocationSlug, setPreferredLocationSlug } from '@/lib/locationPreference';

const canonicalEventNames: Record<string, string> = {
  click_order_online: 'order_click',
  click_call_location: 'phone_click',
  click_location_directions: 'location_directions_click',
  click_gift_card_buy: 'gift_card_click',
  click_gift_card_balance: 'gift_card_click',
  click_patticake_national_delivery_order: 'patticake_shipping_order_click',
  click_patticake_add_to_cart: 'patticake_add_to_cart',
};

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
      const link = target instanceof HTMLAnchorElement ? target : target.closest<HTMLAnchorElement>('a');
      const destinationUrl = link?.href ?? '';
      const phoneNumber = destinationUrl.startsWith('tel:') ? destinationUrl.slice(4) : '';
      const ctaLabel = target.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) ?? '';
      pushAnalyticsEvent({
        event: eventName,
        canonical_event: canonicalEventNames[eventName] ?? eventName,
        location,
        source: target.dataset.source ?? '',
        path: window.location.pathname,
        page_path: window.location.pathname,
        label: ctaLabel,
        cta_label: ctaLabel,
        destination_url: destinationUrl,
        phone_number: phoneNumber,
      });
    }

    window.addEventListener('click', onClick, { passive: true });
    return () => window.removeEventListener('click', onClick);
  }, []);

  return null;
}
