import Link from 'next/link';
import type { Metadata } from 'next';
import { CallPickerButton } from '@/components/CallPickerButton';
import { GiftCardBand } from '@/components/GiftCardBand';
import { yumCanonical, yumKitchenSiteName, yumOpenGraph, yumTitle } from '@/lib/site';

export const metadata: Metadata = {
  applicationName: yumKitchenSiteName,
  title: yumTitle('thank you'),
  description: 'Thanks for reaching out to yum! Kitchen and Bakery.',
  alternates: { canonical: yumCanonical('/thank-you') },
  openGraph: yumOpenGraph('/og/default.jpg'),
  robots: { index: false, follow: false },
  twitter: { images: ['/og/default.jpg'] },
};

// OWNER SIGN-OFF (Zach): a reply-time commitment is a factual statement about
// the business, so it is opt-in rather than a placeholder. Leave this null and
// the page simply omits the sentence; set it to an approved commitment (for
// example 'within 2 business days') and the sentence appears. Never put
// bracketed placeholder text here, this page is now reachable by real
// visitors after every form submission.
const RESPONSE_TIME: string | null = null;

// Per-kind tailoring. InquiryForm redirects here on a successful submit as
// `/thank-you?kind={kind}`, so these branches carry a next step matching what
// was actually sent. The param stays optional: a visitor who lands here
// directly gets the neutral default rather than a broken page.
const kindContent: Record<string, { note: string; nextHref: string; nextLabel: string }> = {
  catering: {
    note: 'Your catering note is in. While you wait, the catering page has menus and pricing to browse.',
    nextHref: '/catering',
    nextLabel: 'Back to Catering',
  },
  cake: {
    note: 'Your cake note is in. The Patticake pages have pickup and nationwide send paths to browse.',
    nextHref: '/order-a-cake',
    nextLabel: 'Back to Cakes',
  },
  careers: {
    note: 'Thanks for applying. While you wait, get to know the family behind yum!.',
    nextHref: '/about',
    nextLabel: 'About yum!',
  },
  accessibility: {
    note: 'Thank you for helping us make this site work better for every guest.',
    nextHref: '/accessibility-statement',
    nextLabel: 'Accessibility Statement',
  },
};

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind } = await searchParams;
  const tailored = kind ? kindContent[kind] : undefined;

  return (
    <main>
      <div className="bg-cream px-6 py-[clamp(5rem,10vw,9rem)]">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="section-label">message received</p>
          <h1 className="font-serif text-[clamp(3.5rem,8vw,6rem)] font-normal leading-[0.95] lowercase text-ink">thank you!</h1>
          <p className="mx-auto mt-6 max-w-xl text-xl leading-9 text-body">
            We got your note and it is on its way to the right person.{RESPONSE_TIME ? ` We reply to every message, usually ${RESPONSE_TIME}.` : ' We reply to every message.'}
          </p>
          {tailored && <p className="mx-auto mt-4 max-w-xl text-xl leading-9 text-body">{tailored.note}</p>}
          <p className="mx-auto mt-4 max-w-xl text-xl leading-9 text-body">Need an answer sooner? Calling your restaurant is the fastest way to reach us.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/yum-kitchen" className="btn-primary">
              Back to yum!
            </Link>
            {tailored && (
              <Link href={tailored.nextHref} className="btn-secondary">
                {tailored.nextLabel}
              </Link>
            )}
            <CallPickerButton label="Call a Restaurant" variant="secondary" />
          </div>
        </div>
      </div>
      {kind !== 'accessibility' && <GiftCardBand source="thank_you" compact />}
    </main>
  );
}
