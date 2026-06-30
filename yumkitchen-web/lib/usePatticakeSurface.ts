'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const patticakeHosts = new Set(['patticake.com', 'www.patticake.com']);

export function usePatticakeSurface() {
  const pathname = usePathname();
  const [host, setHost] = useState('');

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHost(window.location.hostname.toLowerCase());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return pathname === '/patticake' || pathname.startsWith('/patticake/') || patticakeHosts.has(host);
}
