'use client';

import Image from 'next/image';
import { useState } from 'react';

const quickMessages = ['love you', 'miss you', 'thank you', 'go team', 'happy day', 'congrats'] as const;

export function PatticakeMessagePreview() {
  const [message, setMessage] = useState('love you');
  const displayMessage = message.trim() || 'patticake';

  return (
    <section className="patticake-message-maker bg-white px-6 py-12 lg:py-section" data-reveal>
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <p className="section-label">message maker</p>
          <h2 className="text-h2 lowercase">make it sound like them</h2>
          <p className="mt-5 max-w-xl text-xl leading-9 text-body">
            Patticake gets more personal with a few words on top. Pick a little note, then send the bakery the real message when you are ready.
          </p>
          <div className="message-chip-grid" aria-label="Message ideas">
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
              onClick={(event) => event.currentTarget.select()}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
        </div>

        <div className="message-preview-stage" aria-live="polite">
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
            {displayMessage.length}/28 characters
          </div>
        </div>
      </div>
    </section>
  );
}
