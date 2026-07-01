'use client';

import { usePathname } from 'next/navigation';

export function usePatticakeSurface() {
  const pathname = usePathname();

  return pathname === '/' || pathname === '/patticake' || pathname.startsWith('/patticake/') || pathname === '/order-a-cake';
}
