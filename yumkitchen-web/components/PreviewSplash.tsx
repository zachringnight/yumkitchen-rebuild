'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function PreviewSplash({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function unlockPreview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password) {
      setStatus('error');
      setMessage('Enter the preview password.');
      return;
    }

    setStatus('sending');
    setMessage('');

    try {
      const response = await fetch('/api/preview-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setStatus('error');
        setMessage(payload.message ?? 'That password does not match. Try again.');
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setStatus('error');
      setMessage('The preview could not be unlocked. Please try again.');
    }
  }

  return (
    <main className="preview-splash min-h-svh overflow-hidden bg-blue-tint text-ink">
      <div className="preview-splash-grid mx-auto grid min-h-svh max-w-[1600px] lg:grid-cols-[0.78fr_1.22fr]">
        <section className="preview-splash-copy relative z-10 flex flex-col justify-between px-6 py-7 sm:px-10 sm:py-10 lg:px-[clamp(3rem,6vw,7rem)] lg:py-[clamp(3rem,7vh,6rem)]">
          <div className="preview-splash-brand flex items-center gap-4" aria-label="yum! Patticake">
            <div className="preview-splash-logo-motion relative h-20 w-20 shrink-0 overflow-hidden border-2 border-brand-red bg-blue-soft sm:h-24 sm:w-24">
              <Image
                src="/review-assets/posters/brand-motion-patticake-slice-logo-blue-4s-1x1.jpg"
                alt=""
                fill
                priority
                sizes="96px"
                className="preview-splash-logo-poster object-cover"
              />
              <video
                className="preview-splash-logo-video absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
              >
                <source src="/review-assets/videos/brand-motion-patticake-slice-logo-blue-4s-1x1.mp4" type="video/mp4" />
              </video>
            </div>
            <span className="font-serif text-[clamp(2.2rem,4vw,4rem)] lowercase leading-none text-brand-primary">patticake</span>
          </div>

          <div className="my-8 max-w-[38rem] lg:my-10">
            <h1 className="font-serif text-[clamp(3.25rem,5.8vw,6.35rem)] font-normal lowercase leading-[0.88] text-brand-primary">
              patticake is now available nationwide.
            </h1>
            <p className="mt-7 max-w-[31rem] text-xl leading-8 text-ink sm:text-2xl sm:leading-9">
              A private first look at nationwide delivery, local pickup, and the story behind the cake.
            </p>
          </div>

          <form onSubmit={unlockPreview} className="preview-access-form max-w-[34rem] border-t-2 border-brand-red pt-5" noValidate>
            <label htmlFor="preview-password" className="block text-sm font-bold uppercase tracking-[0.12em] text-brand-primary">
              Preview password
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                id="preview-password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (status === 'error') {
                    setStatus('idle');
                    setMessage('');
                  }
                }}
                autoComplete="current-password"
                aria-invalid={status === 'error'}
                aria-describedby={message ? 'preview-password-message' : undefined}
                className="min-h-14 w-full border-2 border-brand-red bg-white px-4 py-3 text-xl text-ink outline-hidden transition focus:ring-4 focus:ring-brand-red/20"
              />
              <button type="submit" className="btn-primary min-h-14 whitespace-nowrap px-7" disabled={status === 'sending'}>
                {status === 'sending' ? 'Opening...' : 'Enter preview'}
              </button>
            </div>
            <p id="preview-password-message" className={`mt-3 min-h-6 text-base font-bold ${status === 'error' ? 'text-brand-primary-darker' : 'text-ink'}`} role="status">
              {message}
            </p>
          </form>
        </section>

        <section className="preview-splash-media relative min-h-[48vh] overflow-hidden border-brand-red bg-blue-tint lg:min-h-svh lg:border-l-2" aria-label="Patticake motion preview">
          <Image
            src="/review-assets/posters/motion-1x1-patticake-gift-drop.jpg"
            alt="Patticake cake and packaging preview"
            fill
            priority
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="preview-splash-poster object-contain"
          />
          <video
            className="preview-splash-video absolute inset-0 h-full w-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/review-assets/posters/motion-1x1-patticake-gift-drop.jpg"
          >
            <source src="/review-assets/videos/motion-1x1-patticake-gift-drop.mp4" type="video/mp4" />
          </video>
          <div className="preview-splash-media-label absolute bottom-5 right-5 z-10 border-2 border-brand-red bg-blue-tint px-4 py-3 font-sans text-sm font-bold uppercase tracking-[0.12em] text-brand-primary sm:bottom-8 sm:right-8">
            private launch preview
          </div>
        </section>
      </div>
    </main>
  );
}
