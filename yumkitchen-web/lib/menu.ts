import menuData from './menu-seed.json';

export type MenuItem = {
  name: string;
  prices: string[];
  description: string;
  tags?: string[];
};

export type MenuSection = {
  meal: 'lunch & dinner' | 'breakfast' | 'bakery' | string;
  name: string;
  items: MenuItem[];
};

export type Menu = {
  sections: MenuSection[];
};

export const menu = menuData as Menu;

export function getSectionsByMeal(meal: MenuSection['meal']): MenuSection[] {
  return menu.sections.filter((s) => s.meal === meal);
}

export const menuItemCount = menu.sections.reduce((count, section) => count + section.items.length, 0);

export const menuMeals = Array.from(new Set(menu.sections.map((section) => section.meal)));

export const menuDisclosure =
  'Please tell the team about allergies before ordering. Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness.';

export function getMenuSearchText(item: MenuItem, section: MenuSection): string {
  return [item.name, item.description, section.name, section.meal, ...(item.tags ?? [])]
    .join(' ')
    .toLowerCase();
}

export function getPriceLabel(prices: string[]): string {
  if (prices.length === 0) return '';
  if (prices.length === 1) return `$${prices[0]}`;
  return prices.map((price) => `$${price}`).join(' / ');
}

export function menuJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'yum! Kitchen and Bakery menu',
    hasMenuSection: menu.sections.map((section) => ({
      '@type': 'MenuSection',
      name: section.name,
      hasMenuItem: section.items.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
        ...(item.prices.length === 1
          ? { offers: { '@type': 'Offer', price: item.prices[0], priceCurrency: 'USD' } }
          : {}),
      })),
    })),
  };
}
