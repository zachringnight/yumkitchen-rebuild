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
    image: '/images/patticake/03_top_view.jpg',
    imageAlt: 'yum! Patticake, chocolate cake with vanilla buttercream, top view',
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
    image: '/images/patticake/10_layers_slice.jpg',
    imageAlt: 'yum! chocolate layer cake with vanilla buttercream, close up',
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
    image: '/images/yum-patticake-top.jpg',
    imageAlt: 'yum! white buttercream cake, top view',
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
