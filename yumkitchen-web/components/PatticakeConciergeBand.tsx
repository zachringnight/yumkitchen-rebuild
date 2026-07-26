import Image from 'next/image';
import Link from 'next/link';
import { patticakeNationalOrderUrl } from '@/lib/site';
import { patticakeProcessSteps } from './PatticakeProcessSteps';

const nationalOrderIsExternal = /^https?:\/\//.test(patticakeNationalOrderUrl);

export function PatticakeConciergeBand() {
  return (
    <section className="patticake-concierge bg-blue-tint px-6 py-12 lg:py-section" data-reveal>
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:items-center">
        <div>
          <p className="section-label text-ink">how it works</p>
          <h2 className="text-h2 lowercase">a cake that gets a real person behind it</h2>
          <p className="mt-5 max-w-xl text-xl leading-9 text-ink">
            Patticake should feel loved from the first note to the first slice. Tell us where it is headed, then we help make the next step easy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {nationalOrderIsExternal ? (
              <a href={patticakeNationalOrderUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Ship a Cake
              </a>
            ) : (
              <Link href={patticakeNationalOrderUrl} className="btn-primary">
                Ship a Cake
              </Link>
            )}
            <Link href="/order-a-cake#cake-inquiry" className="btn-secondary">
              Pick Up Locally
            </Link>
          </div>
        </div>

        <div className="concierge-editorial">
          <div className="concierge-photo-grid">
            <div className="concierge-photo concierge-photo-main">
              <Image
                src="/images/patticake/09_slices.jpg"
                alt="Patticake slices on plates"
                fill
                sizes="(min-width: 1024px) 34vw, 78vw"
                className="object-cover crop-patticake-slices"
              />
            </div>
            <div className="concierge-photo concierge-photo-gift">
              <Image
                src="/images/patticake/slices_plates_vertical.jpg"
                alt="yum! patticake slices on plates"
                fill
                sizes="(min-width: 1024px) 18vw, 42vw"
                className="object-cover crop-patticake-vertical-slices"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {patticakeProcessSteps.map((step) => (
              <article key={step.number} className="concierge-note">
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
