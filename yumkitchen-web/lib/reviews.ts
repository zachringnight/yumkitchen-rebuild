// Reviews and social-proof data.
// Only verified aggregate ratings and attributed press quotes are public.

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
