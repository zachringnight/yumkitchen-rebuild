'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Location } from '@/lib/locations';
import { giftCardBalanceUrl, giftCardBuyUrl, navItems, patticakeNationalOrderUrl } from '@/lib/site';
import { useEffectiveLocation } from '@/lib/useEffectiveLocation';
import { usePatticakeSurface } from '@/lib/usePatticakeSurface';
import { BrandLogo } from './BrandLogo';
import { CartButton } from './cart/CartButton';
import { LocationPickerModal } from './LocationPickerModal';
import { OpenStatus } from './OpenStatus';

function eventForHref(href: string) {
  if (href === giftCardBuyUrl) return 'click_gift_card_buy';
  if (href === giftCardBalanceUrl) return 'click_gift_card_balance';
  return undefined;
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [hash, setHash] = useState('');
  const { location, isRouteLocation } = useEffectiveLocation();
  const patticakeSurface = usePatticakeSurface();
  const mobileMenuId = 'site-mobile-navigation';
  const inPatticakeShippingStep = pathname === '/patticake' && hash === '#delivery-support';
  const patticakePrimaryHref = pathname === '/order-a-cake' ? '#cake-inquiry' : inPatticakeShippingStep ? '#delivery-support' : patticakeNationalOrderUrl;
  const patticakeOrderIsExternal = /^https?:\/\//.test(patticakePrimaryHref);
  const patticakePrimaryLabel = pathname === '/order-a-cake' ? 'Pick Up Locally' : inPatticakeShippingStep ? 'Start Note' : 'Ship a Cake';

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

  useEffect(() => {
    document.body.dataset.navOpen = menuOpen ? 'true' : 'false';
    return () => {
      delete document.body.dataset.navOpen;
    };
  }, [menuOpen]);

  function handleLocationSelect(nextLocation: Location) {
    if (isRouteLocation) router.push(`/location/${nextLocation.slug}`);
  }

  function isCurrent(href: string) {
    if (href === '/yum-kitchen#locations') return pathname === '/yum-kitchen' || pathname.startsWith('/location');
    if (!href.startsWith('/')) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function isExternal(item: { href: string; external?: boolean }) {
    return Boolean(item.external);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-blue-soft/70 bg-blue-tint backdrop-blur-[4px]">
        <div className="mx-auto flex h-[72px] w-full max-w-[1240px] items-center justify-between gap-4 px-5 lg:px-7">
          <div className="flex items-center gap-3">
            <BrandLogo
              href={patticakeSurface ? '/' : '/yum-kitchen'}
              ariaLabel={patticakeSurface ? 'Patticake home' : 'yum! Kitchen and Bakery home'}
            />
            {patticakeSurface && (
              <Link href="/" className="hidden font-serif text-3xl font-normal lowercase leading-tight text-ink sm:block">
                patticake
              </Link>
            )}
          </div>
          {patticakeSurface ? (
            <>
              <nav aria-label="Patticake navigation" className="hidden items-center gap-1 lg:flex">
                <Link href="/" className="flex h-[72px] items-center whitespace-nowrap px-3 text-lg font-normal leading-tight text-brand-primary transition hover:text-ink hover:shadow-[inset_0_-4px_0_var(--color-ink)]">
                  patticake
                </Link>
                <Link href="/patticake#national-order" className="flex h-[72px] items-center whitespace-nowrap px-3 text-lg font-normal leading-tight text-brand-primary transition hover:text-ink hover:shadow-[inset_0_-4px_0_var(--color-ink)]">
                  Ship a Cake
                </Link>
                <Link href="/order-a-cake#cake-inquiry" className="flex h-[72px] items-center whitespace-nowrap px-3 text-lg font-normal leading-tight text-brand-primary transition hover:text-ink hover:shadow-[inset_0_-4px_0_var(--color-ink)]">
                  Pick Up Locally
                </Link>
                <Link href="/yum-kitchen" className="flex h-[72px] items-center whitespace-nowrap px-3 text-lg font-normal leading-tight text-brand-primary transition hover:text-ink hover:shadow-[inset_0_-4px_0_var(--color-ink)]">
                  yum! Kitchen and Bakery
                </Link>
              </nav>
              <div className="hidden items-center gap-3 lg:flex">
                <a
                  href={patticakePrimaryHref}
                  target={patticakeOrderIsExternal ? '_blank' : undefined}
                  rel={patticakeOrderIsExternal ? 'noopener noreferrer' : undefined}
                  className="btn-primary px-5 py-3"
                  data-event="click_patticake_national_delivery_order"
                  data-source="site_header"
                >
                  {patticakePrimaryLabel}
                </a>
                <CartButton />
              </div>
            </>
          ) : (
            <>
              <nav aria-label="Primary navigation" className="hidden items-center lg:flex">
                {navItems.map((item) => {
                  const childCurrent = 'children' in item && item.children.some((child) => isCurrent(child.href));
                  const current = isCurrent(item.href) || childCurrent;
                  const hasChildren = 'children' in item;
                  const baseLink = (
                    <Link
                      key={item.label}
                      href={item.href}
                      prefetch={isExternal(item) ? undefined : false}
                      target={isExternal(item) ? '_blank' : undefined}
                      rel={isExternal(item) ? 'noopener noreferrer' : undefined}
                      data-event={eventForHref(item.href)}
                      aria-current={current ? 'page' : undefined}
                      className={`flex h-[72px] items-center gap-1.5 px-2.5 text-lg font-normal leading-none transition hover:text-ink hover:shadow-[inset_0_-4px_0_var(--color-ink)] ${
                        current ? 'text-ink shadow-[inset_0_-4px_0_var(--color-ink)]' : 'text-brand-primary'
                      }`}
                    >
                      <span>{item.label}</span>
                      {hasChildren && (
                        <svg aria-hidden="true" viewBox="0 0 12 8" className="mt-0.5 h-2 w-3" fill="none">
                          <path d="M1.5 1.5 6 6l4.5-4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </Link>
                  );
                  if (!hasChildren) return baseLink;
                  return (
                    <div key={item.label} className="group relative flex items-center">
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
              <div className="hidden items-center gap-3 lg:flex">
                <button
                  type="button"
                  className="hidden min-w-[10.5rem] border border-ink/15 bg-white/70 px-3 py-2 text-left text-ink transition hover:border-brand-red hover:bg-white focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-brand-red xl:block"
                  onClick={() => setLocationPickerOpen(true)}
                >
                  <span className="block text-xs font-bold uppercase leading-none tracking-[0.12em] text-brand-primary">pickup</span>
                  <span className="mt-1 block font-serif text-xl font-normal lowercase leading-none">{location.short_name}</span>
                  <OpenStatus compact className="mt-1 block text-xs leading-tight text-body" />
                </button>
                <a
                  href={location.order_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-5 py-3"
                  data-event="click_order_online"
                  data-location={location.slug}
                  data-source="site_header"
                >
                  Order {location.short_name}
                </a>
              </div>
            </>
          )}
          <div className="flex items-center gap-2 lg:hidden">
            {patticakeSurface ? (
              <a
                href={patticakePrimaryHref}
                target={patticakeOrderIsExternal ? '_blank' : undefined}
                rel={patticakeOrderIsExternal ? 'noopener noreferrer' : undefined}
                className="btn-primary px-4 py-3 text-base"
                data-event="click_patticake_national_delivery_order"
                data-source="site_header_mobile"
              >
                {patticakePrimaryLabel}
              </a>
            ) : (
              <a
                href={location.order_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-4 py-3 text-base"
                data-event="click_order_online"
                data-location={location.slug}
                data-source="site_header_mobile"
              >
                Order Now
              </a>
            )}
            {patticakeSurface && <CartButton />}
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
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 top-[72px] z-30 bg-ink/30 lg:hidden"
          />
        )}
        {menuOpen && (
          <nav id={mobileMenuId} aria-label="Mobile navigation" className="relative z-40 border-t border-blue-soft bg-cream px-5 pb-5 shadow-[0_1rem_2.2rem_rgb(45_45_45_/_0.16)] lg:hidden">
            <div className="grid gap-2 pt-3">
              {patticakeSurface ? (
                <>
                  <Link href="/" className="border-b border-blue-soft/60 py-3 text-lg font-normal text-brand-primary" onClick={() => setMenuOpen(false)}>
                    patticake
                  </Link>
                  <Link href="/patticake#national-order" className="border-b border-blue-soft/60 py-3 text-lg font-normal text-brand-primary" onClick={() => setMenuOpen(false)}>
                    Ship a Cake
                  </Link>
                  <Link href="/order-a-cake#cake-inquiry" className="border-b border-blue-soft/60 py-3 text-lg font-normal text-brand-primary" onClick={() => setMenuOpen(false)}>
                    Pick Up Locally
                  </Link>
                  <Link href="/yum-kitchen" className="border-b border-blue-soft/60 py-3 text-lg font-normal text-brand-primary" onClick={() => setMenuOpen(false)}>
                    yum! Kitchen and Bakery
                  </Link>
                  <p className="pt-4 text-xs font-bold uppercase tracking-[0.12em] text-brand-primary">more</p>
                  <Link href="/menu" prefetch={false} className="border-b border-blue-soft/60 py-3 text-lg font-normal text-brand-primary" onClick={() => setMenuOpen(false)}>
                    menu
                  </Link>
                  <Link href="/about" prefetch={false} className="border-b border-blue-soft/60 py-3 text-lg font-normal text-brand-primary" onClick={() => setMenuOpen(false)}>
                    about
                  </Link>
                  <Link href="/catering" prefetch={false} className="border-b border-blue-soft/60 py-3 text-lg font-normal text-brand-primary" onClick={() => setMenuOpen(false)}>
                    catering
                  </Link>
                  <Link href="/contact" prefetch={false} className="border-b border-blue-soft/60 py-3 text-lg font-normal text-brand-primary" onClick={() => setMenuOpen(false)}>
                    contact
                  </Link>
                  <a
                    href={giftCardBuyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event={eventForHref(giftCardBuyUrl)}
                    className="border-b border-blue-soft/60 py-3 text-lg font-normal text-brand-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    gift cards
                  </a>
                </>
              ) : (
                navItems.map((item) => {
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
                })
              )}
              {patticakeSurface ? (
                <a
                  href={patticakePrimaryHref}
                  target={patticakeOrderIsExternal ? '_blank' : undefined}
                  rel={patticakeOrderIsExternal ? 'noopener noreferrer' : undefined}
                  className="btn-secondary mt-3 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  {patticakePrimaryLabel}
                </a>
              ) : (
                <Link href="/yum-kitchen#locations" prefetch={false} className="btn-secondary mt-3 text-center" onClick={() => setMenuOpen(false)}>
                  Find Us
                </Link>
              )}
            </div>
          </nav>
        )}
        {!patticakeSurface && (
          <LocationPickerModal
            open={locationPickerOpen}
            onClose={() => setLocationPickerOpen(false)}
            mode="select"
            selectedSlug={location.slug}
            onSelectLocation={handleLocationSelect}
          />
        )}
      </header>
    </>
  );
}
