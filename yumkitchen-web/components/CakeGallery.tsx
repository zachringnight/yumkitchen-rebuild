import Image from 'next/image';

const galleryImages: { src: string; alt: string; caption: string; span?: boolean }[] = [
  { src: '/images/patticake/02_tier_wedding_a.jpg', alt: 'Tiered yum! wedding cake', caption: 'weddings', span: true },
  { src: '/images/patticake/03_top_view.jpg', alt: 'Patticake with vanilla buttercream, top view', caption: 'birthdays' },
  { src: '/images/patticake/06_8inch_a.jpg', alt: 'yum! 8-inch celebration cake', caption: 'celebrations' },
  { src: '/images/patticake/04_tier_wedding_b.jpg', alt: 'Tiered celebration cake', caption: 'showers' },
  { src: '/images/patticake/gift_box_vertical.jpg', alt: 'yum! bakery gift box with red ribbon', caption: 'gifting' },
  { src: '/images/patticake/05_tier_wedding_c.jpg', alt: 'White-frosted tiered cake', caption: 'anniversaries' },
  { src: '/images/patticake/10_layers_slice.jpg', alt: 'Patticake chocolate layers, close up', caption: 'office parties', span: true },
  { src: '/images/patticake/07_8inch_b.jpg', alt: 'yum! buttercream celebration cake', caption: 'just because' },
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
            <figure
              key={img.src}
              className="group relative aspect-square overflow-hidden border border-ink/10 bg-blue-soft"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/70 to-transparent px-4 pb-3 pt-8 font-serif text-xl lowercase text-white">
                {img.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
