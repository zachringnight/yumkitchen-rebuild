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

// OWNER SIGN-OFF REQUIRED (Zach): the response-time line below is a factual
// commitment about the business. Replace the bracketed placeholder with an
// approved commitment (for example "within 2 business days") before this
// page ships. Do not publish the bracketed text.
const RESPONSE_TIME = '[OWNER SIGN-OFF: response-time commitment, for example within 2 business days]';

// Per-kind tailoring. The kind arrives as an optional `?kind=` query param.
// Today no form redirects here with a kind, so the neutral default renders.
// Once InquiryForm redirects to `/thank-you?kind={kind}` on success, these
// branches take over with a next step that matches what was submitted.
const kindContent: Record<string, { note: string; nextHref: string; nextLabel: string }> = {
  catering: {
    note: 'Your catering note is in. While you wait, the catering page has menus and pricing to browse.',
    nextHref: '/catering',
    nextLabel: 'Back to Catering',
  },
  cake: {
    note: 'Your cake note is in. The cake pages have flavors, sizes, and delivery details to browse.',
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
            We got your note and it is on its way to the right person. We reply to every message, usually {RESPONSE_TIME}.
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
