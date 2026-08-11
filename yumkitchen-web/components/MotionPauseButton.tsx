'use client';

import { useEffect, useState } from 'react';

type MotionPauseButtonProps = {
  className?: string;
  onPausedChange?: (paused: boolean) => void;
  persistKey?: string;
};

export function MotionPauseButton({ className = '', onPausedChange, persistKey }: MotionPauseButtonProps) {
  const [paused, setPaused] = useState(false);
  const [preferenceReady, setPreferenceReady] = useState(!persistKey);

  useEffect(() => {
    if (!persistKey) return;
    let storedPaused = false;
    try {
      storedPaused = window.sessionStorage.getItem(persistKey) === 'true';
    } catch {
      storedPaused = false;
    }
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setPaused(storedPaused);
      setPreferenceReady(true);
    });
    return () => {
      active = false;
    };
  }, [persistKey]);

  useEffect(() => {
    document.documentElement.dataset.motionPaused = paused ? 'true' : 'false';
    onPausedChange?.(paused);
    if (persistKey && preferenceReady) {
      try {
        window.sessionStorage.setItem(persistKey, String(paused));
      } catch {
        // The control still works for this page when browser storage is unavailable.
      }
    }
    return () => {
      delete document.documentElement.dataset.motionPaused;
    };
  }, [onPausedChange, paused, persistKey, preferenceReady]);

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
