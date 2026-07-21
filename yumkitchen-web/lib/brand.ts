// ---------------------------------------------------------------------------
// yum! Kitchen and Bakery brand + voice profile.
// Single source of truth for copy discipline and any generated/AI copy.
// Derived from the AI-coder brand brief (public-source inferred, 2026-07-09),
// with two decisions confirmed by the client that OVERRIDE the public-site brief
// (see `brandDecisions`). Not an official brand book; verify live operational
// details (hours, prices, allergens) against source-of-truth data before launch.
// ---------------------------------------------------------------------------

export type ClaimConfidence = 'confirmed' | 'high' | 'medium' | 'low';

export type BrandClaim = {
  claim: string;
  confidence: ClaimConfidence;
  source: string;
};

export const brandName = 'yum! Kitchen and Bakery';
export const brandShortName = 'yum!';

export const brandAliases = [
  'yum!',
  'yum! Kitchen and Bakery',
  'Yum! Kitchen and Bakery',
  'Yum Kitchen and Bakery',
  'Yum Kitchen & Bakery',
] as const;

export const brandSummary =
  'A Twin Cities restaurant and bakery serving made-from-scratch seasonal food, breakfast, lunch, dinner, baked goods, cakes, and catering across four metro locations.';

export const brandVoice = {
  core: ['bright', 'friendly', 'practical', 'warm', 'local', 'scratch-made', 'not pretentious'],
  tone: 'casual-polished hospitality',
  writingStyle: 'short, concrete, helpful, food-specific, clear CTAs',
  avoidTone: ['luxury', 'chef-celebrity', 'corporate', 'overly precious', 'generic fast-casual'],
} as const;

export const approvedPhrases = [
  'made from scratch',
  'seasonal food',
  'fresh and friendly',
  'share the love',
  'easy to find, easy to park',
  'breakfast, lunch, dinner, and bakery',
  'order online',
  'pick up',
  'great for gatherings',
  'call with questions',
  'cake inquiry',
  'neighborhood favorite',
  'bakery case',
  'house-made',
] as const;

// Do not use in generated copy without proof / client sign-off.
export const avoidPhrases = [
  'organic',
  'farm-to-table',
  'locally sourced',
  'award-winning',
  'best in Minnesota',
  'chef-driven',
  'luxury',
  'gourmet',
  'elevated',
  'artisan',
  'viral',
  'allergen-free',
  'healthy', // blanket claim
] as const;

// Short CTA vocabulary. Keep CTAs in this family.
export const approvedCtas = ['Order Now', 'View Menu', 'Find Your yum!', 'Start a Cake Inquiry', 'Plan Catering', 'Ship a Cake', 'Pick Up Locally'] as const;

export const claimAllowlist: BrandClaim[] = [
  { claim: 'yum! serves made-from-scratch seasonal food.', confidence: 'high', source: 'https://yumkitchen.com/menu/' },
  { claim: 'yum! has served the Twin Cities since 2005.', confidence: 'high', source: 'https://yumkitchen.com/about/' },
  { claim: 'yum! is led by Patti and Robbie Soskin.', confidence: 'high', source: 'https://yumkitchen.com/about/' },
  { claim: 'yum! has four locations: St. Louis Park, Shady Oak/Minnetonka, St. Paul, and Woodbury.', confidence: 'high', source: 'https://yumkitchen.com/in-the-news/' },
  { claim: 'Catering includes sandwich platters, box lunches, salads, and baked goods for pickup with 24-hour notice.', confidence: 'high', source: 'https://yumkitchen.com/catering/' },
  { claim: 'Cake options include Patticake, Baker’s Man, and Coconut Cake.', confidence: 'high', source: 'https://yumkitchen.com/order-a-cake/' },
  { claim: 'Patticake is yum’s signature / claim-to-fame product.', confidence: 'high', source: 'https://twincities.eater.com/maps/best-desserts-pastries-restaurants-minneapolis-st-paul' },
  { claim: 'Patticake is a towering triple-layer chocolate cake with vanilla buttercream.', confidence: 'high', source: 'https://twincities.eater.com/maps/best-desserts-pastries-restaurants-minneapolis-st-paul' },
  // Confirmed by client (overrides the public-source brief, which listed this as needing confirmation).
  { claim: 'Patticake is named for founder Patti Soskin.', confidence: 'confirmed', source: 'client confirmation 2026-07-09' },
];

export const claimsRequiringConfirmation = [
  'All ingredients are locally sourced.',
  'Any allergen-free, gluten-free, vegan, or health-specific claim not backed by current allergen data.',
  'Current item prices or item availability.',
  'Any award or ranking claim without a specific source and date.',
] as const;

// Decisions confirmed by the client that supersede the public-source brief.
// Encoded so future copy/AI treats them as settled, not as items to "correct."
export const brandDecisions = {
  nationalDeliveryLive: {
    value: true,
    note: 'Patticake ships nationwide with online checkout. Supersedes the public-site cake-order form ("cakes not shipped/delivered at this time"), which reflects pre-launch operations.',
    decidedOn: '2026-07-09',
  },
  patticakeNamedForPatti: {
    value: true,
    note: 'Confirmed true by client. Supersedes the brief’s "requires confirmation" flag. Safe to state in copy.',
    decidedOn: '2026-07-09',
  },
} as const;

// Source-of-truth URLs. Never hard-code hours/prices/menu without a live source.
export const brandSources = {
  menu: 'https://yumkitchen.com/menu/',
  hours: 'https://yumkitchen.com/',
  locations: 'https://yumkitchen.com/in-the-news/',
  catering: 'https://yumkitchen.com/catering/',
  cakePolicy: 'https://yumkitchen.com/order-a-cake/',
  about: 'https://yumkitchen.com/about/',
} as const;

// UGC / reviews: summarize themes internally; do not publish customer quotes or
// photos as marketing without secured rights. Gates the Wave 2 reviews/UGC wall.
export const reviewUsagePolicy =
  'Editorial press facts may be used with attribution. Customer reviews/UGC require secured rights before public marketing use; until then, show only dated aggregate ratings, linked owned profiles, and attributed editorial coverage.';

// Compact system-prompt block for any copy-generation / assistant feature.
export const brandSystemPrompt = [
  'You are writing for yum! Kitchen and Bakery, a Twin Cities restaurant and bakery with a warm, practical, made-from-scratch personality.',
  'Write in a bright, friendly, casual-polished voice. Prioritize clarity, hospitality, and concrete food detail over hype.',
  'Use the brand name as "yum!" in branded copy. Keep headings simple and often lowercase. Keep CTAs short: Order Now, View Menu, Find Your yum!, Start a Cake Inquiry, Plan Catering, Ship a Cake.',
  'Do not invent menu availability, prices, allergen claims, awards, or founder-origin stories beyond the confirmed claims. Route allergens, custom cakes, and large catering to the location team or phone.',
  'Patticake national delivery is live and Patticake is named for founder Patti Soskin (both confirmed). Everything else follows the claim allowlist.',
].join(' ');
