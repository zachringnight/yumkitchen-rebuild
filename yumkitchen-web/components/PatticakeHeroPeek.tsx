import Image from 'next/image';

type PatticakeHeroPeekProps = {
  src: string;
  alt: string;
  className?: string;
  unoptimized?: boolean;
};

export function PatticakeHeroPeek({ src, alt, className = '', unoptimized = false }: PatticakeHeroPeekProps) {
  return (
    <div className="patticake-hero-peek lg:hidden">
      <div className="patticake-hero-peek-image">
        <Image
          src={src}
          alt={alt}
          fill
          preload
          loading="eager"
          fetchPriority="high"
          quality={70}
          unoptimized={unoptimized}
          sizes="(max-width: 767px) calc(100vw - 3rem), 100vw"
          className={`object-cover ${className}`}
        />
      </div>
    </div>
  );
}
