import { AnimatedCounter } from './AnimatedCounter';

const stats = [
  { value: 4, label: 'neighborhood kitchens', suffix: '' },
  { value: 82, label: 'menu favorites', suffix: '+' },
  { value: 8, label: 'open daily until', suffix: 'pm' },
];

export function ExperienceStats() {
  return (
    <section className="bg-ink py-10 text-cream" data-reveal>
      <div className="container-content grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div>
          <p className="section-label text-blue-soft">all day comfort</p>
          <h2 className="text-h3 lowercase text-cream">built for regulars, families, teams, and last-minute cravings</h2>
        </div>
        <div className="stagger-reveal grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="accent-card bg-white/8 p-5">
              <div className="font-serif text-[3rem] leading-none text-white">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-cream">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
