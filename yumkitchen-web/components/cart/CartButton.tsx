'use client';

import { useCart } from '@/lib/cart/CartContext';

export function CartButton({ className = '' }: { className?: string }) {
  const { itemCount, openDrawer } = useCart();
  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Open cake box${itemCount ? `, ${itemCount} item${itemCount === 1 ? '' : 's'}` : ''}`}
      className={`relative flex h-11 w-11 items-center justify-center border border-ink/20 bg-white/70 text-ink transition hover:border-brand-red focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-brand-red ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path d="M6.2 8.5h11.6l.9 11.1H5.3L6.2 8.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M9.1 8.5a2.9 2.9 0 0 1 5.8 0" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-brand-red px-1 text-xs font-bold leading-none text-white">
          {itemCount}
        </span>
      )}
    </button>
  );
}
