import locationsData from './locations-seed.json';
import { absoluteSiteUrl } from './site';

export type LocationSlug = 'st-louis-park' | 'shady-oak' | 'saint-paul' | 'woodbury';

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type BaseLocation = {
  slug: LocationSlug;
  name: string;
  short_name: string;
  tagline: string;
  address: Address;
  phone: string;
  phone_e164: string;
  hours: string;
  hours_schema: string;
  order_url: string;
  maps_url: string;
  maps_embed: string;
  lat: number;
  lng: number;
  is_original: boolean;
};

type LocationDetail = {
  heroImage: string;
  cardImage: string;
  cardImageAlt: string;
  neighborhood: string;
  parking: string;
  roomNote: string;
  favorite: string;
  metaDescription: string;
  // Public aggregate ratings (Google / Restaurantji, captured 2026-07). Verify before launch.
  rating: { value: number; count: number };
};

const locationDetails: Record<LocationSlug, LocationDetail> = {
  'st-louis-park': {
    heroImage: '/images/yum-location-slp.jpg',
    cardImage: '/images/yum-location-slp.jpg',
    cardImageAlt: 'yum! Kitchen and Bakery storefront in St. Louis Park',
    neighborhood: 'Our original St. Louis Park restaurant sits on Minnetonka Boulevard, close to neighborhood errands, school pickups, and easy weeknight dinners.',
    parking: 'Easy lot parking near the front door.',
    roomNote: 'A warm everyday room for breakfast, lunch, dinner, takeout, and bakery stops.',
    favorite: 'Try a bowl of bob’s tomato soup with a toasted sandwich.',
    metaDescription: 'Visit yum! st. louis park at 4000 Minnetonka Blvd for breakfast, lunch, dinner, bakery, takeout, and online ordering.',
    rating: { value: 4.4, count: 403 },
  },
  'shady-oak': {
    heroImage: '/images/yum-location-shady-oak.jpg',
    cardImage: '/images/yum-location-shady-oak.jpg',
    cardImageAlt: 'yum! Kitchen and Bakery storefront in Minnetonka on Shady Oak Road',
    neighborhood: 'Our Shady Oak location serves Minnetonka and Hopkins with fast parking, friendly counters, and a full yum! menu.',
    parking: 'Convenient parking right off Shady Oak Road.',
    roomNote: 'A friendly stop for weekday lunches, family dinners, and pickup on the way home.',
    favorite: 'Order a salad, mac and cheese, or a bakery treat for later.',
    metaDescription: 'Visit yum! shady oak at 6001 Shady Oak Rd in Minnetonka for made-from-scratch food, bakery, takeout, and online ordering.',
    rating: { value: 4.5, count: 1527 },
  },
  'saint-paul': {
    heroImage: '/images/yum-location-saint-paul.jpg',
    cardImage: '/images/yum-location-saint-paul.jpg',
    cardImageAlt: 'yum! Kitchen and Bakery storefront in St. Paul on Snelling Avenue',
    neighborhood: 'Our St. Paul restaurant is right on Snelling Avenue, ready for neighborhood breakfasts, lunch meetings, and dinner to go.',
    parking: 'Street and nearby neighborhood parking available.',
    roomNote: 'A comfortable stop for dine-in meals, coffee, dessert, and quick pickup.',
    favorite: 'Pair breakfast all day with something sweet from the bakery case.',
    metaDescription: 'Visit yum! st. paul at 164 Snelling Avenue N for breakfast, lunch, dinner, bakery, takeout, and online ordering.',
    rating: { value: 4.2, count: 194 },
  },
  woodbury: {
    heroImage: '/images/yum-location-woodbury.jpg',
    cardImage: '/images/yum-location-woodbury.jpg',
    cardImageAlt: 'yum! Kitchen and Bakery storefront in Woodbury at City Centre',
    neighborhood: 'Our Woodbury location brings yum! to the east metro with plenty of room for families, coworkers, and casual gatherings.',
    parking: 'Easy parking around City Centre Drive.',
    roomNote: 'A bright neighborhood spot for dining in, carrying out, and picking up celebration desserts.',
    favorite: 'Bring home dinner, soup, and a pie for the table.',
    metaDescription: 'Visit yum! woodbury at 8340 City Centre Drive for made-from-scratch meals, bakery, takeout, and online ordering.',
    rating: { value: 4.5, count: 174 },
  },
};

export type Location = BaseLocation & LocationDetail;

export const locations: Location[] = (locationsData as BaseLocation[]).map((location) => ({
  ...location,
  ...locationDetails[location.slug],
}));

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

/** Schema.org Restaurant JSON-LD for a location. Use in every location detail page. */
export function entityJsonLd(loc: Location) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': absoluteSiteUrl(`/location/${loc.slug}`),
    name: `yum! Kitchen and Bakery - ${loc.short_name}`,
    image: absoluteSiteUrl(loc.heroImage),
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.address.street,
      addressLocality: loc.address.city,
      addressRegion: loc.address.state,
      postalCode: loc.address.zip,
      addressCountry: loc.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: loc.lat,
      longitude: loc.lng,
    },
    telephone: loc.phone,
    openingHours: loc.hours_schema,
    servesCuisine: ['American', 'Bakery'],
    priceRange: '$$',
    url: absoluteSiteUrl(`/location/${loc.slug}`),
    hasMenu: absoluteSiteUrl('/menu'),
    acceptsReservations: false,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: loc.rating.value,
      reviewCount: loc.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: [
      'https://www.facebook.com/yumkitchenandbakery',
      'https://www.instagram.com/yumkitchen/',
      'https://twitter.com/YumKitchen',
      'https://www.linkedin.com/company/yum-kitchen-and-bakery/',
    ],
  };
}

const brandSocialProfiles = [
  'https://www.facebook.com/yumkitchenandbakery',
  'https://www.instagram.com/yumkitchen/',
  'https://twitter.com/YumKitchen',
  'https://www.linkedin.com/company/yum-kitchen-and-bakery/',
];

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteSiteUrl('/#organization'),
    name: 'yum! Kitchen and Bakery',
    url: absoluteSiteUrl('/'),
    logo: absoluteSiteUrl('/favicon.png'),
    sameAs: brandSocialProfiles,
  };
}

/**
 * Schema.org Restaurant/Bakery JSON-LD for the brand. Use on the homepage.
 * The four locations are listed as `department`, each linked by the same @id
 * the location pages emit, so search engines merge them rather than duplicate.
 */
export function brandJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Restaurant', 'Bakery'],
    '@id': absoluteSiteUrl('/#business'),
    name: 'yum! Kitchen and Bakery',
    url: absoluteSiteUrl('/'),
    logo: absoluteSiteUrl('/favicon.png'),
    image: absoluteSiteUrl('/og/home.jpg'),
    description:
      'Made-from-scratch breakfast, lunch, dinner, bakery, and catering from four neighborhood restaurants in the Twin Cities.',
    servesCuisine: ['American', 'Bakery'],
    priceRange: '$$',
    hasMenu: absoluteSiteUrl('/menu'),
    areaServed: { '@type': 'AdministrativeArea', name: 'Twin Cities, Minnesota' },
    parentOrganization: { '@id': absoluteSiteUrl('/#organization') },
    sameAs: brandSocialProfiles,
    department: locations.map((loc) => ({
      '@type': 'Restaurant',
      '@id': absoluteSiteUrl(`/location/${loc.slug}`),
      name: `yum! Kitchen and Bakery - ${loc.short_name}`,
      url: absoluteSiteUrl(`/location/${loc.slug}`),
      telephone: loc.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: loc.address.street,
        addressLocality: loc.address.city,
        addressRegion: loc.address.state,
        postalCode: loc.address.zip,
        addressCountry: loc.address.country,
      },
    })),
  };
}
