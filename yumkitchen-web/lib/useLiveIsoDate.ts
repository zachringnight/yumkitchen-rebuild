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
    // Focus and visibility never fire in a tab that just stays open, so a
    // session running across midnight would keep yesterday's floor. Fire at
    // the next local midnight too, then re-arm for the following one. The
    // extra minute absorbs timers coasting in while the machine sleeps.
    let midnightTimer: number;
    const armMidnight = () => {
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      midnightTimer = window.setTimeout(() => {
        sync();
        armMidnight();
      }, nextMidnight.getTime() - now.getTime() + 60_000);
    };
    armMidnight();
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', sync);
      window.clearTimeout(midnightTimer);
    };
  }, [offsetDays]);

  return value;
}
