import type { ReactNode } from 'react';
import { HashAnchorScroll } from './HashAnchorScroll';
import { MotionEnhancer } from './MotionEnhancer';
import { MobileOrderBar } from './MobileOrderBar';
import { PageScrollProgress } from './PageScrollProgress';
import { RestaurantTaskDock } from './RestaurantTaskDock';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
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
    </>
  );
}
