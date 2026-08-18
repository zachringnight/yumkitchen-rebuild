/**
 * Routes where the fixed MobileOrderBar does not render.
 *
 * Two places have to agree on this: MobileOrderBar itself, and the footer
 * wrapper in SiteShell that reserves bottom clearance for the bar. When they
 * drifted, checkout ended on a band of empty cream under the footer.
 */
export function hidesMobileOrderBar(pathname: string): boolean {
  return (
    pathname === '/order' ||
    pathname === '/asset-gallery' ||
    pathname.startsWith('/patticake/checkout')
  );
}

/** Bottom clearance for the bar, matching its rendered height. */
export const MOBILE_ORDER_BAR_CLEARANCE = 'pb-[4.75rem] md:pb-0';
