import Image from 'next/image';

// Photos carry no visible caption. Alt text describes what is actually in the
// frame; anything beyond that would be a food claim yumkitchen.com does not make.
const galleryImages: { src: string; alt: string }[] = [
  { src: '/images/patticake/08_tier_wedding_d.jpg', alt: 'Tiered yum! wedding cake with pink roses' },
  { src: '/images/yum-patticake-top.jpg', alt: 'yum! buttercream cake, top view' },
  { src: '/images/yum-patticake-layers.jpg', alt: 'yum! chocolate layer cake, cut open on a cake stand' },
  { src: '/images/patticake/04_tier_wedding_b.jpg', alt: 'yum! cake decorated with pressed flowers' },
  { src: '/images/patticake/gift_box_vertical.jpg', alt: 'yum! bakery gift box with red ribbon' },
  { src: '/images/yum-patticake-floral-tier.jpg', alt: 'Tiered yum! cake with bright fresh flowers' },
  { src: '/images/patticake/10_layers_slice.jpg', alt: 'Patticake chocolate layers, close up' },
  { src: '/images/patticake/09_slices.jpg', alt: 'yum! patticake slices on plates' },
];

export function CakeGallery() {
  return (
    <section className="bg-white px-6 py-12 lg:py-section" data-reveal>
      <div className="mx-auto max-w-[1240px]">
        <p className="section-label">the cake gallery</p>
        <h2 className="text-h2 lowercase">cakes for every kind of day</h2>
        <p className="mt-4 max-w-2xl text-xl leading-9 text-body">
          From tiered wedding cakes to an 8-inch Patticake for the office, made from scratch for the moments worth celebrating.
        </p>
        <div className="stagger-reveal mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {galleryImages.map((img) => (
            <div
              key={img.src}
              className="group overflow-hidden border border-ink/10 bg-white"
            >
              <div className="relative aspect-square overflow-hidden bg-blue-soft">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
