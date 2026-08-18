'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/lib/cart/CartContext';
import { footerClearanceClass } from '@/lib/mobileOrderBar';
import { patticakeNationalOrderIsExternal } from '@/lib/site';
import { usePatticakeSurface } from '@/lib/usePatticakeSurface';
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
  const patticakeSurface = usePatticakeSurface();

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
        {/* The only bottom clearance for the fixed bars (MobileOrderBar below
            md, RestaurantTaskDock at md+). Sized per route so no page ends on
            dead space and no bar covers the footer's last row. globals.css
            deliberately puts no padding on body. */}
        <div className={footerClearanceClass(pathname, patticakeSurface)}>
          <SiteFooter />
        </div>
        <RestaurantTaskDock />
        <MobileOrderBar />
        {!patticakeNationalOrderIsExternal && <CartDrawer />}
      </MotionProvider>
    </CartProvider>
  );
}
