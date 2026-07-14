import type { Transition } from 'motion/react';

// Soft entrance with a slight overshoot that settles — like piped buttercream.
export const frosting: Transition = { type: 'spring', stiffness: 220, damping: 26, mass: 1 };

// Quick, tight feedback for hovers, presses, and word pops.
export const snap: Transition = { type: 'spring', stiffness: 480, damping: 32, mass: 0.7 };
