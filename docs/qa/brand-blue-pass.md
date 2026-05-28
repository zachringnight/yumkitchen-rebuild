# Brand Blue Pass QA

## Reference Inputs

- Packaging and marketing board: `/Users/zsoskin/outputs/yum-brand-reference/yum-packaging-marketing-reference-board.png`
- Menu PDF reference: `/Users/zsoskin/outputs/yum-brand-reference/yum-menu-pdf-reference.png`
- Food-truck poster: `/Users/zsoskin/outputs/yum-foodtruck-motion/renders/yum-foodtruck-poster.png`
- Food-truck video: `/Users/zsoskin/outputs/yum-foodtruck-motion/renders/yum-foodtruck-motion.mp4`

## Website Screenshots

- Home desktop: `/Users/zsoskin/outputs/yum-brand-reference/qa/yum-brand-home-desktop.png`
- Home mobile: `/Users/zsoskin/outputs/yum-brand-reference/qa/yum-brand-home-mobile.png`
- Patticake desktop: `/Users/zsoskin/outputs/yum-brand-reference/qa/yum-brand-patticake-desktop.png`
- Patticake mobile: `/Users/zsoskin/outputs/yum-brand-reference/qa/yum-brand-patticake-mobile.png`

## Checks

- Packaging blue is now a visible brand field in the header, footer, homepage support bands, and Patticake national delivery hero.
- Warm white/paper surfaces carry text and ordering content for readability.
- Yum red remains the action and recognition color for the logo, CTAs, and ribbon rules.
- No large black panels were introduced; dark ink is limited to text, vehicle windows, and photo content.
- Patticake page still uses only Patticake/Yum-owned cake photography.
- Mobile Patticake hero shows both primary and secondary actions before the cake image starts below the first viewport.

## Commands

```bash
npm run typecheck
npm run lint
npm run build
```
