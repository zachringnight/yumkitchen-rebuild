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
  /**
   * CSS object-position for the hero crop. Most location photos are portrait
   * sources shown in a wide hero band; set this when the default center crop
   * misses the subject (people, signage). Omit for center.
   */
  heroObjectPosition?: string;
  cardImage: string;
  cardImageAlt: string;
  neighborhood: string;
  parking: string;
  roomNote: string;
  favorite: string;
  metaDescription: string;
  // Public aggregate ratings captured from the linked source. Refresh the
  // value, count, and verification date together so JSON-LD and page proof
  // never drift apart.
  rating: {
    value: number;
    count: number;
    platform: 'Restaurantji';
    sourceUrl: string;
    verifiedOn: string;
  };
};

const locationDetails: Record<LocationSlug, LocationDetail> = {
  'st-louis-park': {
    heroImage: '/images/yum-location-slp.jpg',
    // Portrait source: the pair holding the cake sits at ~60-87% of frame
    // height. Center crops onto dark storefront glass; 75% keeps the people,
    // the cake, and the front-door moment in the band at every viewport.
    heroObjectPosition: 'center 75%',
    cardImage: '/images/yum-location-slp.jpg',
    cardImageAlt: 'yum! Kitchen and Bakery storefront in St. Louis Park',
    neighborhood: 'Our original St. Louis Park restaurant sits on Minnetonka Boulevard, close to neighborhood errands, school pickups, and easy weeknight dinners.',
    parking: 'Easy lot parking near the front door.',
    roomNote: 'A warm everyday room for breakfast, lunch, dinner, takeout, and bakery stops.',
    favorite: 'Try a bowl of bob’s tomato soup with a toasted sandwich.',
    metaDescription: 'Visit yum! st. louis park at 4000 Minnetonka Blvd for breakfast, lunch, dinner, bakery, takeout, and online ordering.',
    rating: {
      value: 4.4,
      count: 413,
      platform: 'Restaurantji',
      sourceUrl: 'https://www.restaurantji.com/mn/minneapolis/yum-kitchen-and-bakery-/',
      verifiedOn: '2026-07-21',
    },
  },
  'shady-oak': {
    heroImage: '/images/yum-location-shady-oak.jpg',
    // Portrait-ish source: signage at ~50-55% and the red awning at ~57-65%.
    // Center is acceptable; 55% keeps the awning from clipping on wide screens.
    heroObjectPosition: 'center 55%',
    cardImage: '/images/yum-location-shady-oak.jpg',
    cardImageAlt: 'yum! Kitchen and Bakery storefront in Minnetonka on Shady Oak Road',
    neighborhood: 'Our Shady Oak location serves Minnetonka and Hopkins with fast parking, friendly counters, and a full yum! menu.',
    parking: 'Convenient parking right off Shady Oak Road.',
    roomNote: 'A friendly stop for weekday lunches, family dinners, and pickup on the way home.',
    favorite: 'Order a salad, mac and cheese, or a bakery treat for later.',
    metaDescription: 'Visit yum! shady oak at 6001 Shady Oak Rd in Minnetonka for made-from-scratch food, bakery, takeout, and online ordering.',
    rating: {
      value: 4.6,
      count: 286,
      platform: 'Restaurantji',
      sourceUrl: 'https://www.restaurantji.com/mn/minnetonka/yum-kitchen-and-bakery-minnetonka-/',
      verifiedOn: '2026-07-21',
    },
  },
  'saint-paul': {
    heroImage: '/images/yum-location-saint-paul.jpg',
    // Distinct from the hero on purpose: the page used to show the same
    // storefront photo twice. Yum_2547 from the original-site archive is
    // verified as St. Paul (the original location-saint-paul page ran it).
    cardImage: '/images/yum-saint-paul-street.jpg',
    cardImageAlt: 'guests walking into yum! St. Paul under the red awnings on Snelling Avenue',
    neighborhood: 'Our St. Paul restaurant is right on Snelling Avenue, ready for neighborhood breakfasts, lunch meetings, and dinner to go.',
    parking: 'Street and nearby neighborhood parking available.',
    roomNote: 'A comfortable stop for dine-in meals, coffee, dessert, and quick pickup.',
    favorite: 'Pair breakfast all day with something sweet from the bakery case.',
    metaDescription: 'Visit yum! st. paul at 164 Snelling Avenue N for breakfast, lunch, dinner, bakery, takeout, and online ordering.',
    rating: {
      value: 4.2,
      count: 194,
      platform: 'Restaurantji',
      sourceUrl: 'https://www.restaurantji.com/mn/saint-paul/yum-kitchen-and-bakery-/',
      verifiedOn: '2026-07-21',
    },
  },
  woodbury: {
    heroImage: '/images/yum-location-woodbury.jpg',
    // Portrait source: sky fills the top third; sign, letters, and red awning
    // sit at ~42-70%. Center is acceptable; 55% trims dead sky and keeps the
    // awning and entrance in the band on wide screens.
    heroObjectPosition: 'center 55%',
    // Distinct from the hero on purpose (same-page repeat fix). The original
    // site's location-woodbury page ran this exact cover photo.
    cardImage: '/images/yum-woodbury-storefront.png',
    cardImageAlt: 'yum! Kitchen and Bakery gabled brick storefront in Woodbury with fall pumpkins at the door',
    neighborhood: 'Our Woodbury location brings yum! to the east metro with plenty of room for families, coworkers, and casual gatherings.',
    parking: 'Easy parking around City Centre Drive.',
    roomNote: 'A bright neighborhood spot for dining in, carrying out, and picking up celebration desserts.',
    favorite: 'Bring home dinner, soup, and a pie for the table.',
    metaDescription: 'Visit yum! woodbury at 8340 City Centre Drive for made-from-scratch meals, bakery, takeout, and online ordering.',
    rating: {
      value: 4.5,
      count: 174,
      platform: 'Restaurantji',
      sourceUrl: 'https://www.restaurantji.com/mn/woodbury/yum-kitchen-and-bakery-/',
      verifiedOn: '2026-07-21',
    },
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
