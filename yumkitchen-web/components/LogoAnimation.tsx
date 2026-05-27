'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatedYumLogo } from './AnimatedYumLogo';

export function LogoAnimation() {
  const [runId, setRunId] = useState(0);

  return (
    <section className="logo-animation-shell" aria-labelledby="logo-animation-title">
      <Image
        src="/images/yum-hero-1698.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="logo-animation-backdrop"
      />
      <div className="logo-animation-wash" />
      <div className="logo-animation-stage">
        <h1 id="logo-animation-title" className="sr-only">
          yum! logo animation
        </h1>
        <AnimatedYumLogo key={runId} runId={runId} priority />
        <p className="logo-animation-tagline">made from scratch with love</p>
        <button type="button" className="logo-animation-replay" onClick={() => setRunId((value) => value + 1)}>
          Replay
        </button>
      </div>
    </section>
  );
}
