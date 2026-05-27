'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { giftCardBalanceUrl, giftCardBuyUrl, navItems } from '@/lib/site';
import { BrandLogo } from './BrandLogo';
import { LocationPickerModal } from './LocationPickerModal';

function eventForHref(href: string) {
  if (href === giftCardBuyUrl) return 'click_gift_card_buy';
  if (href === giftCardBalanceUrl) return 'click_gift_card_balance';
  return undefined;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const mobileMenuId = 'site-mobile-navigation';

  function openOrderPicker() {
    setMenuOpen(false);
    setOrderOpen(true);
  }

  function isCurrent(href: string) {
    if (href === '/#locations') return pathname.startsWith('/location');
    if (!href.startsWith('/')) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function isExternal(item: { href: string; external?: boolean }) {
    return Boolean(item.external);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-blue-soft/60 bg-blue-tint/85 backdrop-blur-[4px]">
        <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-end justify-between gap-4 px-5 pb-2 lg:px-7">
          <BrandLogo />
          <nav aria-label="Primary navigation" className="hidden items-end xl:flex">
            {navItems.map((item) => {
              const childCurrent = 'children' in item && item.children.some((child) => isCurrent(child.href));
              const current = isCurrent(item.href) || childCurrent;
              const baseLink = (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={isExternal(item) ? undefined : false}
                  target={isExternal(item) ? '_blank' : undefined}
                  rel={isExternal(item) ? 'noopener noreferrer' : undefined}
                  data-event={eventForHref(item.href)}
                  aria-current={current ? 'page' : undefined}
                  className={`px-2.5 pb-2 pt-5 text-lg font-normal leading-none transition hover:text-ink hover:shadow-[inset_0_-4px_0_#2D2D2D] ${
                    current ? 'text-ink shadow-[inset_0_-4px_0_#2D2D2D]' : 'text-brand-primary'
                  }`}
                >
                  {item.label}
                </Link>
              );
              if (!('children' in item)) return baseLink;
              return (
                <div key={item.label} className="group relative">
                  {baseLink}
                  <div className="motion-role-feedback invisible absolute left-0 top-full z-50 grid min-w-44 translate-y-2 border border-blue-soft/70 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        prefetch={isExternal(child) ? undefined : false}
                        target={isExternal(child) ? '_blank' : undefined}
                        rel={isExternal(child) ? 'noopener noreferrer' : undefined}
                        data-event={eventForHref(child.href)}
                        className="whitespace-nowrap px-3 py-2 text-base leading-none text-brand-primary hover:bg-cream hover:text-ink focus:bg-cream focus:text-ink"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
          <div className="hidden items-center gap-3 xl:flex">
            <button type="button" className="btn-primary px-5 py-3" onClick={openOrderPicker}>
              Order Now
            </button>
          </div>
          <div className="flex items-center gap-2 xl:hidden">
            <button type="button" className="btn-primary px-4 py-3 text-base" onClick={openOrderPicker}>
              Order Now
            </button>
            <button
              type="button"
              aria-controls={mobileMenuId}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              onClick={() => setMenuOpen((value) => !value)}
              className="flex h-11 w-11 items-center justify-center border border-body text-ink"
            >
              <span aria-hidden="true" className="grid gap-1">
                <span className={`block h-0.5 w-5 bg-current transition ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
                <span className={`block h-0.5 w-5 bg-current transition ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-5 bg-current transition ${menuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id={mobileMenuId} aria-label="Mobile navigation" className="border-t border-blue-soft/60 bg-blue-tint px-5 pb-5 xl:hidden">
            <div className="grid gap-2 pt-3">
              {navItems.map((item) => {
                const childCurrent = 'children' in item && item.children.some((child) => isCurrent(child.href));
                const current = isCurrent(item.href) || childCurrent;
                return (
                  <div key={item.label} className="border-b border-blue-soft/60">
                    <Link
                      href={item.href}
                      prefetch={isExternal(item) ? undefined : false}
                      target={isExternal(item) ? '_blank' : undefined}
                      rel={isExternal(item) ? 'noopener noreferrer' : undefined}
                      data-event={eventForHref(item.href)}
                      aria-current={current ? 'page' : undefined}
                      className={`block py-3 text-lg font-normal ${current ? 'text-ink' : 'text-brand-primary'}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {'children' in item && (
                      <div className="grid gap-1 pb-3 pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            prefetch={isExternal(child) ? undefined : false}
                            target={isExternal(child) ? '_blank' : undefined}
                            rel={isExternal(child) ? 'noopener noreferrer' : undefined}
                            data-event={eventForHref(child.href)}
                            className="py-1 text-base leading-tight text-brand-primary"
                            onClick={() => setMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <Link href="/#locations" prefetch={false} className="btn-secondary mt-3 text-center" onClick={() => setMenuOpen(false)}>
                Find Us
              </Link>
            </div>
          </nav>
        )}
      </header>
      <LocationPickerModal open={orderOpen} onClose={() => setOrderOpen(false)} mode="order" />
    </>
  );
}
