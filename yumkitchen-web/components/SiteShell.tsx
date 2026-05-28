import type { ReactNode } from 'react';
import { MotionEnhancer } from './MotionEnhancer';
import { MobileOrderBar } from './MobileOrderBar';
import { PageScrollProgress } from './PageScrollProgress';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <MotionEnhancer />
      <PageScrollProgress />
      <SiteHeader />
      <div id="main-content">{children}</div>
      <SiteFooter />
      <MobileOrderBar />
    </>
  );
}
