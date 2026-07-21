import { locations, type LocationSlug } from './locations';
import rightsLedgerJson from './ugc-rights-ledger.json';

// Only dated aggregate ratings, attributed editorial coverage, owned social
// links, and customer stories with documented written permission are public.

export type RatingProof = {
  platform: 'Google Maps' | 'Restaurantji' | 'Yelp';
  value: number;
  count: number;
  scope: string;
  sourceUrl: string;
  verifiedOn: string;
  verificationNote?: string;
};

const stLouisPark = locations.find((location) => location.slug === 'st-louis-park');

if (!stLouisPark) {
  throw new Error('St. Louis Park location is required for aggregate rating proof.');
}

export const ratingPlatforms: readonly RatingProof[] = [
  {
    platform: 'Google Maps',
    value: 4.5,
    count: 1868,
    scope: 'St. Louis Park',
    sourceUrl: stLouisPark.maps_url,
    verifiedOn: '2026-07-21',
    verificationNote: 'Public count cross-checked through Postcard.',
  },
  {
    platform: 'Restaurantji',
    value: stLouisPark.rating.value,
    count: stLouisPark.rating.count,
    scope: 'St. Louis Park',
    sourceUrl: stLouisPark.rating.sourceUrl,
    verifiedOn: stLouisPark.rating.verifiedOn,
  },
  {
    platform: 'Yelp',
    value: 4.0,
    count: 640,
    scope: 'St. Louis Park',
    sourceUrl: 'https://www.postcard.inc/places/yum-kitchen-and-bakery-st-louis-park-5sYparpyEiB',
    verifiedOn: '2026-07-21',
    verificationNote: 'Public Yelp aggregate shown through Postcard.',
  },
];

export const ratingHeadline = {
  value: ratingPlatforms[0].value,
  sourceCount: '1,800+',
  source: ratingPlatforms[0].platform,
  sourceUrl: ratingPlatforms[0].sourceUrl,
} as const;

export const locationRatingPlatforms = Object.fromEntries(
  locations.map((location) => [
    location.slug,
    {
      platform: location.rating.platform,
      value: location.rating.value,
      count: location.rating.count,
      scope: location.short_name,
      sourceUrl: location.rating.sourceUrl,
      verifiedOn: location.rating.verifiedOn,
    } satisfies RatingProof,
  ]),
) as Record<LocationSlug, RatingProof>;

// Editorial facts are paraphrased and linked to the original coverage.
export const pressHighlights = [
  {
    statement: 'Patticake featured in a Twin Cities dessert guide.',
    outlet: 'Eater Twin Cities',
    sourceUrl: 'https://twincities.eater.com/maps/best-desserts-pastries-restaurants-minneapolis-st-paul',
  },
  {
    statement: 'Patticake named in a best bakeries feature.',
    outlet: 'Mpls.St.Paul Magazine',
    sourceUrl: 'https://mspmag.com/eat-and-drink/mill-city-rising-best-bakeries-of-the-twin-cities/',
  },
  {
    statement: 'yum! mini French silk pie selected for a best-pies roundup.',
    outlet: 'Minnesota Star Tribune',
    sourceUrl: 'https://www.startribune.com/the-10-best-pies-our-food-writers-ate-this-week/601587853',
  },
] as const;

export const ownedSocialProfiles = [
  {
    platform: 'Instagram',
    handle: '@yumkitchen',
    sourceUrl: 'https://www.instagram.com/yumkitchen/',
  },
  {
    platform: 'TikTok',
    handle: '@yumkitchenandbakery',
    sourceUrl: 'https://www.tiktok.com/@yumkitchenandbakery',
  },
] as const;

type CustomerStoryRights = {
  id: string;
  platform: 'Google Maps' | 'Yelp' | 'Restaurantji' | 'Instagram' | 'TikTok';
  sourceUrl: string;
  creator: string;
  content: string;
  permissionStatus: 'pending' | 'approved' | 'declined' | 'expired';
  permissionEvidence: string;
  permissionGrantedOn: string;
  usageScope: string;
  expiresOn?: string;
};

const rightsLedger = rightsLedgerJson as {
  items: CustomerStoryRights[];
};

export const approvedCustomerStories = rightsLedger.items.filter(
  (item) =>
    item.permissionStatus === 'approved' &&
    item.permissionEvidence.trim().length > 0 &&
    item.permissionGrantedOn.trim().length > 0 &&
    item.usageScope.trim().length > 0 &&
    item.sourceUrl.startsWith('https://'),
);
