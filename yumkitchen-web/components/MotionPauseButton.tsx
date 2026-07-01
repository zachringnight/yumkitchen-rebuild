'use client';

import { useEffect, useState } from 'react';

export function MotionPauseButton({ className = '' }: { className?: string }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.motionPaused = paused ? 'true' : 'false';
    return () => {
      delete document.documentElement.dataset.motionPaused;
    };
  }, [paused]);

  return (
    <button
      type="button"
      className={className}
      aria-pressed={paused}
      onClick={() => setPaused((value) => !value)}
    >
      {paused ? 'Play Animation' : 'Pause Animation'}
    </button>
  );
}
