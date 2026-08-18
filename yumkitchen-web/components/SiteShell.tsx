'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/lib/cart/CartContext';
import { patticakeNationalOrderIsExternal } from '@/lib/site';
import { CartDrawer } from './cart/CartDrawer';
import { HashAnchorScroll } from './HashAnchorScroll';
import { MotionEnhancer } from './MotionEnhancer';
import { MotionProvider } from './motion/MotionProvider';
import { MobileOrderBar } from './MobileOrderBar';
import { PageScrollProgress } from './PageScrollProgress';
import { RestaurantTaskDock } from './RestaurantTaskDock';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/preview') {
    return children;
  }

  return (
    <CartProvider>
      <MotionProvider>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <MotionEnhancer />
        <HashAnchorScroll />
        <PageScrollProgress />
        <SiteHeader />
        <div id="main-content">{children}</div>
        <div
          className={
            pathname === '/order' || pathname === '/asset-gallery' || pathname.startsWith('/patticake/checkout')
              ? undefined
              : 'pb-24 md:pb-0'
          }
        >
          {/* pb-24 clears the fixed MobileOrderBar on small screens. Skip it
              where that bar is hidden so checkout does not end on empty cream. */}
          <SiteFooter />
        </div>
        <RestaurantTaskDock />
        <MobileOrderBar />
        {!patticakeNationalOrderIsExternal && <CartDrawer />}
      </MotionProvider>
    </CartProvider>
  );
}
