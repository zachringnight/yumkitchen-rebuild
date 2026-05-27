import Image from 'next/image';
import Link from 'next/link';
import { photoMotionMoments } from '@/lib/site';

function MotionPhotoCard({
  moment,
  duplicate = false,
}: {
  moment: (typeof photoMotionMoments)[number];
  duplicate?: boolean;
}) {
  return (
    <article className="photo-motion-card" aria-hidden={duplicate ? true : undefined}>
      <div className="relative aspect-4/5 overflow-hidden bg-page">
        <Image
          src={moment.image}
          alt={duplicate ? '' : moment.title}
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
  const topRow = photoMotionMoments.slice(0, 4);
  const bottomRow = photoMotionMoments.slice(4);

  return (
    <section className="photo-motion-section bg-page py-section" data-reveal>
      <div className="container-content">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="section-label">real yum! energy</p>
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
            <div className="photo-motion-spine" aria-hidden="true">
              <span>yum!</span>
              <span>made fresh</span>
            </div>
            {photoMotionMoments.slice(0, 4).map((moment, index) => (
              <div key={moment.title} className={`photo-motion-layer photo-motion-layer-${index + 1}`}>
                <Image src={moment.image} alt={moment.title} fill sizes="(min-width: 1024px) 28vw, 80vw" className="object-cover" />
                <span>{moment.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="photo-motion-reels" aria-label="More real Yum moments">
          <div className="photo-motion-track photo-motion-track-left">
            <div className="photo-motion-set">
              {topRow.map((moment) => (
                <MotionPhotoCard key={moment.title} moment={moment} />
              ))}
            </div>
            <div className="photo-motion-set" aria-hidden="true">
              {topRow.map((moment) => (
                <MotionPhotoCard key={`top-${moment.title}`} moment={moment} duplicate />
              ))}
            </div>
          </div>
          <div className="photo-motion-track photo-motion-track-right">
            <div className="photo-motion-set">
              {bottomRow.map((moment) => (
                <MotionPhotoCard key={moment.title} moment={moment} />
              ))}
            </div>
            <div className="photo-motion-set" aria-hidden="true">
              {bottomRow.map((moment) => (
                <MotionPhotoCard key={`bottom-${moment.title}`} moment={moment} duplicate />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
