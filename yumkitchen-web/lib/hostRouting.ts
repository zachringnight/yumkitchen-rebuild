// Host-based brand routing, gated behind NEXT_PUBLIC_YUM_HOST_ROUTING=1.
// Off (default): both domains serve identical content and `/` is the
// Patticake home - today's pre-cutover behavior.
// On: yumkitchen.com serves the restaurant home at `/` (see proxy.ts),
// while patticake.com keeps the Patticake home. Flip the flag in the same
// deploy as the DNS cutover (build-time env; a redeploy applies it).

export const yumHostRoutingEnabled = process.env.NEXT_PUBLIC_YUM_HOST_ROUTING === '1';

export function isYumKitchenHost(host: string | null | undefined) {
  if (!host) return false;
  const hostname = host.toLowerCase().split(':')[0];
  return hostname === 'yumkitchen.com' || hostname === 'www.yumkitchen.com';
}
