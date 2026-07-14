import Image from 'next/image';
import Link from 'next/link';
import { locations } from '@/lib/locations';
import { giftCardBalanceUrl, giftCardBuyUrl, socialLinks } from '@/lib/site';
import { EmailCapture } from './EmailCapture';
import { OpenStatus } from './OpenStatus';

const quickLinks = [
  { href: '/', label: 'patticake' },
  { href: '/patticake', label: 'Ship a Cake' },
  { href: '/order-a-cake', label: 'Pick Up Locally' },
  { href: '/yum-kitchen', label: 'yum! Kitchen and Bakery' },
  { href: '/about', label: 'about' },
  { href: '/menu', label: 'menu' },
  { href: giftCardBuyUrl, label: 'gift cards', external: true },
  { href: '/careers', label: 'work @ yum!' },
  { href: '/catering', label: 'catering' },
  { href: '/in-the-news', label: 'in the news' },
  { href: '/contact', label: 'contact' },
  { href: '/faq', label: 'faq' },
  { href: '/accessibility-statement', label: 'accessibility statement' },
  { href: giftCardBalanceUrl, label: 'gift card balance', external: true },
] as const;

const socialShort: Record<string, string> = {
  Facebook: 'f',
  Instagram: 'ig',
  'Twitter/X': 'x',
  LinkedIn: 'in',
};

function eventForHref(href: string) {
  if (href === giftCardBuyUrl) return 'click_gift_card_buy';
  if (href === giftCardBalanceUrl) return 'click_gift_card_balance';
  return undefined;
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#d8cfd1] bg-cream pb-24 md:pb-32">
      <EmailCapture />
      <div className="bg-blue-soft px-6 py-5">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-4">
          <span className="mr-2 text-base font-medium text-ink">Follow for more yum!</span>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="text-lg font-medium text-ink transition hover:text-brand-primary"
            >
              {socialShort[link.label]}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1240px] gap-8 px-6 py-10 md:grid-cols-2 lg:grid-cols-[1.1fr_repeat(4,1fr)]">
        <div>
          <Image src="/logo.png" alt="yum!" width={56} height={56} className="mb-4 h-14 w-14" />
          <h2 className="mb-3 font-sans text-sm font-medium uppercase tracking-[0.08em] text-body">Quick Links</h2>
          <div className="grid gap-1.5">
            {quickLinks.map((link) => {
              const external = 'external' in link && link.external;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  data-event={eventForHref(link.href)}
                  className="text-base leading-snug text-body transition hover:text-brand-primary"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {locations.map((loc) => (
          <div key={loc.slug}>
            <Link href={`/location/${loc.slug}`} className="mb-2 block text-base font-medium leading-snug text-ink transition hover:text-brand-primary">
              {loc.name}
            </Link>
            <p className="text-base leading-7 text-body">{loc.address.street}</p>
            <p className="text-base leading-7 text-body">
              {loc.address.city}, {loc.address.state} {loc.address.zip}
            </p>
            <a href={`tel:${loc.phone_e164}`} className="mt-1 block text-base leading-7 text-body transition hover:text-brand-primary">
              {loc.phone}
            </a>
            <OpenStatus compact className="mb-3 block text-sm text-body" />
            <a
              href={loc.order_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-red px-3 py-2 text-sm font-bold leading-none text-white transition hover:bg-brand-primary"
              data-event="click_order_online"
              data-location={loc.slug}
              data-source="site_footer"
            >
              Order {loc.short_name}
            </a>
          </div>
        ))}
      </div>

      <div className="border-t border-[#d8cfd1] px-6 py-3">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-2 text-sm text-body md:flex-row">
          <span>© yum! Kitchen and Bakery</span>
          <span className="uppercase tracking-[0.08em]">made from scratch since 2005</span>
        </div>
      </div>
    </footer>
  );
}
