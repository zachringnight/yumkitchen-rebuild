import Image from 'next/image';
import Link from 'next/link';

type Feature = {
  title: string;
  description: string;
  href: string;
  image: string;
};

export function FoodFeatureGrid({ features }: { features: readonly Feature[] }) {
  return (
    <section className="bg-white py-section" data-reveal>
      <div className="container-content">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_2fr]">
          <div>
            <p className="section-label">fresh favorites</p>
            <h2 className="text-h2 lowercase">made for real life</h2>
            <div className="brand-rule my-5" />
            <p>From cozy breakfasts to crave-worthy lunches and dinners, our menu is made fresh every day.</p>
            <Link href="/menu" className="btn-link mt-5 inline-block">
              View Full Menu
            </Link>
          </div>
          <div className="stagger-reveal grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href} className="accent-card group block bg-white">
                <div className="relative aspect-4/3 overflow-hidden bg-page">
                  <Image src={feature.image} alt="" fill sizes="(min-width: 1024px) 20vw, 50vw" className="image-lift object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-xl lowercase">{feature.title}</h3>
                  <p className="text-base leading-7">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SplitFeatureBand() {
  return (
    <section className="grid bg-blue-tint/70 lg:grid-cols-3" data-reveal>
      <div className="relative min-h-[360px] lg:col-span-1">
        <Image src="/images/yum-catering-platter-steak.jpg" alt="yum! catering platters" fill sizes="33vw" className="object-cover" />
      </div>
      <div className="flex min-h-[360px] items-center p-8 md:p-12">
        <div>
          <p className="section-label">for any occasion</p>
          <h2 className="text-h2 lowercase">catering that brings people together</h2>
          <p className="mt-4">From office lunches to family gatherings, we handle the delicious parts.</p>
          <Link href="/catering" className="btn-link mt-5 inline-block">
            Order Catering
          </Link>
        </div>
      </div>
      <div className="grid min-h-[360px] sm:grid-cols-2 lg:grid-cols-1">
        <div className="relative min-h-[240px]">
          <Image src="/images/yum-bakery-key-lime-pie.jpg" alt="yum! bakery dessert" fill sizes="33vw" className="object-cover" />
        </div>
        <div className="flex items-center bg-blue-soft/70 p-8">
          <div>
            <p className="section-label">life is sweeter</p>
            <h2 className="text-h3 lowercase">cakes worth celebrating</h2>
            <p className="mt-3 text-base leading-7">Custom cakes for birthdays, weddings, and everything between.</p>
            <Link href="/order-a-cake" className="btn-link mt-4 inline-block">
              Order a Cake
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
