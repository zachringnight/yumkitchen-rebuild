// Patticake product catalog for the national-delivery demo.
// Prices are the confirmed bakery prices (whole $59.95, slice $7.50), stored in cents.
// This is the demo source of truth; at go-live it is swapped for the commerce backend feed.

export type CakeFormat = 'whole' | 'slice';

export type CakeVariant = {
  format: CakeFormat;
  label: string;
  price: number; // cents
  serves: string;
};

export type Cake = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  variants: CakeVariant[];
  signature?: boolean;
};

export const cakes: Cake[] = [
  {
    slug: 'patticake',
    name: 'Patticake',
    tagline: 'the signature',
    description: 'A towering triple-layer chocolate cake with vanilla buttercream, baked from scratch. Named for founder Patti Soskin.',
    image: '/images/patticake/slices_plates_vertical.jpg',
    imageAlt: 'a tall triple-layer chocolate Patticake slice on a white plate, with more slices behind',
    signature: true,
    variants: [
      { format: 'whole', label: 'Whole cake', price: 5995, serves: '8-inch round, serves 8 to 16' },
      { format: 'slice', label: 'By the slice', price: 750, serves: 'a single generous slice' },
    ],
  },
  {
    slug: 'bakers-man',
    name: "Baker's Man",
    tagline: 'bakery-forward',
    description: 'A generous, festive layer cake for guests who want something familiar and comforting.',
    // The actual Baker's Man (chocolate swiss buttercream), pulled 2026-08-05
    // from the owned @yumkitchen Instagram (post Da-NWFlCDf3, whose caption
    // names the cake). It previously wore a Patticake photo, on the very page
    // that compares the two cakes.
    image: '/images/patticake/bakers_man_stand.jpg',
    imageAlt: "Baker's Man chocolate layer cake with chocolate swiss buttercream on a cake stand, with a slice plated",
    variants: [
      { format: 'whole', label: 'Whole cake', price: 5995, serves: '8-inch round, serves 8 to 16' },
      { format: 'slice', label: 'By the slice', price: 750, serves: 'a single generous slice' },
    ],
  },
  {
    slug: 'coconut',
    name: 'Coconut Cake',
    tagline: 'a little extra joy',
    description: 'A light, buttercream-finished coconut cake and a favorite for celebrations that need a lift.',
    image: '/images/patticake/coconut_cake_boxed.jpg',
    imageAlt: 'yum! coconut cake coated in coconut flakes, boxed in the bakery',
    variants: [
      { format: 'whole', label: 'Whole cake', price: 5995, serves: '8-inch round, serves 8 to 16' },
      { format: 'slice', label: 'By the slice', price: 750, serves: 'a single generous slice' },
    ],
  },
];

export const occasions = [
  'birthday',
  'thank you',
  'congratulations',
  'thinking of you',
  'anniversary',
  'just because',
] as const;

export type Occasion = (typeof occasions)[number];

// Flat shipping in the demo. Real rates come from the commerce backend at go-live.
export const demoShippingFlat = 1495; // cents

export function findCake(slug: string): Cake | undefined {
  return cakes.find((c) => c.slug === slug);
}

export function findVariant(cake: Cake, format: CakeFormat): CakeVariant | undefined {
  return cake.variants.find((v) => v.format === format);
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}
