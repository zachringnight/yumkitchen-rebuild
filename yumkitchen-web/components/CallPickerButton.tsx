'use client';

import { useState } from 'react';
import { LocationPickerModal } from './LocationPickerModal';
import { Button } from './ui/Button';

export function CallPickerButton({ label = 'Call Us', variant = 'primary' }: { label?: string; variant?: 'primary' | 'secondary' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant={variant} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <LocationPickerModal open={open} onClose={() => setOpen(false)} mode="call" />
    </>
  );
}
