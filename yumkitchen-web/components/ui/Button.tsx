import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'text';

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  text: 'btn-link',
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export function ButtonLink({ children, variant = 'primary', className = '', href, ...props }: ButtonAsLink) {
  const classes = `${variantClass[variant]} ${className}`.trim();
  const isExternal = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:');

  if (isExternal) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} prefetch={false} {...props}>
      {children}
    </Link>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonAsButton) {
  return (
    <button className={`${variantClass[variant]} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
