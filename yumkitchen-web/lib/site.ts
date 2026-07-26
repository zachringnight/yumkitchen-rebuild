import type { LocationSlug } from './locations';

function normalizeOrigin(value: string | undefined) {
  const trimmed = value?.trim().replace(/\/+$/, '');
  if (!trimmed) return undefined;
  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const yumKitchenSiteUrl = normalizeOrigin(process.env.NEXT_PUBLIC_YUMKITCHEN_URL) ?? 'https://yumkitchen.com';
export const patticakeSiteUrl = normalizeOrigin(process.env.NEXT_PUBLIC_PATTICAKE_URL) ?? 'https://patticake.com';
const vercelPreviewUrl = process.env.VERCEL_ENV === 'preview' ? normalizeOrigin(process.env.VERCEL_URL) : undefined;
export const siteUrl = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ?? vercelPreviewUrl ?? yumKitchenSiteUrl;
export const yumKitchenSiteName = 'yum! Kitchen and Bakery';
export const patticakeSiteName = 'Patticake';

export function absoluteSiteUrl(path = '/') {
  return new URL(path, siteUrl).toString();
}

export function yumCanonical(path = '/') {
  return new URL(path, yumKitchenSiteUrl).toString();
}

export function patticakeCanonical(path = '/') {
  return new URL(path, patticakeSiteUrl).toString();
}

export function yumTitle(title: string) {
  return { absolute: `${title} · ${yumKitchenSiteName}` };
}

export function patticakeTitle(title: string) {
  return { absolute: title === patticakeSiteName ? patticakeSiteName : `${title} · ${patticakeSiteName}` };
}

export function yumOpenGraph(image: string) {
  return { siteName: yumKitchenSiteName, images: [image] };
}

export function patticakeOpenGraph(image: string) {
  return { siteName: patticakeSiteName, images: [image] };
}

export const giftCardBuyUrl = 'https://www.toasttab.com/yumkitchenslp/giftcards';
export const giftCardBalanceUrl = 'https://www.toasttab.com/yumkitchenslp/findcard';
export const patticakeNationalOrderUrl = process.env.NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL ?? '/patticake#national-order';
export const patticakeNationalOrderIsExternal = /^https?:\/\//.test(patticakeNationalOrderUrl);

export const navItems = [
  { href: '/menu', label: 'menu' },
  { href: '/careers', label: 'work @ yum!' },
  {
    href: giftCardBuyUrl,
    label: 'gift cards',
    external: true,
    children: [
      { href: giftCardBuyUrl, label: 'buy gift cards', external: true },
      { href: giftCardBalanceUrl, label: 'check balance', external: true },
    ],
  },
  {
    href: '/about',
    label: 'our story',
    children: [
      { href: '/about', label: 'about us' },
      { href: '/in-the-news', label: 'in the news' },
      { href: '/contact', label: 'contact' },
    ],
  },
  { href: '/yum-kitchen#locations', label: 'locations' },
  { href: '/catering', label: 'catering' },
  {
    href: '/order-a-cake',
    label: 'cakes',
    children: [
      { href: '/order-a-cake', label: 'Pick Up Locally' },
      { href: '/patticake', label: 'Ship a Cake' },
    ],
  },
] as const;

export const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/yumkitchenandbakery' },
  { label: 'Instagram', href: 'https://www.instagram.com/yumkitchen/' },
  { label: 'Twitter/X', href: 'https://twitter.com/YumKitchen' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/yum-kitchen-and-bakery/' },
] as const;

export const pageMeta = {
  home: {
    title: 'yum! Kitchen and Bakery',
    description:
      "We're a restaurant and bakery with locations in Minnetonka, St. Louis Park, St. Paul, and Woodbury serving made-from-scratch seasonal food.",
    image: '/og/home.jpg',
  },
  patticakeHome: {
    title: 'Patticake',
    description: 'Ship a Cake, Pick Up Locally, and visit the yum! Kitchen and Bakery restaurant pages.',
    image: '/og/patticake-home.jpg',
  },
  menu: {
    title: 'menu',
    description: 'Explore the yum! Kitchen and Bakery menu for lunch, dinner, breakfast, bakery, catering, gluten, and allergy information.',
    image: '/og/menu.jpg',
  },
  order: {
    title: 'order online',
    description: 'Start a yum! Kitchen and Bakery pickup order by location, browse favorites, and continue to Toast checkout.',
    image: '/og/menu.jpg',
  },
  catering: {
    title: 'catering',
    description: 'Sandwich platters, box lunches, salads, baked goods, and more for pickup with 24 hour notice.',
    image: '/images/yum-catering-sandwiches-live.jpg',
  },
  cake: {
    title: 'order a patticake',
    description: 'Order or inquire about yum! Kitchen and Bakery Patticake, wedding cakes, and celebration cakes.',
    image: '/og/order-a-cake.jpg',
  },
  patticakeDelivery: {
    title: 'Patticake Nationwide Delivery',
    description: 'Patticake is now available nationwide. Start a shipping note, add the sweet details, and hear back from yum! before baking.',
    image: '/og/patticake-ship.jpg',
  },
  about: {
    title: 'about us',
    description: 'Made from scratch since 2005. Meet the family and team behind yum! Kitchen and Bakery.',
    image: '/images/yum-patti-kelli.jpeg',
  },
  careers: {
    title: 'work @ yum!',
    description: 'Join the yum! Kitchen and Bakery team and help share the love through hospitality.',
    image: '/images/yum-chef-team.jpg',
  },
  news: {
    title: 'yum! in the news',
    description: 'Press, awards, and media features for yum! Kitchen and Bakery.',
    image: '/images/yum-bakery-counter-cake.jpg',
  },
  contact: {
    title: "we'd love to hear from you",
    description: 'Contact yum! Kitchen and Bakery, call a restaurant, or send us a note.',
    image: '/images/yum-dining-room.jpg',
  },
  accessibility: {
    title: 'our accessibility statement',
    description: 'Accessibility statement and feedback form for yum! Kitchen and Bakery.',
    image: '/og/default.jpg',
  },
} as const;

export const homepageFeatures = [
  {
    title: 'Sandwiches',
    description: 'Made to order with the best ingredients.',
    href: '/menu#sandwiches',
    image: '/images/yum-ahi-tuna.png',
  },
  {
    title: 'Soups and Salads',
    description: 'Fresh, seasonal, and full of flavor.',
    href: '/menu#soup',
    image: '/images/yum-mixed-berry-salad.png',
  },
  {
    title: 'Breakfast All Day',
    description: 'Comfort classics done right.',
    href: '/order?category=breakfast#favorites',
    image: '/images/yum-breakfast.jpg',
  },
  {
    title: 'Bakery',
    description: 'Baked fresh from our scratch bakery.',
    href: '/menu#bakery',
    image: '/images/yum-patticake-slices.jpg',
  },
] as const;

export const seasonalHighlights = [
  {
    title: 'mixed berry salad',
    description: 'berries, goat cheese, sweet and spicy pecans, and maple vinaigrette.',
    href: '/menu#salads',
    image: '/images/yum-mixed-berry-salad.png',
  },
  {
    title: 'grainy mustard salmon',
    description: 'roasted salmon with jasmine rice, arugula, broccolini, and bright pickled ginger.',
    href: '/menu#entrees',
    image: '/images/yum-grainy-mustard-salmon.png',
  },
  {
    title: 'ahi tuna sandwich',
    description: 'grilled ahi with wasabi cream, cucumber, daikon sprouts, and pickled ginger.',
    href: '/menu#sandwiches',
    image: '/images/yum-ahi-tuna.png',
  },
  {
    title: 'tortilla soup',
    description: 'a neighborhood favorite for lunch, dinner, and take-home comfort.',
    href: '/menu#soup',
    image: '/images/yum-soups-tortilla.jpg',
  },
  {
    title: 'reuben',
    description: 'corned beef, swiss, sauerkraut, and red pepper aioli on caraway rye.',
    href: '/menu#sandwiches',
    image: '/images/yum-seasonal-reuben.jpg',
  },
  {
    title: 'frosted sugar cookie',
    description: 'bakery-case color for birthdays, office treats, and just-because days.',
    href: '/menu#bakery',
    image: '/images/yum-seasonal-sugar-cookie.jpg',
  },
] as const;

export const orderDemoItems = [
  {
    name: 'grainy mustard salmon',
    category: 'entree',
    description: 'roasted salmon, jasmine rice, arugula, broccolini, and pickled ginger.',
    price: 19.95,
    image: '/images/yum-grainy-mustard-salmon.png',
  },
  {
    name: 'ahi tuna sandwich',
    category: 'sandwich',
    description: 'grilled ahi with wasabi cream, pickled ginger, cucumber, and daikon sprouts.',
    price: 16.95,
    image: '/images/yum-ahi-tuna.png',
  },
  {
    name: 'mixed berry salad',
    category: 'salad',
    description: 'berries, goat cheese, sweet and spicy pecans, and maple vinaigrette.',
    price: 12.95,
    image: '/images/yum-mixed-berry-salad.png',
  },
  {
    name: "bob's tomato soup",
    category: 'soup',
    description: 'a cozy everyday favorite, available by cup, bowl, or quart.',
    price: 7.95,
    image: '/images/yum-bobs-tomato-soup.jpg',
  },
  {
    name: 'breakfast sandwich',
    category: 'breakfast',
    description: 'choice of bacon, yum! or chicken sausage, fried egg, and cheddar.',
    price: 12.95,
    image: '/images/yum-breakfast.jpg',
  },
  {
    name: 'frosted sugar cookie',
    category: 'bakery',
    description: 'colorful bakery-case joy for now or later.',
    price: 3.95,
    image: '/images/yum-seasonal-sugar-cookie.jpg',
  },
] as const;

export const photoMotionMoments = [
  {
    title: 'bakery case',
    detail: 'cakes, cookies, and bakery favorites',
    image: '/images/yum-patticake-slices.jpg',
  },
  {
    title: 'scratch cooking',
    detail: 'seasonal entrees and familiar comfort',
    image: '/images/yum-grainy-mustard-salmon.png',
  },
  {
    title: 'picnic pickup',
    detail: 'boxed lunches ready for the day',
    image: '/images/yum-catering-boxed-lunch.jpg',
  },
  {
    title: 'morning regulars',
    detail: 'breakfast, coffee, and counter energy',
    image: '/images/yum-cold-brew.jpg',
  },
  {
    title: 'party table',
    detail: 'cookies, cakes, and celebration trays',
    image: '/images/yum-bakery-cupcakes.jpg',
  },
  {
    title: 'team pride',
    detail: 'the people behind the plate',
    image: '/images/yum-chef-kitchen.jpg',
  },
  {
    title: 'lake day',
    detail: 'boxed lunches and takeout made by yum!',
    image: '/images/yum-catering-egg-salad.jpg',
  },
  {
    title: 'fresh greens',
    detail: 'salads built for lunch and dinner',
    image: '/images/yum-mixed-berry-salad.png',
  },
] as const;

export const promisePillars = [
  'serving great food for now or for later',
  'preparing the best food of each season',
  'loving what we do and how we do it',
] as const;

export const cateringPackages = [
  {
    title: 'picnic-ready lunches',
    description: 'Sandwiches, salads, sides, bakery treats, and branded pickup packaging for workdays or weekends.',
    image: '/images/yum-catering-boxed-lunch.jpg',
  },
  {
    title: 'hot comfort trays',
    description: 'Mac and cheese, lemon chicken, family-style sides, and generous pans made for the table.',
    image: '/images/yum-catering-mac-cheese.jpg',
  },
  {
    title: 'platters and sweets',
    description: 'Sandwich platters, salads, cookies, bars, cupcakes, and bakery case favorites.',
    image: '/images/yum-catering-platter-steak.jpg',
  },
] as const;

export const cateringProof = [
  '24 hour pickup notice for most catering orders',
  'pickup from all four yum! restaurants',
  'easy parking at every location',
  'call a real yum! team member with questions',
] as const;

export const cakeGallery = [
  { src: '/images/yum-patticake-slices.jpg', alt: 'yum! patticake slices' },
  { src: '/images/yum-bakery-gift-boxes.jpg', alt: 'yum! bakery gift boxes' },
  { src: '/images/yum-bakery-counter-cake.jpg', alt: 'yum! bakery counter with cake' },
  { src: '/images/yum-bakery-cupcakes.jpg', alt: 'yum! bakery cupcakes' },
] as const;

export const cakeOptions = [
  {
    title: 'patticake',
    description: 'A classic yum! celebration cake for weddings and milestone gatherings.',
  },
  {
    title: "baker's man",
    description: 'A bakery-forward option for guests who want something familiar, generous, and festive.',
  },
  {
    title: 'coconut cake',
    description: 'A favorite for events that need a little extra joy on the table.',
  },
] as const;

export const leaderCards = [
  {
    name: 'Hugo',
    role: 'chef and hospitality team',
    href: '/about',
    image: '/images/yum-chef-kitchen.jpg',
  },
  {
    name: 'Margaret',
    role: 'Woodbury hospitality lead',
    href: '/location/woodbury',
    image: '/images/yum-patti-kelli.jpeg',
  },
  {
    name: 'Mike',
    role: 'St. Paul neighborhood lead',
    href: '/location/saint-paul',
    image: '/images/yum-meet-mike.jpg',
  },
] as const;

export const locationOrder: LocationSlug[] = ['st-louis-park', 'shady-oak', 'saint-paul', 'woodbury'];

export const pressCategories = [
  'awards and lists',
  'bakery and desserts',
  'critic mentions',
  'tv and founder story',
  'community',
  'growth',
  'seasonal and catering',
] as const;

export type PressCategory = (typeof pressCategories)[number];

export const mediaHighlights = [
  {
    title: 'best restaurants hall of fame',
    outlet: 'Mpls.St.Paul Magazine',
    date: '2026',
    category: 'awards and lists',
    summary: 'A Twin Cities restaurant honor that celebrates yum! as a local favorite with real staying power.',
    href: 'https://mspmag.com/eat-and-drink/best-restaurants-hall-of-fame/',
  },
  {
    title: 'best bakeries of the twin cities',
    outlet: 'Mpls.St.Paul Magazine',
    date: '2025',
    category: 'bakery and desserts',
    summary: 'A bakeries feature that name-checks the “not-so-secret fan club of devotees” to yum!’s Patticake.',
    href: 'https://mspmag.com/eat-and-drink/mill-city-rising-best-bakeries-of-the-twin-cities/',
  },
  {
    title: 'best desserts in minneapolis and st. paul',
    outlet: 'Eater Twin Cities',
    date: '2023',
    category: 'bakery and desserts',
    summary: 'Eater’s dessert map calls the Patticake “a towering triple-layer chocolate cake,” alongside mini Key lime pies, cupcakes, bars, and cookies.',
    href: 'https://twincities.eater.com/maps/best-desserts-pastries-restaurants-minneapolis-st-paul',
  },
  {
    title: 'star tribune food writer picks',
    outlet: 'Minnesota Star Tribune',
    date: '2026',
    category: 'critic mentions',
    summary: 'Repeated food-writer mentions for bakery favorites, including mini French silk pie and chocolate chip cookies.',
    href: 'https://www.startribune.com/the-10-best-pies-our-food-writers-ate-this-week/601587853',
  },
  {
    title: 'good company founder interview',
    outlet: 'KSTP 5 Eyewitness News',
    date: '2023',
    category: 'tv and founder story',
    summary: 'KSTP’s Good Company sat down with Patti Soskin on her journey, with three locations open and a fourth on the way in Woodbury.',
    href: 'https://kstp.com/tcl/good-company-yum-kitchen-bakery/',
  },
  {
    title: 'great minnesota bake sale',
    outlet: 'KSTP 5 Eyewitness News',
    date: '2025',
    category: 'community',
    summary: 'Community coverage at yum! for the Great Minnesota Bake Sale benefitting Open Arms of Minnesota.',
    href: 'https://kstp.com/special-coverage/minnesota-live/great-minnesota-bake-sale-2/',
  },
  {
    title: 'woodbury opening feature',
    outlet: 'Woodbury Magazine',
    date: '2023',
    category: 'growth',
    summary: 'A family-business feature on bringing yum! to its fourth location: “we put a lot of love into everything.”',
    href: 'https://woodburymag.com/yum-kitchen-and-bakery-is-set-to-open-this-summer/',
  },
  {
    title: 'yum! expands to woodbury',
    outlet: 'Axios Twin Cities',
    date: '2023',
    category: 'growth',
    summary: 'Axios covered the fourth location: the “same food menu” with an expanded drink selection and a 40 to 45 seat patio.',
    href: 'https://www.axios.com/local/twin-cities/2023/06/27/restaurant-roundup-yum-kitchen-expands-daves-hot-chicken-lowry-hill-meats',
  },
] as const;

export const pressEntries = [
  {
    headline: 'top bakery treats in the twin cities',
    outlet: 'Star Tribune',
    date: '2023',
    category: 'bakery and desserts',
    href: 'https://yumkitchen.com/top-bakeries-in-the-twin-cities/',
  },
  {
    headline: 'coming to Woodbury',
    outlet: 'Pioneer Press',
    date: '2023',
    category: 'growth',
    href: 'https://yumkitchen.com/coming-to-woodbury/',
  },
  {
    headline: 'pick up picnic eats',
    outlet: 'Fox 9 Good Day',
    date: '2023',
    category: 'seasonal and catering',
    href: 'https://yumkitchen.com/pick-up-picnic-eats/',
  },
  {
    headline: 'where to eat before a Minnesota United game',
    outlet: 'Visit Saint Paul',
    date: '2023',
    category: 'community',
    href: 'https://yumkitchen.com/pregame-mnufc-at-yum-st-paul/',
  },
  {
    headline: 'best patios in the twin cities',
    outlet: 'WCCO / CBS News',
    date: '2023',
    category: 'community',
    href: 'https://yumkitchen.com/best-patios-in-the-twin-cities/',
  },
  {
    headline: 'passover friendly food',
    outlet: 'Star Tribune',
    date: '2023',
    category: 'seasonal and catering',
    href: 'https://yumkitchen.com/passover-friendly-food/',
  },
  {
    headline: '5 best things the Star Tribune food critics ate this week',
    outlet: 'Star Tribune',
    date: '2023',
    category: 'critic mentions',
    href: 'https://yumkitchen.com/5-best-things-the-startribune-food-critics-ate-this-week/',
  },
  {
    headline: 'top chocolate chip cookies in the Twin Cities',
    outlet: 'Star Tribune',
    date: '2023',
    category: 'critic mentions',
    href: 'https://yumkitchen.com/top-15-best-chocolate-chip-cookies-in-the-twin-cities/',
  },
  {
    headline: 'where to pick up local soup',
    outlet: 'Mpls.St.Paul Magazine',
    date: '2023',
    category: 'awards and lists',
    href: 'https://yumkitchen.com/where-to-pick-up-local-soup/',
  },
  {
    headline: 'yum! at Taste of the Twin Cities',
    outlet: 'KSTP / Minnesota Live',
    date: '2023',
    category: 'community',
    href: 'https://yumkitchen.com/yum-at-taste-of-the-twin-cities/',
  },
  {
    headline: '14 best restaurants in Minnetonka, MN',
    outlet: 'Birch',
    date: '2023',
    category: 'awards and lists',
    href: 'https://yumkitchen.com/14-best-restaurants-in-minnetonka-mn/',
  },
  {
    headline: 'best business lunch in the Twin Cities',
    outlet: 'Pioneer Press',
    date: '2023',
    category: 'awards and lists',
    href: 'https://yumkitchen.com/best-business-lunch-in-the-twin-cities/',
  },
  {
    headline: 'Patti on DeRusha Eats',
    outlet: 'DeRusha Eats',
    date: '2023',
    category: 'tv and founder story',
    href: 'https://yumkitchen.com/derusha-eats-feature/',
  },
  {
    headline: 'celebrate Rosh Hashanah with yum!',
    outlet: 'Eater Twin Cities',
    date: '2022',
    category: 'seasonal and catering',
    href: 'https://yumkitchen.com/celebrate-rosh-hashanah-with-yum/',
  },
  {
    headline: 'breakfast with Megs and Eggs',
    outlet: 'KSTP',
    date: '2022',
    category: 'tv and founder story',
    href: 'https://yumkitchen.com/breakfast-with-megs-and-eggs/',
  },
  {
    headline: "critic's choice",
    outlet: 'Mpls.St.Paul Magazine',
    date: '2022',
    category: 'awards and lists',
    href: 'https://yumkitchen.com/critics-choice/',
  },
  {
    headline: 'inside yum!',
    outlet: 'Desrochers Realty (YouTube)',
    date: '2022',
    category: 'tv and founder story',
    href: 'https://yumkitchen.com/inside-yum/',
  },
  {
    headline: 'Patti on motivation',
    outlet: 'The Fitness King (YouTube)',
    date: '2022',
    category: 'tv and founder story',
    href: 'https://yumkitchen.com/patti-on-motivation/',
  },
  {
    headline: "yum!'s new location",
    outlet: 'Pioneer Press',
    date: '2021',
    category: 'growth',
    href: 'https://yumkitchen.com/235-2/',
  },
] satisfies ReadonlyArray<{
  headline: string;
  outlet: string;
  date: string;
  category: PressCategory;
  href: string;
}>;

export const formSubjects = {
  contact: 'Contact form',
  catering: 'Catering note',
  cake: 'Patticake and cake note',
  careers: 'Career application',
  accessibility: 'Accessibility feedback',
} as const;
