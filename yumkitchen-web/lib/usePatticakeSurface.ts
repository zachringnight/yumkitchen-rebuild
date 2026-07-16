'use client';

import { usePathname } from 'next/navigation';
import { isYumKitchenHost, yumHostRoutingEnabled } from '@/lib/hostRouting';

export function usePatticakeSurface() {
  const pathname = usePathname();

  if (pathname === '/') {
    // With host routing on, yumkitchen.com serves the restaurant home at /
    // (rewritten in proxy.ts), so the shell must stay restaurant-branded.
    // The prerendered HTML for that rewrite comes from /yum-kitchen, which
    // renders restaurant-branded on the server, so this window check hydrates
    // consistently on both hosts.
    if (yumHostRoutingEnabled && typeof window !== 'undefined' && isYumKitchenHost(window.location.host)) {
      return false;
    }
    return true;
  }

  return pathname === '/patticake' || pathname.startsWith('/patticake/') || pathname === '/order-a-cake';
}
