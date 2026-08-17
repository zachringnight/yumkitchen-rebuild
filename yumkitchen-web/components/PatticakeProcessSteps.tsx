import { Stagger, StaggerItem } from './motion/Stagger';

// The single canonical Patticake how-it-works framework. Every Patticake
// surface that explains the send-a-cake process renders these same four
// steps with this same wording. Do not add page-local step lists.
export const patticakeProcessSteps = [
  {
    number: '1',
    title: 'choose your cake',
    copy: 'Pick a whole cake or slices, and tell us the occasion.',
  },
  {
    number: '2',
    title: 'choose how it travels',
    copy: 'Ship it nationwide with a delivery date, or pick it up at a yum! restaurant.',
  },
  {
    number: '3',
    title: 'add the words',
    copy: 'Add the words on the cake and a gift note at checkout.',
  },
  {
    number: '4',
    title: 'we bake it fresh',
    copy: 'Patticake is baked close to your date, packed with care, and ready to share.',
  },
] as const;

type PatticakeProcessStepsProps = {
  tone?: 'cream' | 'white';
};

export function PatticakeProcessSteps({ tone = 'cream' }: PatticakeProcessStepsProps) {
  return (
    <section className={`${tone === 'cream' ? 'bg-cream' : 'bg-white'} px-6 py-8`}>
      <div className="mx-auto max-w-[1240px]">
        <Stagger className="patticake-process-panel" gap={0.12}>
          <StaggerItem className="patticake-process-eyebrow">
            <p>how it works</p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="font-serif text-[2.7rem] font-normal leading-tight lowercase text-brand-primary">from message to table, clearly.</h2>
            <p className="mt-4 max-w-[560px] text-lg leading-8 text-ink">
              Pick the cake, choose the route, and add the words. We take it from there.
            </p>
          </StaggerItem>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {patticakeProcessSteps.map((step) => (
              <StaggerItem as="article" key={step.number} className="border-t border-ink/15 pt-4">
                <p className="font-serif text-3xl leading-none text-brand-primary">{step.number}</p>
                <h3 className="mt-3 font-serif text-2xl font-normal lowercase text-ink">{step.title}</h3>
                <p className="mt-2 text-base leading-7 text-body">{step.copy}</p>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </div>
    </section>
  );
}
