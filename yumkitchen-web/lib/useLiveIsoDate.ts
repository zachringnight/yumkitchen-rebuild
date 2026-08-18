'use client';

import { useEffect, useState } from 'react';
import { localIsoDate } from './localDate';

/**
 * Live local-calendar YYYY-MM-DD, `offsetDays` out from today.
 *
 * Returns '' on the server and on the first client render, on purpose. These
 * pages are statically prerendered, so a date computed during render is baked
 * into the HTML at build time and then goes stale: React does not patch host
 * attribute mismatches during production hydration, so a `min` written that
 * way keeps the build date for the whole session. The real date lands in an
 * effect instead, and re-syncs on focus so a tab left open past midnight does
 * not keep yesterday's floor.
 *
 * Callers should treat '' as "not known yet" (`min={floor || undefined}`).
 */
export function useLiveIsoDate(offsetDays = 0): string {
  const [value, setValue] = useState('');

  useEffect(() => {
    const sync = () => setValue(localIsoDate(offsetDays));
    sync();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') sync();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', sync);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', sync);
    };
  }, [offsetDays]);

  return value;
}
