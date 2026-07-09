'use client';

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import * as store from './store';
import type { CartItem, OrderDetails, PlacedOrder, Recipient } from './store';

export type { CartItem, OrderDetails, PlacedOrder, Recipient } from './store';

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  itemsSubtotal: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (input: { cakeSlug: string; format: import('@/lib/patticake/catalog').CakeFormat; occasion: string; qty: number }) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  recipients: Recipient[];
  saveRecipient: (r: Omit<Recipient, 'id'>) => Recipient;
  lastOrder: PlacedOrder | null;
  reorder: (order: PlacedOrder) => void;
  shippingFor: (recipientCount: number) => number;
  submitOrder: (details: OrderDetails) => Promise<PlacedOrder>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const snap = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = snap.items.reduce((sum, i) => sum + i.qty, 0);
    const itemsSubtotal = snap.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
    return {
      items: snap.items,
      itemCount,
      itemsSubtotal,
      drawerOpen: snap.drawerOpen,
      recipients: snap.recipients,
      lastOrder: snap.lastOrder,
      openDrawer: store.openDrawer,
      closeDrawer: store.closeDrawer,
      addItem: store.addItem,
      updateQty: store.updateQty,
      removeItem: store.removeItem,
      clear: store.clear,
      saveRecipient: store.saveRecipient,
      reorder: store.reorder,
      shippingFor: store.shippingFor,
      submitOrder: store.submitOrder,
    };
  }, [snap]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
