'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { patticakeNationalOrderUrl } from '@/lib/site';
import { usePatticakeSurface } from '@/lib/usePatticakeSurface';
import { OpenStatus } from './OpenStatus';
import { usePreferredLocation } from '@/lib/usePreferredLocation';

export function MobileOrderBar() {
  const pathname = usePathname();
  const { location } = usePreferredLocation();
  const [visible, setVisible] = useState(false);
  const patticakeSurface = usePatticakeSurface();
  const patticakePrimaryHref = pathname === '/order-a-cake' ? '#cake-inquiry' : patticakeNationalOrderUrl;
  const patticakeOrderIsExternal = /^https?:\/\//.test(patticakePrimaryHref);

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

  if (pathname === '/order') return null;

  return (
    <div
      className={`mobile-order-bar fixed inset-x-0 bottom-0 z-50 border-t border-blue-soft bg-white/96 px-3 py-2 shadow-[0_-0.6rem_1.8rem_rgb(45_45_45_/_0.12)] backdrop-blur transition md:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto grid max-w-md grid-cols-[1fr_auto] items-center gap-2">
        <div className="min-w-0">
          {patticakeSurface ? (
            <>
              <p className="truncate text-sm font-bold leading-tight text-ink">{pathname === '/order-a-cake' ? 'Patticake local pickup' : 'Patticake national delivery'}</p>
              <p className="block truncate text-sm leading-tight text-body">{pathname === '/order-a-cake' ? 'fresh cake from yum!' : 'chocolate cake, sent farther'}</p>
            </>
          ) : (
            <>
              <p className="truncate text-sm font-bold leading-tight text-ink">Pickup: {location.short_name}</p>
              <OpenStatus compact className="block truncate text-sm leading-tight text-body" />
            </>
          )}
        </div>
        {patticakeSurface ? (
          <a
            href={patticakePrimaryHref}
            target={patticakeOrderIsExternal ? '_blank' : undefined}
            rel={patticakeOrderIsExternal ? 'noopener noreferrer' : undefined}
            className="btn-primary px-4 py-3 text-base"
            data-event="click_patticake_national_delivery_order"
            data-source="mobile_sticky_bar"
          >
            {pathname === '/order-a-cake' ? 'Start' : 'Order'}
          </a>
        ) : (
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
        )}
      </div>
    </div>
  );
}
