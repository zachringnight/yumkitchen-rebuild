// Reviews + social-proof data.
// Aggregate ratings and press quotes are real and attributed. Customer cards are
// clearly-labeled samples until live reviews are connected and rights are cleared
// (see reviewUsagePolicy in lib/brand.ts).

export const ratingPlatforms = [
  { platform: 'Google', value: 4.5, count: 1527, note: 'Minnetonka / Shady Oak' },
  { platform: 'Restaurantji', value: 4.4, count: 403, note: 'St. Louis Park' },
  { platform: 'Yelp', value: 4.2, count: 271, note: 'Twin Cities' },
] as const;

// Headline number for the wall (largest verified source).
export const ratingHeadline = { value: 4.5, sourceCount: '1,500+', source: 'Google' } as const;

// Editorial press quotes, attributed. Safe to publish.
export const pressPullQuotes = [
  { quote: 'a towering triple-layer chocolate cake', outlet: 'Eater Twin Cities' },
  { quote: 'a not-so-secret fan club of devotees', outlet: 'Mpls.St.Paul Magazine' },
  { quote: 'a must-try treat among the Twin Cities’ top bakeries', outlet: 'Star Tribune' },
] as const;

// Sample customer reviews for layout. Live Google/Yelp reviews connect at launch;
// real customer content is used publicly only after rights are cleared.
export const sampleReviews = [
  { name: 'Marisa K.', rating: 5, text: 'Shipped a Patticake to my mom three states away and it arrived perfect. She cried. Worth every penny.' },
  { name: 'Devon R.', rating: 5, text: 'The chocolate cake is unreal — moist, not too sweet, and that buttercream. Our office birthday standard now.' },
  { name: 'Priya S.', rating: 4, text: 'Ordering was easy and the gift note was a lovely touch. Delivery date was exactly on time.' },
  { name: 'Tom & Angela', rating: 5, text: 'We do a lot of long-distance celebrating. This is the easiest, most thoughtful gift we send.' },
] as const;
