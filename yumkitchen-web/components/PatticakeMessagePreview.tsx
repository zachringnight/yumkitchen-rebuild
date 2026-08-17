'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { pushAnalyticsEvent } from '@/lib/analytics';
import { CAKE_MESSAGE_EVENT, type CakeMessageDetail } from '@/lib/cakeMessage';
import { MotionPauseButton } from './MotionPauseButton';
import { Reveal } from './motion/Reveal';
import { snap } from './motion/springs';

const quickMessages = ['love you', 'miss you', 'thank you', 'go team', 'happy day', 'congrats'] as const;

type PatticakeMessagePreviewProps = {
  formHref?: string;
};

export function PatticakeMessagePreview({ formHref = '#cake-inquiry' }: PatticakeMessagePreviewProps) {
  const [message, setMessage] = useState('love you');
  const [liftoff, setLiftoff] = useState(0);
  const displayMessage = message.trim() || 'patticake';
  const words = displayMessage.split(/\s+/).filter(Boolean);

  function sendMessageToForm() {
    pushAnalyticsEvent({
      event: 'click_patticake_use_message',
      form_kind: 'cake',
      path: window.location.pathname,
    });
    if (window.location.hash !== formHref) {
      // pushState instead of setting location.hash: the native hash jump (and
      // HashAnchorScroll's retries) would fight the form's own scroll-to-field.
      window.history.pushState(null, '', formHref);
    }
    window.dispatchEvent(
      new CustomEvent<CakeMessageDetail>(CAKE_MESSAGE_EVENT, { detail: { message: displayMessage } }),
    );
  }

  function handleSend() {
    // Let the liftoff chip read for a beat before the scroll handoff fires.
    setLiftoff((count) => count + 1);
    window.setTimeout(sendMessageToForm, 280);
  }

  return (
    <Reveal as="section" id="message-maker" className="patticake-message-maker scroll-mt-24 bg-white px-6 py-12 md:scroll-mt-28 lg:py-section">
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <p className="section-label">message maker</p>
          <h2 className="text-h2 lowercase">make it sound like them</h2>
          <p className="mt-5 max-w-xl text-xl leading-9 text-body">
            Patticake gets more personal with a few words on top. Pick a quick note or type your own, then drop it into your pickup note.
          </p>
          <div className="message-chip-grid" role="group" aria-label="Message ideas">
            {quickMessages.map((item) => (
              <m.button
                key={item}
                type="button"
                aria-pressed={message === item}
                onClick={() => setMessage(item)}
                whileTap={{ scale: 0.94 }}
                transition={snap}
              >
                {item}
              </m.button>
            ))}
          </div>
          <label className="message-maker-field" htmlFor="patticake-message-preview">
            cake message
            <input
              id="patticake-message-preview"
              value={message}
              maxLength={28}
              onFocus={(event) => event.target.select()}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
          <div className="relative mt-6 flex flex-wrap items-center gap-4">
            <m.button
              type="button"
              className="btn-primary"
              onClick={handleSend}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={snap}
            >
              Send These Words
            </m.button>
            <p className="text-base leading-6 text-body">drops your words into the note below</p>
            {liftoff > 0 && (
              <m.span
                key={liftoff}
                className="pointer-events-none absolute left-0 top-full mt-2 text-sm font-bold text-brand-primary"
                aria-hidden="true"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: [0, 1, 1, 0], y: [-4, 0, 0, 2] }}
                transition={{ duration: 1.2, ease: 'easeOut', times: [0, 0.16, 0.74, 1] }}
                onAnimationComplete={() => setLiftoff(0)}
              >
                message added to your note
              </m.span>
            )}
          </div>
        </div>

        <div className="message-preview-stage" aria-live="polite">
          <MotionPauseButton className="motion-pause-button" />
          <div className="message-preview-cake">
            <Image
              src="/images/patticake/03_top_view.jpg"
              alt="Patticake top view with vanilla buttercream"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover crop-patticake-top"
            />
            <div className="message-preview-text" role="text" aria-label={displayMessage}>
              <AnimatePresence initial={false}>
                {words.map((word, index) => (
                  <m.span
                    key={index}
                    className="message-preview-word"
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.6, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={snap}
                  >
                    {word}
                  </m.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
