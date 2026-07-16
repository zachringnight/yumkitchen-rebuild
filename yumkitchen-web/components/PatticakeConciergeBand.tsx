import Image from 'next/image';
import Link from 'next/link';
import { patticakeNationalOrderUrl } from '@/lib/site';

const nationalOrderIsExternal = /^https?:\/\//.test(patticakeNationalOrderUrl);

const conciergeNotes = [
  {
    title: 'find the sweetest route',
    copy: 'Pickup nearby or shipping farther away, yum! helps the cake travel well.',
  },
  {
    title: 'shape the message',
    copy: 'A birthday, thank-you, wedding, or just-because note can all feel personal on top.',
  },
  {
    title: 'add the love note',
    copy: 'Timing, weather, gift notes, and serving plans get a little human care.',
  },
] as const;

export function PatticakeConciergeBand() {
  return (
    <section className="patticake-concierge bg-blue-tint px-6 py-12 lg:py-section" data-reveal>
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:items-center">
        <div>
          <p className="section-label text-ink">bakery care</p>
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
                src="/images/patticake/gift_box_vertical.jpg"
                alt="yum! bakery gift box with red ribbon"
                fill
                sizes="(min-width: 1024px) 18vw, 42vw"
                className="object-cover crop-patticake-gift-box"
              />
            </div>
          </div>
          <div className="concierge-note-stack">
            {conciergeNotes.map((note, index) => (
              <article key={note.title} className={`concierge-note concierge-note-${index + 1}`}>
                <span>{index + 1}</span>
                <div>
                  <h3>{note.title}</h3>
                  <p>{note.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
