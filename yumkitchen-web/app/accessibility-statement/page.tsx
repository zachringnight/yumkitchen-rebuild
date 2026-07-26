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

// OWNER SIGN-OFF REQUIRED (Zach): the two constants below are factual
// commitments about the business, not copy. A conformance target and a
// response-time promise are liability statements. Replace both bracketed
// placeholders with approved values before this page ships. Do not publish
// the bracketed text.
const CONFORMANCE_TARGET = '[OWNER SIGN-OFF: WCAG conformance target, for example WCAG 2.1 Level AA]';
const RESPONSE_TIME = '[OWNER SIGN-OFF: response-time commitment, for example within 2 business days]';

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
              We are working to conform to {CONFORMANCE_TARGET}. Accessibility is part of how we build and review this site, not an afterthought.
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
              If any part of this site is hard to use, we want to know. Send a note with the feedback form below, and tell us the page and what got in your way. You can also call any yum! restaurant and a team member will pass your note along. We will get back to you {RESPONSE_TIME}.
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
