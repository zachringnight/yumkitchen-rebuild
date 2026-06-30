import Image from 'next/image';
import Link from 'next/link';
import { menuItemCount } from '@/lib/menu';
import { orderDemoItems } from '@/lib/site';

export function MenuMotionIntro() {
  const featured = orderDemoItems.slice(0, 4);
  const fastPaths = [
    { href: '/menu#sandwiches', label: 'sandwiches' },
    { href: '/menu#salads', label: 'salads' },
    { href: '/menu#entrees', label: 'dinner' },
    { href: '/menu#bakery', label: 'bakery' },
  ] as const;

  return (
    <section className="menu-motion-intro bg-white py-section">
      <div className="container-content grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
        <div>
          <p className="section-label">browse with appetite</p>
          <h2 className="text-h2 lowercase">see what sounds good, then make it yours</h2>
          <p className="mt-5 max-w-2xl text-xl leading-9">
            Search the menu, jump to sandwiches, salads, dinner, or bakery, and start with the favorites guests already come back for.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/order" className="btn-primary">
              Start Order
            </Link>
            <a href="/pdfs/takeout-menu.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Printable Menu
            </a>
          </div>
          <nav className="menu-fast-paths" aria-label="Popular menu paths">
            {fastPaths.map((path) => (
              <Link key={path.label} href={path.href}>
                {path.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="menu-orbit motion-role-ambient" aria-label="Featured Yum menu photography">
          <div className="menu-orbit-core">
            <span>{menuItemCount}</span>
            <span>menu favorites</span>
          </div>
          {featured.map((item, index) => (
            <article key={item.name} className={`menu-orbit-card menu-orbit-card-${index + 1}`}>
              <div className="relative aspect-4/3 overflow-hidden">
                <Image src={item.image} alt={item.name} fill sizes="(min-width: 1024px) 220px, 50vw" className="object-cover" />
              </div>
              <p>{item.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
