'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { patticakeNationalOrderUrl } from '@/lib/site';
import { useEffectiveLocation } from '@/lib/useEffectiveLocation';
import { usePatticakeSurface } from '@/lib/usePatticakeSurface';
import { OpenStatus } from './OpenStatus';

export function MobileOrderBar() {
  const pathname = usePathname();
  const { location } = useEffectiveLocation();
  const [visible, setVisible] = useState(false);
  const [hash, setHash] = useState('');
  const patticakeSurface = usePatticakeSurface();
  // The internal checkout shortcut only applies while the default in-page
  // order module is the configured national checkout; a configured external
  // NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL must keep winning at launch.
  const nationalOrderIsInternal = !/^https?:\/\//.test(patticakeNationalOrderUrl);
  const inPatticakeOrderSection = pathname === '/patticake' && hash === '#national-order' && nationalOrderIsInternal;
  const inPatticakeShippingForm = pathname === '/patticake' && hash === '#delivery-support';
  const patticakePrimaryHref = pathname === '/order-a-cake' ? '#cake-inquiry' : inPatticakeOrderSection ? '/patticake/checkout' : inPatticakeShippingForm ? '#delivery-support' : patticakeNationalOrderUrl;
  const patticakeOrderIsExternal = /^https?:\/\//.test(patticakePrimaryHref);
  const patticakeStickyTitle = pathname === '/order-a-cake' ? 'Pick Up Locally' : inPatticakeShippingForm ? 'Shipping Note' : 'Ship a Cake';
  const patticakeStickyCopy = pathname === '/order-a-cake' ? 'fresh from yum!' : inPatticakeOrderSection ? 'review your cake box' : inPatticakeShippingForm ? 'start the bakery note' : 'we help it arrive ready to share';
  const patticakeStickyAction = pathname === '/order-a-cake' ? 'Pick Up Locally' : inPatticakeOrderSection ? 'Checkout' : inPatticakeShippingForm ? 'Start Note' : 'Ship a Cake';

  useEffect(() => {
    const showAfter = pathname === '/' ? 820 : 260;
    const sync = () => setVisible(window.scrollY > showAfter);
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [pathname]);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  }, [pathname]);

  if (pathname === '/order' || pathname === '/asset-gallery') return null;

  return (
    <div
      className={`mobile-order-bar fixed inset-x-0 bottom-0 z-50 border-t border-blue-soft bg-white/96 px-3 py-2 shadow-[0_-0.6rem_1.8rem_rgb(45_45_45_/_0.12)] backdrop-blur transition md:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto grid max-w-md grid-cols-[1fr_auto_auto] items-center gap-2">
        <div className="min-w-0">
          {patticakeSurface ? (
            <>
              <p className="truncate text-sm font-bold leading-tight text-ink">{patticakeStickyTitle}</p>
              <p className="block truncate text-sm leading-tight text-body">{patticakeStickyCopy}</p>
            </>
          ) : (
            <>
              <p className="truncate text-sm font-bold leading-tight text-ink">Pickup: {location.short_name}</p>
              <OpenStatus compact className="block truncate text-xs leading-tight text-body" />
            </>
          )}
        </div>
        {patticakeSurface ? (
          <a
            href={patticakePrimaryHref}
            target={patticakeOrderIsExternal ? '_blank' : undefined}
            rel={patticakeOrderIsExternal ? 'noopener noreferrer' : undefined}
            className="btn-primary whitespace-nowrap px-3 py-3 text-sm sm:text-base"
            data-event="click_patticake_national_delivery_order"
            data-source="mobile_sticky_bar"
          >
            {patticakeStickyAction}
          </a>
        ) : (
          <>
            <Link href="/menu" prefetch={false} className="btn-secondary px-3 py-3 text-sm sm:text-base">
              Menu
            </Link>
            <a
              href={location.order_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-4 py-3 text-base"
              data-event="click_order_online"
              data-location={location.slug}
              data-source="mobile_sticky_bar"
            >
              Order
            </a>
          </>
        )}
      </div>
    </div>
  );
}
