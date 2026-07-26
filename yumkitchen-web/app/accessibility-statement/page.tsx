import type { Metadata } from 'next';
import { InquiryMomentumBand } from '@/components/InquiryMomentumBand';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { pageMeta, yumCanonical, yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle(pageMeta.accessibility.title),
  description: pageMeta.accessibility.description,
  alternates: { canonical: yumCanonical('/accessibility-statement') },
  openGraph: yumOpenGraph(pageMeta.accessibility.image),
  twitter: { images: [pageMeta.accessibility.image] },
};

// OWNER SIGN-OFF (Zach): both constants below are factual commitments about
// the business, not copy. Naming a conformance standard and promising a
// response time are liability statements, so both are opt-in rather than
// placeholders. Left null, the page states only what this repo can actually
// back up and makes no conformance claim. Set them to approved values and the
// page names the standard and the reply time. Never put bracketed placeholder
// text here; this page is publicly reachable.
const CONFORMANCE_TARGET: string | null = null;
const RESPONSE_TIME: string | null = null;

const commitments = [
  'Automated accessibility checks (axe-core) run on every key page of this site before each release. A release is blocked if any serious or critical issue is found.',
  'The whole site works with a keyboard, including a skip-to-content link at the top of every page.',
  'Animation respects your reduced-motion setting, and pages stay fully readable with JavaScript turned off.',
  'Form fields carry visible labels, and form errors are announced to screen readers.',
  'Images of food, people, and locations carry text alternatives.',
];

export default function AccessibilityPage() {
  return (
    <main>
      <section className="bg-cream py-section">
        <div className="container-content">
          <h1 className="text-display lowercase">our accessibility statement</h1>
          <p className="mt-5 max-w-3xl text-xl leading-9">
            yum! Kitchen and Bakery wants every guest to feel welcome, at our tables and on this site. That means readable pages, keyboard-friendly navigation, and a simple way to tell us when something is in your way.
          </p>
        </div>
      </section>
      <section className="bg-white py-section">
        <div className="container-content">
          <div className="max-w-3xl">
            <p className="section-label">our commitment</p>
            <h2 className="text-h2 lowercase">what we aim for</h2>
            <p className="mt-5 text-xl leading-9">
              {CONFORMANCE_TARGET
                ? `We are working to conform to ${CONFORMANCE_TARGET}. `
                : 'We want every guest to be able to use this site, however they browse. '}
              Accessibility is part of how we build and review this site, not an afterthought.
            </p>
          </div>
          <div className="mt-12 max-w-3xl">
            <h2 className="text-h2 lowercase">what we have done</h2>
            <ul className="mt-5 space-y-4 text-xl leading-9">
              {commitments.map((item) => (
                <li key={item} className="border-t border-ink/10 pt-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-12 max-w-3xl">
            <h2 className="text-h2 lowercase">how to report an issue</h2>
            <p className="mt-5 text-xl leading-9">
              If any part of this site is hard to use, we want to know. Send a note with the feedback form below, and tell us the page and what got in your way. You can also call any yum! restaurant and a team member will pass your note along.{RESPONSE_TIME ? ` We will get back to you ${RESPONSE_TIME}.` : ' We will get back to you.'}
            </p>
          </div>
        </div>
      </section>
      <section className="bg-cream py-section">
        <div className="container-content grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-label">feedback</p>
            <h2 className="text-h2 lowercase">please share what you notice</h2>
            <p className="mt-5 text-xl leading-9">If you have trouble using the site or have feedback about accessibility, send a note and a member of the team will be in contact.</p>
          </div>
          <InquiryForm kind="accessibility" />
        </div>
      </section>
      <InquiryMomentumBand
        title="hospitality includes access"
        copy="Readable pages, keyboard-friendly navigation, and a simple note form help everyone find what they need."
        primaryHref="/contact"
        primaryLabel="Contact Yum"
        secondaryHref="/menu"
        secondaryLabel="Browse Menu"
        image="/images/yum-catering-boxed-lunch.jpg"
        imageAlt="yum! boxed lunch and branded takeout box"
      />
    </main>
  );
}
