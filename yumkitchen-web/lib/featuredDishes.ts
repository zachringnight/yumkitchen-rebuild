import { getPriceLabel, menu } from './menu';

// The featured-dish rail on the yum! home page.
//
// Two things are happening here and they are deliberately separated. WHICH six
// dishes appear, and which photo each one gets, is an editorial choice: the
// photos are picked so they do not repeat the seasonal favorites grid or the
// real-moments collage further down the same page, so they are not always the
// seed's own photo for that item. WHAT each card says is not a choice at all.
// Name, price, and copy are resolved from lib/menu.ts at build time, so a menu
// update cannot leave this surface quietly stale, and no one can hand-write a
// description the menu does not make.
//
// Resolution is fail-loud. Rename or remove one of these items in the seed and
// the build stops with the name that no longer resolves, rather than shipping a
// dish yum! no longer serves.

type FeaturedPick = {
  // Section and name together, because item names repeat across the seed
  // ("mac & cheese" is in both pasta and family style).
  section: string;
  name: string;
  // The rail's own nav label, not a seed field.
  category: string;
  image: string;
  position?: string;
};

export type FeaturedDish = {
  name: string;
  category: string;
  price: string;
  copy?: string;
  image: string;
  position?: string;
};

const picks: readonly FeaturedPick[] = [
  { section: 'breakfast', name: 'california scramble', category: 'breakfast', image: '/images/yum-breakfast.jpg' },
  { section: 'sandwiches', name: 'yum! veggie', category: 'sandwiches', image: '/images/yum-catering-veggie-platters.jpg' },
  { section: 'entrees', name: 'lemon chicken', category: 'dinner', image: '/images/yum-catering-lemon-chicken.jpg', position: 'object-[50%_38%]' },
  { section: 'soup', name: 'bob’s tomato', category: 'soups', image: '/images/yum-bobs-tomato-soup.jpg' },
  { section: 'pasta', name: 'mac & cheese', category: 'pasta', image: '/images/yum-catering-mac-cheese.jpg' },
  { section: 'pies, bars & cookies', name: 's’more brownie', category: 'bakery', image: '/images/yum-ig-smore-brownie.jpg' },
];

// Expand the seed's shorthand into a sentence without changing what it claims.
// The only edits allowed are mechanical: drop the trailing upsell clause (the
// seed's "add salmon 6.00" prices an add-on, it does not describe the dish),
// expand `w/` and `&`, capitalize, and close with a period. An item the seed
// describes with nothing but a price returns undefined and ships no copy.
function toSentence(description: string): string | undefined {
  const withoutUpsell = description.replace(/\.\s*add\b[\s\S]*$/i, '').trim();
  if (!withoutUpsell) return undefined;

  const expanded = withoutUpsell
    .replace(/\bw\//g, 'with ')
    .replace(/\s*&\s*/g, ' and ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const sentence = expanded.charAt(0).toUpperCase() + expanded.slice(1);
  return sentence.endsWith('.') ? sentence : `${sentence}.`;
}

export const featuredDishes: readonly FeaturedDish[] = picks.map((pick) => {
  const section = menu.sections.find((candidate) => candidate.name === pick.section);
  const item = section?.items.find((candidate) => candidate.name === pick.name);

  if (!item) {
    throw new Error(
      `featuredDishes: "${pick.name}" is no longer in the "${pick.section}" section of menu-seed.json. ` +
        'Pick a dish that is still on the menu rather than leaving the home page advertising one that is not.',
    );
  }

  return {
    name: item.name,
    category: pick.category,
    price: getPriceLabel(item.prices),
    copy: toSentence(item.description),
    image: pick.image,
    ...(pick.position ? { position: pick.position } : {}),
  };
});
