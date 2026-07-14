import type { ReactNode } from 'react';
import { CartProvider } from '@/lib/cart/CartContext';
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
        <SiteFooter />
        <RestaurantTaskDock />
        <MobileOrderBar />
        <CartDrawer />
      </MotionProvider>
    </CartProvider>
  );
}
