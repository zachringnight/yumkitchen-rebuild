import Image from 'next/image';
import Link from 'next/link';

type PhotoMoment = {
  title: string;
  detail: string;
  image: string;
  alt: string;
  position?: string;
};

// Moments are curated locally so no photo in this section repeats the hero
// carousel, the featured-dish selector, the seasonal grid, or the catering
// callout, and so the reels below never repeat the collage above them.
const collageMoments: readonly PhotoMoment[] = [
  {
    title: 'morning regulars',
    detail: 'breakfast, coffee, and counter energy',
    image: '/images/yum-cold-brew.jpg',
    alt: 'A steaming glass of coffee on a sunny yum! counter',
    position: 'object-[50%_72%]',
  },
  {
    title: 'picnic pickup',
    detail: 'boxed lunches ready for the day',
    image: '/images/yum-catering-boxed-lunch.jpg',
    alt: 'A yum! boxed lunch with a sandwich, chips, fruit, and a chocolate chip cookie',
  },
  {
    title: 'pie for later',
    detail: 'streusel-topped fruit pie by the slice',
    image: '/images/yum-bakery-pie.jpeg',
    alt: 'A slice of streusel-topped fruit pie on a plate',
  },
  {
    title: 'lunch to go',
    detail: 'pressed sandwiches, packed to travel',
    image: '/images/yum-catering-sandwiches-live.jpg',
    alt: 'A pressed veggie sandwich beside a light blue yum! take-home box',
    position: 'object-[50%_62%]',
  },
];

const reelTopMoments: readonly PhotoMoment[] = [
  {
    title: 'team pride',
    detail: 'the people behind the plate',
    image: '/images/yum-chef-kitchen.jpg',
    alt: 'A smiling yum! chef in the kitchen',
  },
  {
    title: 'lunch rush',
    detail: 'tables full of regulars',
    image: '/images/yum-dining-room.jpg',
    alt: 'Guests laughing at their tables in the yum! dining room',
  },
  {
    title: 'cupcake break',
    detail: 'a chocolate cupcake, properly enjoyed',
    image: '/images/yum-hero-0131.jpg',
    alt: 'A kid taking a big bite of a chocolate cupcake with white frosting',
  },
  {
    title: 'packed with care',
    detail: 'boxes and bags ready to head home',
    image: '/images/yum-packaging-counter.jpg',
    alt: 'Light blue yum! boxes and bags wrapped with ribbon on the counter',
  },
];

const reelBottomMoments: readonly PhotoMoment[] = [
  {
    title: 'platter day',
    detail: 'steak sandwiches, platter-style',
    image: '/images/yum-catering-platter-steak.jpg',
    alt: 'Sliced steak sandwiches arranged on a catering platter',
  },
  {
    title: 'family table',
    detail: 'the littlest regulars',
    image: '/images/yum-hero-2375.jpg',
    alt: 'A woman snuggling a toddler at the table',
  },
  {
    title: 'lake day',
    detail: 'boxed lunches and takeout made by yum!',
    image: '/images/yum-catering-egg-salad.jpg',
    alt: 'Scoops of egg salad over greens with bread and a yum! takeout bag',
  },
  {
    title: 'bakery bars',
    detail: 'frosted bars from the scratch bakery',
    image: '/images/yum-bakery-bars.jpeg',
    alt: 'Frosted bakery bars in paper wrappers',
  },
];

function MotionPhotoCard({
  moment,
  duplicate = false,
}: {
  moment: PhotoMoment;
  duplicate?: boolean;
}) {
  return (
    <article className="photo-motion-card" aria-hidden={duplicate ? true : undefined}>
      <div className="relative aspect-4/5 overflow-hidden bg-cream">
        <Image
          src={moment.image}
          alt={duplicate ? '' : moment.alt}
          fill
          sizes="(min-width: 1024px) 220px, 46vw"
          className="object-cover"
        />
      </div>
      <div className="photo-motion-caption">
        <h3>{moment.title}</h3>
        <p>{moment.detail}</p>
      </div>
    </article>
  );
}

export function PhotoMotionStory() {
  return (
    <section className="photo-motion-section bg-cream py-section" data-reveal>
      <div className="container-content">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="section-label">real yum! moments</p>
            <h2 className="text-h2 lowercase">breakfast, bakery, lunch, dinner, and take-home comfort</h2>
            <p className="mt-5 max-w-xl text-xl leading-9">
              From the first cup of coffee to the box that heads home for dinner, every location is built around real food, familiar faces, and a bakery case worth checking twice.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/menu" className="btn-primary">
                Explore Menu
              </Link>
              <Link href="/in-the-news" className="btn-secondary">
                See Press
              </Link>
            </div>
          </div>

          <div className="photo-motion-collage" aria-label="Yum food and bakery photo montage">
            {collageMoments.map((moment, index) => (
              <figure key={moment.title} className={`photo-motion-layer photo-motion-layer-${index + 1}`}>
                <div className="photo-motion-image">
                  <Image
                    src={moment.image}
                    alt={moment.alt}
                    fill
                    sizes="(min-width: 1024px) 28vw, 80vw"
                    className={moment.position ? `object-cover ${moment.position}` : 'object-cover'}
                  />
                </div>
                <figcaption>{moment.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="photo-motion-reels" aria-label="More real Yum moments">
          <div className="photo-motion-track photo-motion-track-left">
            <div className="photo-motion-set">
              {reelTopMoments.map((moment) => (
                <MotionPhotoCard key={moment.title} moment={moment} />
              ))}
            </div>
            <div className="photo-motion-set" aria-hidden="true">
              {reelTopMoments.map((moment) => (
                <MotionPhotoCard key={`top-${moment.title}`} moment={moment} duplicate />
              ))}
            </div>
          </div>
          <div className="photo-motion-track photo-motion-track-right">
            <div className="photo-motion-set">
              {reelBottomMoments.map((moment) => (
                <MotionPhotoCard key={moment.title} moment={moment} />
              ))}
            </div>
            <div className="photo-motion-set" aria-hidden="true">
              {reelBottomMoments.map((moment) => (
                <MotionPhotoCard key={`bottom-${moment.title}`} moment={moment} duplicate />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
