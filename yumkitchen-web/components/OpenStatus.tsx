'use client';

import { useEffect, useState } from 'react';
import { getOpenStatus, type OpenStatus as OpenStatusValue } from '@/lib/locationHours';

type Props = {
  className?: string;
  compact?: boolean;
};

export function OpenStatus({ className = '', compact = false }: Props) {
  const [status, setStatus] = useState<OpenStatusValue | null>(null);

  useEffect(() => {
    const sync = () => setStatus(getOpenStatus());
    sync();
    const timer = window.setInterval(sync, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!status) {
    return <span className={className}>Open 8am - 8pm daily</span>;
  }

  if (compact) {
    return (
      <span className={className}>
        {status.label} {status.detail}
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`}>
      <span className={status.open ? 'font-bold text-brand-primary' : 'font-bold text-ink'}>{status.label}</span>
      <span>{status.detail}</span>
    </span>
  );
}
