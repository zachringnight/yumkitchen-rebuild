import { cakes, demoShippingFlat, type CakeFormat } from '@/lib/patticake/catalog';

// ---------------------------------------------------------------------------
// Demo cart + gifting store, backed by localStorage.
// External store (useSyncExternalStore compatible) so it hydrates cleanly under
// SSR. The single backend seam is `submitOrder`, swapped for the real commerce
// API at go-live.
// ---------------------------------------------------------------------------

const CART_KEY = 'patticake-cart-v1';
const RECIPIENTS_KEY = 'patticake-recipients-v1';
const LAST_ORDER_KEY = 'patticake-last-order-v1';

export type CartItem = {
  id: string;
  cakeSlug: string;
  name: string;
  format: CakeFormat;
  formatLabel: string;
  unitPrice: number; // cents
  image: string;
  occasion: string;
  qty: number;
};

export type Recipient = {
  id: string;
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
};

export type OrderDetails = {
  recipients: Recipient[];
  deliveryDate: string;
  giftMessage: string;
  senderName: string;
  senderEmail: string;
};

export type PlacedOrder = OrderDetails & {
  orderNumber: string;
  items: CartItem[];
  itemsSubtotal: number;
  shipping: number;
  total: number;
  placedAtLabel: string;
};

export type CartState = {
  items: CartItem[];
  recipients: Recipient[];
  lastOrder: PlacedOrder | null;
  drawerOpen: boolean;
};

const SERVER_STATE: CartState = { items: [], recipients: [], lastOrder: null, drawerOpen: false };

let state: CartState = SERVER_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // demo: ignore quota/serialization errors
  }
}

function ensureHydrated() {
  if (hydrated || typeof window === 'undefined') return;
  state = {
    items: readJson<CartItem[]>(CART_KEY, []),
    recipients: readJson<Recipient[]>(RECIPIENTS_KEY, []),
    lastOrder: readJson<PlacedOrder | null>(LAST_ORDER_KEY, null),
    drawerOpen: false,
  };
  hydrated = true;
}

function setState(patch: Partial<CartState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void): () => void {
  ensureHydrated();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getSnapshot(): CartState {
  ensureHydrated();
  return state;
}

export function getServerSnapshot(): CartState {
  return SERVER_STATE;
}

// --- actions ---------------------------------------------------------------

export function openDrawer() {
  setState({ drawerOpen: true });
}

export function closeDrawer() {
  setState({ drawerOpen: false });
}

export function addItem(input: { cakeSlug: string; format: CakeFormat; occasion: string; qty: number }) {
  ensureHydrated();
  const cake = cakes.find((c) => c.slug === input.cakeSlug);
  const variant = cake?.variants.find((v) => v.format === input.format);
  if (!cake || !variant) return;
  const id = `${input.cakeSlug}:${input.format}`;
  const existing = state.items.find((i) => i.id === id);
  const items = existing
    ? state.items.map((i) => (i.id === id ? { ...i, qty: i.qty + input.qty, occasion: input.occasion } : i))
    : [
        ...state.items,
        {
          id,
          cakeSlug: input.cakeSlug,
          name: cake.name,
          format: input.format,
          formatLabel: variant.label,
          unitPrice: variant.price,
          image: cake.image,
          occasion: input.occasion,
          qty: input.qty,
        },
      ];
  writeJson(CART_KEY, items);
  setState({ items, drawerOpen: true });
}

export function updateQty(id: string, qty: number) {
  const items = state.items.flatMap((i) => (i.id === id ? (qty <= 0 ? [] : [{ ...i, qty }]) : [i]));
  writeJson(CART_KEY, items);
  setState({ items });
}

export function removeItem(id: string) {
  const items = state.items.filter((i) => i.id !== id);
  writeJson(CART_KEY, items);
  setState({ items });
}

export function clear() {
  writeJson(CART_KEY, []);
  setState({ items: [] });
}

export function saveRecipient(r: Omit<Recipient, 'id'>): Recipient {
  ensureHydrated();
  const dupe = state.recipients.find((p) => p.name === r.name && p.address1 === r.address1 && p.zip === r.zip);
  if (dupe) return dupe;
  const created: Recipient = { ...r, id: `r-${Date.now().toString(36)}-${state.recipients.length}` };
  const recipients = [...state.recipients, created];
  writeJson(RECIPIENTS_KEY, recipients);
  setState({ recipients });
  return created;
}

export function reorder(order: PlacedOrder) {
  const items = order.items.map((i) => ({ ...i }));
  writeJson(CART_KEY, items);
  setState({ items, drawerOpen: true });
}

export function shippingFor(recipientCount: number): number {
  return demoShippingFlat * Math.max(1, recipientCount);
}

export function submitOrder(details: OrderDetails): Promise<PlacedOrder> {
  return new Promise<PlacedOrder>((resolve) => {
    // Simulated backend latency. Real commerce call goes here at go-live.
    setTimeout(() => {
      const recipientCount = Math.max(1, details.recipients.length);
      const shipping = demoShippingFlat * recipientCount;
      const subtotal = state.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
      const stamp = Date.now();
      const orderNumber = `PC-${stamp.toString(36).toUpperCase().slice(-6)}`;
      const placedAtLabel = new Date(stamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const order: PlacedOrder = {
        ...details,
        orderNumber,
        items: state.items.map((i) => ({ ...i })),
        itemsSubtotal: subtotal,
        shipping,
        total: subtotal + shipping,
        placedAtLabel,
      };
      writeJson(LAST_ORDER_KEY, order);
      writeJson(CART_KEY, []);
      setState({ items: [], lastOrder: order, drawerOpen: false });
      resolve(order);
    }, 900);
  });
}
