'use client';

import { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { pushAnalyticsEvent } from '@/lib/analytics';
import { CATERING_PLAN_EVENT, type CateringPlanDetail } from '@/lib/cateringPlan';
import { cateringPackages } from '@/lib/site';
import { locations } from '@/lib/locations';
import { Reveal } from './motion/Reveal';
import { snap } from './motion/springs';

// A lighter version of the Patticake message maker's "personalize, then hand
// off" choreography, applied to catering. The visitor assembles a real plan
// from real data, watches the sentence build a word at a time, then sends it
// into the form below, which fills the matching fields and pulses.
//
// Everything selectable here comes from shipped data: packages from
// cateringPackages, restaurants from lib/locations. Nothing is invented.

const guestOptions = ['10', '25', '50', '100'] as const;

export function CateringPlanBuilder({ formHref = '#inquiry' }: { formHref?: string }) {
  const [packageTitle, setPackageTitle] = useState<string>(cateringPackages[0].title);
  const [guests, setGuests] = useState<string>(guestOptions[1]);
  const [locationSlug, setLocationSlug] = useState<string>(locations[0].slug);
  const [liftoff, setLiftoff] = useState(0);

  const chosenLocation = locations.find((loc) => loc.slug === locationSlug) ?? locations[0];
  const summary = `Planning ${packageTitle} for about ${guests} guests, picking up from ${chosenLocation.name}.`;
  const words = summary.split(/\s+/).filter(Boolean);

  function sendPlanToForm() {
    pushAnalyticsEvent({
      event: 'click_catering_use_plan',
      form_kind: 'catering',
      guest_count: guests,
      location: locationSlug,
      path: window.location.pathname,
    });
    if (window.location.hash !== formHref) {
      // pushState rather than a hash jump, so the native scroll does not fight
      // the form's own scroll-to-field. Same reason as the cake message maker.
      window.history.pushState(null, '', formHref);
    }
    window.dispatchEvent(
      new CustomEvent<CateringPlanDetail>(CATERING_PLAN_EVENT, {
        detail: { summary, locationSlug, guests },
      }),
    );
  }

  function handleSend() {
    // Let the liftoff chip read for a beat before the handoff scrolls away.
    setLiftoff((count) => count + 1);
    window.setTimeout(sendPlanToForm, 280);
  }

  return (
    <section className="bg-blue-tint py-section" aria-labelledby="catering-plan-heading">
      <div className="container-content">
        <Reveal>
          <p className="section-label">start with the shape of it</p>
          <h2 id="catering-plan-heading" className="text-h2 lowercase">
            build the order, then send it over
          </h2>
          <p className="mt-4 max-w-2xl text-xl leading-9">
            Pick what you need and we will write it up for you. Send it down to the form and the details come with it.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="grid gap-6">
            <fieldset className="grid gap-3">
              <legend className="text-base font-bold uppercase tracking-[0.16em] text-brand-primary-deep">what are we making</legend>
              <div className="flex flex-wrap gap-2">
                {cateringPackages.map((pkg) => (
                  <button
                    key={pkg.title}
                    type="button"
                    onClick={() => setPackageTitle(pkg.title)}
                    aria-pressed={pkg.title === packageTitle}
                    className={`motion-role-feedback border px-4 py-2 text-left text-base leading-tight transition ${
                      pkg.title === packageTitle
                        ? 'border-brand-primary bg-white font-bold text-ink shadow-xs'
                        : 'border-ink/15 bg-white/70 text-body hover:border-brand-red'
                    }`}
                  >
                    {pkg.title}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="text-base font-bold uppercase tracking-[0.16em] text-brand-primary-deep">about how many</legend>
              <div className="flex flex-wrap gap-2">
                {guestOptions.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setGuests(count)}
                    aria-pressed={count === guests}
                    className={`motion-role-feedback border px-5 py-2 text-base tabular-nums transition ${
                      count === guests
                        ? 'border-brand-primary bg-white font-bold text-ink shadow-xs'
                        : 'border-ink/15 bg-white/70 text-body hover:border-brand-red'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="text-base font-bold uppercase tracking-[0.16em] text-brand-primary-deep">picking up from</legend>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <button
                    key={loc.slug}
                    type="button"
                    onClick={() => setLocationSlug(loc.slug)}
                    aria-pressed={loc.slug === locationSlug}
                    className={`motion-role-feedback border px-4 py-2 text-base transition ${
                      loc.slug === locationSlug
                        ? 'border-brand-primary bg-white font-bold text-ink shadow-xs'
                        : 'border-ink/15 bg-white/70 text-body hover:border-brand-red'
                    }`}
                  >
                    {loc.short_name}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="relative grid content-start gap-5 bg-white p-7 shadow-xs">
            <p className="text-base font-bold uppercase tracking-[0.16em] text-brand-primary-deep">your note so far</p>
            {/* Each word re-keys on the sentence, so changing a choice replays
                the build a word at a time. aria-live carries the finished
                sentence to screen readers instead of the per-word motion. */}
            <p className="sr-only" aria-live="polite">
              {summary}
            </p>
            <p className="flex flex-wrap gap-x-2 gap-y-1 font-serif text-2xl leading-snug text-ink" aria-hidden="true">
              <AnimatePresence mode="popLayout" initial={false}>
                {words.map((word, index) => (
                  <m.span
                    key={`${summary}-${index}-${word}`}
                    initial={{ opacity: 0, y: 10, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ ...snap, delay: Math.min(index * 0.035, 0.5) }}
                  >
                    {word}
                  </m.span>
                ))}
              </AnimatePresence>
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button type="button" onClick={handleSend} className="btn-primary motion-role-feedback">
                Send These Details
              </button>
              <span className="text-base text-body">We will confirm timing and final pricing.</span>
            </div>

            <AnimatePresence>
              {liftoff > 0 && (
                <m.span
                  key={liftoff}
                  className="pointer-events-none absolute bottom-6 left-7 bg-brand-primary px-3 py-1 text-sm font-bold text-white"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -46 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  onAnimationComplete={() => setLiftoff(0)}
                  aria-hidden="true"
                >
                  sent to the form
                </m.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
