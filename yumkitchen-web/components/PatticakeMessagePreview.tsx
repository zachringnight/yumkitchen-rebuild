'use client';

import Image from 'next/image';
import { useState } from 'react';
import { pushAnalyticsEvent } from '@/lib/analytics';
import { CAKE_MESSAGE_EVENT, type CakeMessageDetail } from '@/lib/cakeMessage';
import { MotionPauseButton } from './MotionPauseButton';

const quickMessages = ['love you', 'miss you', 'thank you', 'go team', 'happy day', 'congrats'] as const;

type PatticakeMessagePreviewProps = {
  formHref?: string;
};

export function PatticakeMessagePreview({ formHref = '#cake-inquiry' }: PatticakeMessagePreviewProps) {
  const [message, setMessage] = useState('love you');
  const displayMessage = message.trim() || 'patticake';

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

  return (
    <section id="message-maker" className="patticake-message-maker scroll-mt-24 bg-white px-6 py-12 md:scroll-mt-28 lg:py-section" data-reveal>
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <p className="section-label">message maker</p>
          <h2 className="text-h2 lowercase">make it sound like them</h2>
          <p className="mt-5 max-w-xl text-xl leading-9 text-body">
            Patticake gets more personal with a few words on top. Pick a quick note or type your own, then send it with the cake at checkout or in your pickup note.
          </p>
          <div className="message-chip-grid" role="group" aria-label="Message ideas">
            {quickMessages.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={message === item}
                onClick={() => setMessage(item)}
              >
                {item}
              </button>
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
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="button" className="btn-primary" onClick={sendMessageToForm}>
              Send These Words
            </button>
            <p className="text-base leading-6 text-body">drops your words into the note below</p>
          </div>
        </div>

        <div className="message-preview-stage" aria-live="polite">
          <MotionPauseButton className="motion-pause-button" />
          <div className="message-preview-card message-preview-card-back" aria-hidden="true">
            from yum! with love
          </div>
          <div className="message-preview-cake">
            <Image
              src="/images/patticake/03_top_view.jpg"
              alt="Patticake top view with vanilla buttercream"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover crop-patticake-top"
            />
            <div className="message-preview-text">
              {displayMessage}
            </div>
          </div>
          <div className="message-preview-card message-preview-card-front" aria-hidden="true">
            {message.length}/28 characters
          </div>
        </div>
      </div>
    </section>
  );
}
