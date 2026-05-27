import locationsData from './locations-seed.json';

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
  neighborhood: string;
  parking: string;
  roomNote: string;
  favorite: string;
  metaDescription: string;
};

const locationDetails: Record<LocationSlug, LocationDetail> = {
  'st-louis-park': {
    heroImage: '/images/yum-location-slp.jpg',
    cardImage: '/images/yum-location-slp.jpg',
    neighborhood: 'Our original St. Louis Park kitchen sits on Minnetonka Boulevard, close to neighborhood errands, school pickups, and easy weeknight dinners.',
    parking: 'Easy lot parking near the front door.',
    roomNote: 'A warm everyday room for breakfast, lunch, dinner, takeout, and bakery stops.',
    favorite: 'Try a bowl of bob’s tomato soup with a toasted sandwich.',
    metaDescription: 'Visit yum! st. louis park at 4000 Minnetonka Blvd for breakfast, lunch, dinner, bakery, takeout, and online ordering.',
  },
  'shady-oak': {
    heroImage: '/images/yum-location-shady-oak.jpg',
    cardImage: '/images/yum-location-shady-oak.jpg',
    neighborhood: 'Our Shady Oak location serves Minnetonka and Hopkins with fast parking, friendly counters, and a full yum! menu.',
    parking: 'Convenient parking right off Shady Oak Road.',
    roomNote: 'Built for easy weekday lunches, family dinners, and pickup on the way home.',
    favorite: 'Order a salad, mac and cheese, or a bakery treat for later.',
    metaDescription: 'Visit yum! shady oak at 6001 Shady Oak Rd in Minnetonka for made-from-scratch food, bakery, takeout, and online ordering.',
  },
  'saint-paul': {
    heroImage: '/images/yum-location-saint-paul.jpg',
    cardImage: '/images/yum-location-saint-paul.jpg',
    neighborhood: 'Our St. Paul kitchen is right on Snelling Avenue, ready for neighborhood breakfasts, lunch meetings, and dinner to go.',
    parking: 'Street and nearby neighborhood parking available.',
    roomNote: 'A comfortable stop for dine-in meals, coffee, dessert, and quick pickup.',
    favorite: 'Pair breakfast all day with something sweet from the bakery case.',
    metaDescription: 'Visit yum! st. paul at 164 Snelling Avenue N for breakfast, lunch, dinner, bakery, takeout, and online ordering.',
  },
  woodbury: {
    heroImage: '/images/yum-location-woodbury.png',
    cardImage: '/images/yum-location-woodbury.png',
    neighborhood: 'Our Woodbury location brings yum! to the east metro with plenty of room for families, coworkers, and casual gatherings.',
    parking: 'Easy parking around City Centre Drive.',
    roomNote: 'A polished neighborhood spot for dining in, carrying out, and picking up celebration desserts.',
    favorite: 'Bring home dinner, soup, and a pie for the table.',
    metaDescription: 'Visit yum! woodbury at 8340 City Centre Drive for made-from-scratch meals, bakery, takeout, and online ordering.',
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
    '@id': `https://yumkitchen.com/location/${loc.slug}`,
    name: `yum! Kitchen and Bakery - ${loc.short_name}`,
    image: 'https://yumkitchen.com/wp-content/uploads/2022/12/Yum_2175.jpg',
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
    url: `https://yumkitchen.com/location/${loc.slug}`,
    hasMenu: 'https://yumkitchen.com/menu',
    acceptsReservations: false,
    sameAs: [
      'https://www.facebook.com/yumkitchenandbakery',
      'https://www.instagram.com/yumkitchen/',
      'https://twitter.com/YumKitchen',
      'https://www.linkedin.com/company/yum-kitchen-and-bakery/',
    ],
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'yum! Kitchen and Bakery',
    url: 'https://yumkitchen.com',
    logo: 'https://yumkitchen.com/favicon.png',
    sameAs: [
      'https://www.facebook.com/yumkitchenandbakery',
      'https://www.instagram.com/yumkitchen/',
      'https://twitter.com/YumKitchen',
      'https://www.linkedin.com/company/yum-kitchen-and-bakery/',
    ],
  };
}
