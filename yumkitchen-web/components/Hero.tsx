import Image from 'next/image';
import type { ReactNode } from 'react';

type Props = {
  title: ReactNode;
  copy: string;
  image: string;
  imageAlt: string;
  children?: ReactNode;
  priority?: boolean;
  align?: 'left' | 'center';
};

export function Hero({ title, copy, image, imageAlt, children, priority = false, align = 'left' }: Props) {
  return (
    <section className="relative min-h-[620px] overflow-hidden bg-cream text-ink">
      <Image
        src={image}
        alt={imageAlt}
        fill
        preload={priority}
        loading={priority ? 'eager' : undefined}
        fetchPriority={priority ? 'high' : undefined}
        sizes="100vw"
        className="hero-motion-image motion-image object-cover"
      />
      <div className={`container-content relative z-10 flex min-h-[620px] items-center ${align === 'center' ? 'justify-center' : ''}`}>
        <div className={`hero-panel motion-role-entrance my-16 max-w-[560px] bg-cream/90 px-8 py-8 md:px-10 ${align === 'center' ? 'text-center' : ''}`}>
          <h1 className="font-serif text-[2.45rem] font-normal leading-[1.1] lowercase text-ink md:text-[2.75rem]">{title}</h1>
          <div className={`my-5 h-px bg-ink/20 ${align === 'center' ? 'mx-auto' : ''}`} />
          <p className="max-w-xl text-lg leading-8 text-body">{copy}</p>
          {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}
