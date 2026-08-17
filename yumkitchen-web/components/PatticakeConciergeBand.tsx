import Image from 'next/image';
import Link from 'next/link';
import { patticakeProcessSteps } from './PatticakeProcessSteps';

export function PatticakeConciergeBand() {
  return (
    <section className="patticake-concierge bg-blue-tint px-6 py-12 lg:py-section" data-reveal>
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:items-center">
        <div>
          <p className="section-label text-ink">how it works</p>
          <h2 className="text-h2 lowercase">a cake that gets a real person behind it</h2>
          <p className="mt-5 max-w-xl text-xl leading-9 text-ink">
            Patticake should feel loved from the first order to the first slice. Choose the cake, tell us where it is headed, and yum! bakes it to the date.
          </p>
          {/* No CTA pair here: the hero above and the closing section below
              both carry Ship a Cake / Pick Up Locally. This band explains;
              the link hands off to the full process on /patticake. */}
          <Link href="/patticake" className="btn-link mt-8 inline-block">
            see the full process
          </Link>
        </div>

        <div className="concierge-editorial">
          <div className="concierge-photo-grid">
            {/* A hand-piped message cake under "a real person behind it".
                09_slices was here before, but it already leads the hero grid
                on this same page; the repeat added nothing. */}
            <div className="concierge-photo concierge-photo-main">
              <Image
                src="/images/patticake/slices_counter_team.jpg"
                alt="Patticake slices on the yum! counter with bakers in red caps working behind"
                fill
                sizes="(min-width: 1024px) 34vw, 78vw"
                className="object-cover crop-patticake-product"
              />
            </div>
            <div className="concierge-photo concierge-photo-gift">
              <Image
                src="/images/patticake/gift_box_tissue.jpg"
                alt="a baby-blue yum! gift box tied with red ribbon on red polka-dot tissue"
                fill
                sizes="(min-width: 1024px) 18vw, 42vw"
                className="object-cover crop-patticake-gift-box"
              />
            </div>
          </div>
          {/* Titles only, from the same canonical patticakeProcessSteps: the
              homepage teases the process; /patticake carries the full block
              with per-step copy. Rendering both in full meant the demo click
              path (home, then Ship a Cake) hit the identical four steps twice
              within seconds. Do not fork the wording here. */}
          <div className="grid gap-3 sm:grid-cols-2">
            {patticakeProcessSteps.map((step) => (
              <article key={step.number} className="concierge-note">
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
