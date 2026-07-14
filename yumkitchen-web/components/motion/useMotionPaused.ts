'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks the document-level motion pause flag that `MotionPauseButton` writes to
 * `document.documentElement.dataset.motionPaused`. CSS animations honor that flag
 * directly; JS-driven (scroll-linked) motion has to read it, which is what this hook
 * is for. Returns `false` on the server and until the first client effect runs.
 */
export function useMotionPaused() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setPaused(root.dataset.motionPaused === 'true');
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['data-motion-paused'] });
    return () => observer.disconnect();
  }, []);

  return paused;
}
