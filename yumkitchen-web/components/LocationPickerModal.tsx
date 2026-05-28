'use client';

import { useEffect, useRef, type Ref } from 'react';
import { locations, type Location } from '@/lib/locations';
import { setPreferredLocationSlug } from '@/lib/locationPreference';
import { OpenStatus } from './OpenStatus';

type Mode = 'order' | 'call';

type Props = {
  open: boolean;
  onClose: () => void;
  mode: Mode;
};

export function LocationPickerModal({ open, onClose, mode }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstActionRef = useRef<HTMLAnchorElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement as HTMLElement | null;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseRef.current();
      if (e.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      lastActiveRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstActionRef.current?.focus();
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  const heading = mode === 'order' ? 'where would you like to order from?' : "click the location you'd like to call.";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-picker-heading"
      className="location-modal-backdrop motion-role-modal fixed inset-0 z-50 flex items-center justify-center bg-brand-primary/80 px-4 py-8 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="location-modal-panel motion-role-modal relative w-full max-w-[480px] bg-cream px-8 pb-8 pt-10 outline-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-body hover:text-ink focus:outline-solid focus:outline-2 focus:outline-brand-primary"
        >
          <span aria-hidden="true" className="text-3xl">×</span>
        </button>

        <h2 id="location-picker-heading" className="mb-7 pr-8 text-center font-serif text-[1.45rem] font-normal leading-tight text-ink">
          {heading}
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {locations.map((loc, index) => (
            <LocationButton key={loc.slug} loc={loc} mode={mode} actionRef={index === 0 ? firstActionRef : undefined} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LocationButton({ loc, mode, actionRef }: { loc: Location; mode: Mode; actionRef?: Ref<HTMLAnchorElement> }) {
  const persistLocation = () => setPreferredLocationSlug(loc.slug);

  if (mode === 'order') {
    return (
      <a
        ref={actionRef}
        href={loc.order_url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary flex min-h-[64px] flex-col items-center justify-center px-4 py-3 text-center"
        data-event="click_order_online"
        data-location={loc.slug}
        data-source="location_picker_modal"
        onClick={persistLocation}
      >
        <span>{loc.name}</span>
        <OpenStatus compact className="mt-1 text-sm font-normal leading-tight text-white/90" />
      </a>
    );
  }
  return (
    <a
      ref={actionRef}
      href={`tel:${loc.phone_e164}`}
      className="btn-primary flex min-h-[58px] flex-col items-center justify-center px-4 py-3 text-center"
      data-event="click_call_location"
      data-location={loc.slug}
      data-source="location_picker_modal"
      onClick={persistLocation}
    >
      <span className="block">{loc.name}</span>
      <span className="block text-sm">{loc.phone}</span>
    </a>
  );
}
