'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useEffectiveLocation } from '@/lib/useEffectiveLocation';
import { usePatticakeSurface } from '@/lib/usePatticakeSurface';
import { LocationPickerModal } from './LocationPickerModal';
import { OpenStatus } from './OpenStatus';

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M12 21s6.5-5.8 6.5-11A6.5 6.5 0 0 0 5.5 10C5.5 15.2 12 21 12 21Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M6.2 8.5h11.6l.9 11.1H5.3L6.2 8.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M9.1 8.5a2.9 2.9 0 0 1 5.8 0" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function RestaurantTaskDock() {
  const pathname = usePathname();
  const patticakeSurface = usePatticakeSurface();
  const { location } = useEffectiveLocation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showAfter = pathname === '/yum-kitchen' || pathname.startsWith('/location') ? 720 : 320;
    const sync = () => setVisible(window.scrollY > showAfter);
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [pathname]);

  if (patticakeSurface || pathname === '/order' || pathname === '/logo-animation' || pathname === '/asset-gallery') return null;

  return (
    <>
      <aside
        className={`restaurant-task-dock fixed inset-x-0 bottom-0 z-40 hidden border-t border-blue-soft/80 bg-blue-tint/95 px-6 py-3 shadow-[0_-0.75rem_2rem_rgb(45_45_45_/_0.12)] backdrop-blur transition duration-300 md:block ${
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[130%] opacity-0'
        }`}
        aria-label="Restaurant quick actions"
      >
        <div className="mx-auto grid max-w-[1040px] grid-cols-[1fr_auto_auto_auto] items-center gap-2">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="grid min-w-0 grid-cols-[auto_1fr] items-center gap-3 bg-transparent px-2 py-1.5 text-left text-ink transition hover:bg-blue-soft/55 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-brand-red"
          >
            <span className="grid h-11 w-11 place-items-center bg-brand-red text-white">
              <PinIcon />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase leading-none tracking-[0.12em] text-brand-primary">pickup restaurant</span>
              <span className="mt-1 block truncate font-serif text-2xl font-normal lowercase leading-none text-ink">{location.short_name}</span>
              <OpenStatus compact className="mt-1 block truncate text-sm leading-tight text-body" />
            </span>
          </button>
          <Link href="/menu" prefetch={false} className="btn-secondary hidden px-5 py-4 text-base xl:inline-block">
            Menu
          </Link>
          <Link href="/catering#inquiry" prefetch={false} className="btn-secondary hidden px-5 py-4 text-base xl:inline-block">
            Catering
          </Link>
          <a
            href={location.order_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-4 text-base"
            data-event="click_order_online"
            data-location={location.slug}
            data-source="restaurant_task_dock"
          >
            <BagIcon />
            Order {location.short_name}
          </a>
        </div>
      </aside>
      <LocationPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} mode="select" selectedSlug={location.slug} />
    </>
  );
}
