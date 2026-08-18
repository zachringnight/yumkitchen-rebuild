/**
 * Route logic for the two fixed bottom bars, shared between the bars
 * themselves and the footer wrapper in SiteShell that reserves clearance for
 * them. When the two sides drifted, pages ended on dead space (or the bar
 * covered the footer's last row).
 *
 * MobileOrderBar: < md, on order-focused routes.
 * RestaurantTaskDock: >= md, on restaurant routes.
 */

/** Routes where the fixed MobileOrderBar does not render. */
export function hidesMobileOrderBar(pathname: string): boolean {
  return (
    pathname === '/order' ||
    pathname === '/asset-gallery' ||
    pathname.startsWith('/patticake/checkout')
  );
}

/**
 * Routes where the fixed RestaurantTaskDock does not render. The dock also
 * skips every Patticake surface; the caller passes that flag in because it
 * comes from usePatticakeSurface (host-routing aware), not from the pathname
 * alone.
 */
export function hidesRestaurantTaskDock(pathname: string, patticakeSurface: boolean): boolean {
  return (
    patticakeSurface ||
    pathname === '/order' ||
    pathname === '/logo-animation' ||
    pathname === '/asset-gallery'
  );
}

/**
 * Bottom clearance under the footer, per viewport tier:
 * - below md, the MobileOrderBar measures 55px; 4.75rem matches the historic
 *   body padding it replaced;
 * - md and up, the RestaurantTaskDock measures 99px, so 6.25rem.
 * Both grow by env(safe-area-inset-bottom): with viewport-fit=cover the bars
 * themselves grow by the same inset (globals.css), so the clearance has to
 * track them. env() is 0px off-device, where these match the plain values.
 * Tailwind needs every used combination spelled out as a static string.
 */
export function footerClearanceClass(pathname: string, patticakeSurface: boolean): string | undefined {
  const forBar = !hidesMobileOrderBar(pathname);
  const forDock = !hidesRestaurantTaskDock(pathname, patticakeSurface);
  if (forBar && forDock) {
    return 'pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:pb-[calc(6.25rem+env(safe-area-inset-bottom,0px))]';
  }
  if (forBar) return 'pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:pb-0';
  if (forDock) return 'md:pb-[calc(6.25rem+env(safe-area-inset-bottom,0px))]';
  return undefined;
}
