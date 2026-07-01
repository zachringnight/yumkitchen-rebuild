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

export default function AccessibilityPage() {
  return (
    <main>
      <section className="bg-cream py-section">
        <div className="container-content">
          <h1 className="text-display lowercase">our accessibility statement</h1>
          <p className="mt-5 max-w-3xl text-xl leading-9">
            yum! Kitchen and Bakery wants every guest to feel welcome here. Please contact our team with feedback or questions about accessibility.
          </p>
        </div>
      </section>
      <section className="bg-white py-section">
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
