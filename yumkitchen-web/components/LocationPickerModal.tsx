'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import { locations, type Location, type LocationSlug } from '@/lib/locations';
import { setPreferredLocationSlug } from '@/lib/locationPreference';
import { OpenStatus } from './OpenStatus';

type Mode = 'order' | 'call' | 'select';

type Props = {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  onSelectLocation?: (loc: Location) => void;
  selectedSlug?: LocationSlug;
};

export function LocationPickerModal({ open, onClose, mode, onSelectLocation, selectedSlug }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstActionRef = useRef<HTMLElement | null>(null);
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

  const heading =
    mode === 'order'
      ? 'where would you like to order from?'
      : mode === 'select'
        ? 'choose your pickup restaurant'
        : 'which restaurant would you like to call?';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-picker-heading"
      className="location-modal-backdrop motion-role-modal fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-4 py-8 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="location-modal-panel motion-role-modal relative w-full max-w-[520px] border border-ink/10 bg-cream px-5 pb-5 pt-9 shadow-[0_1.8rem_5rem_rgb(45_45_45_/_0.28)] outline-hidden sm:px-8 sm:pb-8 sm:pt-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center border border-ink/10 bg-white/75 text-body hover:text-ink focus:outline-solid focus:outline-2 focus:outline-brand-primary"
        >
          <span aria-hidden="true" className="text-3xl">×</span>
        </button>

        <h2 id="location-picker-heading" className="mb-6 pr-8 text-center font-serif text-[1.45rem] font-normal leading-tight text-ink sm:mb-7">
          {heading}
        </h2>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
          {locations.map((loc, index) => {
            const selected = mode === 'select' && loc.slug === selectedSlug;
            const focusSelected = mode === 'select' && selectedSlug ? selected : index === 0;
            return (
              <LocationButton
                key={loc.slug}
                loc={loc}
                mode={mode}
                selected={selected}
                actionRef={focusSelected ? firstActionRef : undefined}
                onClose={onClose}
                onSelectLocation={onSelectLocation}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LocationButton({
  loc,
  mode,
  selected = false,
  actionRef,
  onClose,
  onSelectLocation,
}: {
  loc: Location;
  mode: Mode;
  selected?: boolean;
  actionRef?: MutableRefObject<HTMLElement | null>;
  onClose: () => void;
  onSelectLocation?: (loc: Location) => void;
}) {
  const persistLocation = () => setPreferredLocationSlug(loc.slug);

  if (mode === 'select') {
    return (
      <button
        ref={(node) => {
          if (actionRef) actionRef.current = node;
        }}
        type="button"
        aria-pressed={selected}
        className={`grid min-h-[78px] place-items-center border-2 px-4 py-3 text-center transition focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-brand-red sm:min-h-[84px] ${
          selected
            ? 'border-brand-primary bg-brand-primary text-white shadow-[0_0.55rem_1.2rem_rgb(45_45_45_/_0.13)]'
            : 'border-brand-red/70 bg-white text-ink hover:border-brand-primary hover:bg-cream'
        }`}
        onClick={() => {
          persistLocation();
          onSelectLocation?.(loc);
          onClose();
        }}
      >
        {selected && <span className="mb-1 text-[0.68rem] font-bold uppercase leading-none tracking-[0.12em]">current pickup</span>}
        <span className="font-serif text-2xl font-normal lowercase leading-none">{loc.short_name}</span>
        <OpenStatus compact className={`mt-1 text-sm font-normal leading-tight ${selected ? 'text-white/90' : ''}`} />
      </button>
    );
  }

  if (mode === 'order') {
    return (
      <a
        ref={(node) => {
          if (actionRef) actionRef.current = node;
        }}
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
      ref={(node) => {
        if (actionRef) actionRef.current = node;
      }}
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
