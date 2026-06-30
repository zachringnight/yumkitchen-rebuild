import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'thank you',
  description: 'Thanks for reaching out to yum! Kitchen and Bakery.',
  alternates: { canonical: '/thank-you' },
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main className="bg-cream px-6 py-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto max-w-[760px] text-center">
        <p className="section-label">message received</p>
        <h1 className="font-serif text-[clamp(3.5rem,8vw,6rem)] font-normal leading-[0.95] lowercase text-ink">thank you!</h1>
        <p className="mx-auto mt-6 max-w-xl text-xl leading-9 text-body">We will be in contact soon.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back to yum!
          </Link>
          <Link href="/menu" className="btn-secondary">
            Browse Menu
          </Link>
        </div>
      </div>
    </main>
  );
}
