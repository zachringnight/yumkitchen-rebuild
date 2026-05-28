import Image from 'next/image';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: pageMeta.cake.title,
  description: pageMeta.cake.description,
  alternates: { canonical: '/order-a-cake' },
  openGraph: { images: [pageMeta.cake.image] },
};

const patticakeProducts = [
  {
    name: 'classic patticake',
    description: "Devil's food chocolate cake layered with vanilla buttercream, sliced from the real yum! bakery case.",
    image: '/images/yum-patticake-layers.jpg',
    alt: 'yum! patticake chocolate cake layers',
  },
  {
    name: 'giftable patticake',
    description: 'The same original chocolate cake, ready for birthdays, thank-yous, office treats, and care packages.',
    image: '/images/yum-patticake-top.jpg',
    alt: 'yum! patticake top with vanilla buttercream',
  },
  {
    name: 'celebration patticake',
    description: "Patti's recipe, finished by the yum! bakery team for pickup or delivery questions.",
    image: '/images/yum-patticake-tier.jpg',
    alt: 'yum! tiered wedding patticake',
  },
] as const;

const deliverySteps = [
  {
    number: '01',
    title: 'pick a cake',
    description: 'Choose the patticake direction and the message you want piped on top.',
  },
  {
    number: '02',
    title: 'share the details',
    description: 'Tell the bakery team the date, pickup location, size, and celebration notes.',
  },
  {
    number: '03',
    title: 'we bake it fresh',
    description: 'The cake is finished by the yum! bakery team before it is packed.',
  },
  {
    number: '04',
    title: 'send some love',
    description: 'A chocolate cake arrives ready for a birthday, thank-you, wedding, team, or family table.',
  },
] as const;

const weddingPhotos = [
  {
    src: '/images/yum-patticake-floral-tier.jpg',
    alt: 'yum! floral wedding patticake',
  },
  {
    src: '/images/yum-patticake-top.jpg',
    alt: 'yum! patticake top with vanilla buttercream',
  },
  {
    src: '/images/yum-patticake-tier.jpg',
    alt: 'yum! tiered wedding patticake',
  },
] as const;

const gallery = [
  { src: '/images/yum-patticake-layers.jpg', alt: 'yum! patticake chocolate cake layers' },
  { src: '/images/yum-patticake-top.jpg', alt: 'yum! patticake top with vanilla buttercream' },
  { src: '/images/yum-patticake-tier.jpg', alt: 'yum! tiered wedding patticake' },
  { src: '/images/yum-patticake-floral-tier.jpg', alt: 'yum! floral wedding patticake' },
] as const;

export default function CakePage() {
  return (
    <main className="bg-cream">
      <section className="relative overflow-hidden px-6 pb-[90px] pt-[calc(72px+80px)]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-brand-primary">
              since 2005 · made from scratch
            </p>
            <h1 className="font-serif text-[3.8rem] font-normal leading-[0.98] lowercase text-ink md:text-[5.2rem]">
              the original
              <br />
              <span className="italic text-brand-primary">patticake</span>
            </h1>
            <p className="mt-7 max-w-[500px] text-xl leading-8 text-body">
              One chocolate cake. Devil&apos;s food layered with vanilla buttercream. Patti&apos;s recipe, baked fresh for birthdays, thank-yous, weddings, and gatherings.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#shop-patticake" className="btn-primary">
                Order a patticake
              </a>
              <a href="/patticake-national-delivery" className="btn-secondary">
                National delivery
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-blue-soft">
            <Image
              src="/images/yum-patticake-layers.jpg"
              alt="yum! patticake chocolate cake layers"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
            <div className="absolute left-6 top-6 bg-brand-red px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white">
              award winning
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-red px-6 py-[72px] text-white">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <h2 className="font-serif text-[2.75rem] font-normal leading-tight lowercase text-white">born at yum! kitchen. ready for your table.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white">
              Patticake belongs to the yum! bakery story: familiar, generous, and made for the moments when people gather around a table.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <Stat value="1" label="signature chocolate cake" />
            <Stat value="4" label="yum! kitchens behind it" />
            <Stat value="24h+" label="notice recommended" />
            <Stat value="new" label="national delivery order path" />
          </div>
        </div>
      </section>

      <section id="shop-patticake" className="bg-page px-6 py-section">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid items-end gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="section-label">shop patticake</p>
              <h2 className="text-h2 lowercase">one cake, a few ways to send it</h2>
            </div>
            <p className="max-w-2xl text-xl leading-9">
              Choose the Patticake path that fits the moment: local pickup, a celebration table, or delivery questions for someone farther away.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {patticakeProducts.map((product) => (
              <article key={product.name} className="border border-body bg-white">
                <div className="relative aspect-[4/5] overflow-hidden bg-blue-soft">
                  <Image src={product.image} alt={product.alt} fill loading="eager" sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl font-normal lowercase text-ink">{product.name}</h3>
                  <p className="mt-3 text-lg leading-8">{product.description}</p>
                  <a href="#delivery" className="btn-primary mt-6">
                    build yours
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="delivery" className="bg-blue-soft px-6 py-section">
        <div className="mx-auto max-w-[1200px] text-center">
          <p className="mb-3 font-sans text-sm font-bold uppercase tracking-[0.12em] text-ink">how it works</p>
          <h2 className="text-h2 lowercase">from oven to celebration, clearly.</h2>
          <div className="mt-12 grid gap-5 text-left md:grid-cols-4">
            {deliverySteps.map((step) => (
              <article key={step.number} className="border border-[#e0d8d9] bg-white p-6">
                <p className="mb-4 font-serif text-sm tracking-[0.08em] text-brand-primary">{step.number}</p>
                <h3 className="font-serif text-2xl font-normal lowercase text-ink">{step.title}</h3>
                <p className="mt-3 text-base leading-7">{step.description}</p>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-10 max-w-3xl border border-brand-primary/20 bg-white p-7 text-left md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h3 className="font-serif text-3xl font-normal lowercase text-ink">sending Patticake outside town?</h3>
              <p className="mt-3 text-lg leading-8 text-body">
                Use the dedicated Patticake national delivery page when you want to send the cake outside the Twin Cities.
              </p>
            </div>
            <a href="/patticake-national-delivery" className="btn-primary mt-5 shrink-0 md:mt-0">
              Order Delivery
            </a>
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 py-section">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="section-label">for the big day</p>
            <h2 className="font-serif text-[2.875rem] font-normal leading-tight lowercase text-ink">
              bakery <span className="italic text-brand-primary">celebrations</span>
              <br />
              for your table.
            </h2>
            <p className="mt-5 text-xl leading-9">
              Wedding tables, milestone parties, and family celebrations can all start with the original chocolate cake Patti made famous.
            </p>
            <a href="#shop-patticake" className="btn-primary mt-8">
              plan a cake
            </a>
          </div>
          <div className="grid grid-cols-[1.25fr_1fr] gap-4">
            <div className="relative row-span-2 aspect-[3/4] overflow-hidden">
              <Image src={weddingPhotos[0].src} alt={weddingPhotos[0].alt} fill loading="eager" sizes="(min-width: 1024px) 32vw, 58vw" className="object-cover" />
            </div>
            {weddingPhotos.slice(1).map((photo, index) => (
              <div key={`${photo.alt}-${index}`} className="relative aspect-[4/3] overflow-hidden">
                <Image src={photo.src} alt={photo.alt} fill loading="eager" sizes="(min-width: 1024px) 22vw, 42vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-section">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-9 max-w-2xl">
            <p className="section-label">patticake gallery</p>
            <h2 className="text-h2 lowercase">every photo is patticake</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {gallery.map((image, index) => (
              <div key={`${image.alt}-${index}`} className="relative aspect-square overflow-hidden bg-page">
                <Image src={image.src} alt={image.alt} fill loading="eager" sizes="(min-width: 768px) 25vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-red px-6 py-section text-center">
        <div className="mx-auto max-w-[680px]">
          <h2 className="font-serif text-[3.25rem] font-normal leading-tight lowercase text-white">send some love.</h2>
          <p className="mx-auto mt-5 max-w-lg text-xl leading-9 text-white">
            Start with Patticake for pickup, delivery questions, birthdays, weddings, and every table that needs the original.
          </p>
          <a href="#shop-patticake" className="mt-8 inline-block bg-white px-8 py-4 text-lg font-bold leading-none text-brand-primary transition hover:bg-blue-tint hover:text-ink">
            order now
          </a>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-[3rem] leading-none text-white">{value}</div>
      <div className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-white">{label}</div>
    </div>
  );
}
