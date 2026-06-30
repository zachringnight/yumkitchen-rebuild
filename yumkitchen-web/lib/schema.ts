import { locations, organizationJsonLd } from './locations';
import { absoluteSiteUrl, pageMeta, socialLinks } from './site';

const organizationId = absoluteSiteUrl('/#organization');

const publisher = {
  '@id': organizationId,
};

function pageBase(path: string, type: string, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': absoluteSiteUrl(`${path}#webpage`),
    url: absoluteSiteUrl(path),
    name,
    description,
    isPartOf: { '@id': absoluteSiteUrl('/#website') },
    publisher,
  };
}

export function aboutPageJsonLd() {
  return [
    organizationJsonLd(),
    {
      ...pageBase('/about', 'AboutPage', pageMeta.about.title, pageMeta.about.description),
      about: publisher,
    },
  ];
}

export function contactPageJsonLd() {
  return {
    ...pageBase('/contact', 'ContactPage', pageMeta.contact.title, pageMeta.contact.description),
    mainEntity: {
      '@type': 'Organization',
      '@id': organizationId,
      name: 'yum! Kitchen and Bakery',
      url: absoluteSiteUrl('/'),
      email: 'info@yumkitchen.com',
      sameAs: socialLinks.map((link) => link.href),
      contactPoint: locations.map((loc) => ({
        '@type': 'ContactPoint',
        telephone: loc.phone,
        contactType: 'customer service',
        areaServed: loc.short_name,
        availableLanguage: 'English',
      })),
    },
  };
}

export function cateringServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': absoluteSiteUrl('/catering#service'),
    name: 'yum! catering',
    serviceType: 'Catering',
    description: pageMeta.catering.description,
    url: absoluteSiteUrl('/catering'),
    provider: publisher,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Twin Cities, Minnesota',
    },
    availableChannel: locations.map((loc) => ({
      '@type': 'ServiceChannel',
      name: `${loc.short_name} pickup`,
      serviceLocation: {
        '@type': 'Restaurant',
        '@id': absoluteSiteUrl(`/location/${loc.slug}`),
        name: `yum! Kitchen and Bakery - ${loc.short_name}`,
        telephone: loc.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: loc.address.street,
          addressLocality: loc.address.city,
          addressRegion: loc.address.state,
          postalCode: loc.address.zip,
          addressCountry: loc.address.country,
        },
      },
    })),
    offers: {
      '@type': 'Offer',
      name: 'Catering pickup',
      category: 'Catering',
      url: absoluteSiteUrl('/catering#inquiry'),
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
    },
  };
}
