import Image from 'next/image';

type AnimatedYumLogoProps = {
  className?: string;
  decorative?: boolean;
  label?: string;
  priority?: boolean;
  runId?: number;
};

export function AnimatedYumLogo({
  className = '',
  decorative = false,
  label = 'yum! Kitchen and Bakery logo',
  priority = false,
  runId,
}: AnimatedYumLogoProps) {
  return (
    <div
      className={`logo-animation-mark ${className}`}
      data-animation-run={runId}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
    >
      <span className="logo-animation-halo" aria-hidden="true" />
      <span className="logo-animation-ring" aria-hidden="true" />
      <Image
        src="/favicon.png"
        alt=""
        width={270}
        height={270}
        priority={priority}
        className="logo-animation-logo"
      />
      <span className="logo-animation-shine" aria-hidden="true" />
      <span className="logo-animation-spark logo-animation-spark-1" aria-hidden="true" />
      <span className="logo-animation-spark logo-animation-spark-2" aria-hidden="true" />
      <span className="logo-animation-spark logo-animation-spark-3" aria-hidden="true" />
    </div>
  );
}
