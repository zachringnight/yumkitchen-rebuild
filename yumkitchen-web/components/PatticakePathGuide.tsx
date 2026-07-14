import { patticakeNationalOrderUrl } from '@/lib/site';

type PatticakePathGuideProps = {
  activePath?: 'pickup' | 'shipping';
};

const nationalOrderIsExternal = /^https?:\/\//.test(patticakeNationalOrderUrl);

const paths = [
  {
    key: 'pickup',
    label: 'Twin Cities pickup',
    title: 'pick up from a yum! restaurant',
    copy: 'Choose this when the Patticake is staying local and you know the pickup restaurant or date.',
    href: '/order-a-cake#cake-inquiry',
    action: 'Start a Pickup Note',
    facts: ['four yum! restaurants', '8am to 8pm daily', 'restaurant and date first'],
  },
  {
    key: 'shipping',
    label: 'long-distance gifting',
    title: 'send Patticake farther',
    copy: 'Choose this when the cake needs to travel. Order online with a delivery date and gift message, or start with a note.',
    href: patticakeNationalOrderUrl,
    action: 'Ship a Cake',
    facts: ['order online in a few taps', 'timing checked by yum!', 'packed to travel nationwide'],
  },
] as const;

export function PatticakePathGuide({ activePath }: PatticakePathGuideProps) {
  return (
    <section id="patticake-path-guide" className="scroll-mt-24 bg-cream px-6 py-10 md:scroll-mt-28" aria-labelledby="patticake-path-guide-title">
      <div className="mx-auto grid max-w-[1240px] gap-6 border-y border-brand-primary/25 py-7 lg:grid-cols-[0.52fr_1.48fr] lg:items-start">
        <div>
          <p className="section-label">which way should it go?</p>
          <h2 id="patticake-path-guide-title" className="font-serif text-[2.45rem] font-normal leading-tight lowercase text-ink">
            choose how the cake travels.
          </h2>
          <p className="mt-4 max-w-md text-lg leading-8 text-body">
            Choose by where the cake is headed. Either way, a real yum! baker helps with the sweet details.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {paths.map((path) => {
            const isActive = activePath === path.key;

            return (
              <article key={path.key} className={`grid border bg-white p-5 ${isActive ? 'border-brand-primary shadow-[0_12px_30px_rgb(180_33_43_/_0.13)]' : 'border-ink/15'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="font-sans text-xs font-bold uppercase leading-tight tracking-[0.14em] text-brand-primary">{path.label}</p>
                  {isActive ? <span className="bg-blue-tint px-3 py-1 text-sm font-bold leading-none text-ink">you are here</span> : null}
                </div>
                <h3 className="mt-4 font-serif text-3xl font-normal leading-tight lowercase text-ink">{path.title}</h3>
                <p className="mt-3 text-lg leading-8 text-body">{path.copy}</p>
                <a
                  href={path.href}
                  target={path.key === 'shipping' && nationalOrderIsExternal ? '_blank' : undefined}
                  rel={path.key === 'shipping' && nationalOrderIsExternal ? 'noopener noreferrer' : undefined}
                  className={`${isActive ? 'btn-primary' : 'btn-secondary'} mt-5 self-end md:order-last md:mt-6`}
                >
                  {path.action}
                </a>
                <ul className="mt-5 grid gap-2 text-base leading-6 text-ink">
                  {path.facts.map((fact) => (
                    <li key={fact} className="grid grid-cols-[0.75rem_1fr] gap-3">
                      <span className="mt-2 h-2 w-2 bg-brand-red" aria-hidden="true" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
