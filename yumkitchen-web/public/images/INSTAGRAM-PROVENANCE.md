# Instagram-sourced photography (`yum-ig-*.jpg`)

Imported 2026-07-26 from the brand's own Instagram account, `@yumkitchen` (yum! Kitchen & Bakery), via the Apify `apify/instagram-scraper` actor. Zach confirmed rights, including likeness rights for the photos showing people, before import.

## Why these exist

The site had a same-page photo repetition problem: several photos rendered two or three times on a single page, and the repo held only two genuinely unused, usable restaurant photos. These 23 files are the new material that closes that gap.

## Constraints, read before using these

- **Resolution ceiling.** These are 1080x1080, 1080x1350, or (one) 1350x1688. The repo's own photography is 1600x2400. Use these for tiles, cards, chips, and rail items. **Do not use them for full-bleed heroes**, where they will visibly soften. Every location-page hero still needs real high-resolution photography.
- **Instagram's auto-generated alt text is unreliable** and must not be copied. It described the lemon chicken plate as "fish and chips". All alt text in the codebase for these files was written from the post captions (yum!'s own words) after looking at each image.
- These are separate from `lib/ugc-rights-ledger.json`, which gates *customer* stories and photos and remains fail-closed. These are brand-owned account posts, not customer UGC. Do not record them in the ledger and do not treat this file as a precedent for publishing customer content.

## Index

| File | Post | Shows |
|---|---|---|
| `yum-ig-angel-food-cupcake.jpg` | DZ4r5tsjVm7 | angel food cupcakes with strawberries |
| `yum-ig-bakers-man-cake.jpg` | Da-NWFlCDf3 | baker's man three-layer chocolate cake, whole and sliced |
| `yum-ig-behind-the-counter.jpg` | DZ91cU7DDZL | three team members in chef coats behind the counter |
| `yum-ig-blueberry-salad.jpg` | DaKtaf8CGoG | large blueberry salad packed to go |
| `yum-ig-california-scramble.jpg` | Da7oiXsD3I9 | california scramble with greens and toast |
| `yum-ig-community-highres.jpg` | DZqEVLwBcn8 | guests eating at the counter, street view behind |
| `yum-ig-corn-chowder.jpg` | DbIggDZDV2b | corn chowder |
| `yum-ig-english-muffins.jpg` | DZ7QpK5AcHF | yum! english muffins in branded packaging |
| `yum-ig-farm-scramble.jpg` | DbNqGXXjPD5 | farm scramble with roasted potatoes |
| `yum-ig-gazpacho.jpg` | DaP3BkUDX6L | gazpacho with bread |
| `yum-ig-lemon-chicken-plate.jpg` | DbDW7XKiKpq | lemon chicken with roasted potatoes and broccolini |
| `yum-ig-mahi-tacos.jpg` | DaAaPv3CLji | baja mahi taco |
| `yum-ig-nut-goodley-bar.jpg` | DbAyHWXiKiR | nut goodley bar, cut through |
| `yum-ig-patticake-moment.jpg` | DanCJNpCHx9 | a child eating a slice of patticake |
| `yum-ig-patticake-party.jpg` | Da5Dt8nGz0Y | a long table of plated cake slices at an event |
| `yum-ig-rachel-sandwich.jpg` | DaaKK9xjcNG | rachel sandwich with chips and a pickle |
| `yum-ig-raspberry-streusel.jpg` | Daz6I6hAfLC | raspberry streusel muffin |
| `yum-ig-saint-paul-porch.jpg` | Da2e6bpDYF4 | the yum! st. paul porch, guests at outdoor tables |
| `yum-ig-scones.jpg` | DaIIqW0DOJX | blueberry scone |
| `yum-ig-tomato-trio.jpg` | DbLFWn8jSeH | tomato cubed: burrata, heirloom tomatoes, basil |
| `yum-ig-watermelon-feta.jpg` | DaLKj2Nhrm6 | watermelon feta salad, the largest file at 1350x1688 |
| `yum-ig-wedge-salad.jpg` | DakdWfLAVv8 | wedge starter salad |
| `yum-ig-yum-breakfast-plate.jpg` | DaFj00SjX21 | yum! breakfast with sausage, eggs, potatoes, toast |

## Second pass, 16 more dishes

A deeper pull (185 posts) added photos for dishes the first pass missed: buffalo chicken fingers, coconut curry, gumbo, lemon cream pasta, grilled chicken club, tuna melt, turkey focaccia, open-faced runny egg club, yum! veggie sandwich, amablu crusted filet, salmon hash, granola, cinnamon toast, s'more brownie, dirt cupcake in a jar, and yum! cupcakes. Each caption names the dish, and each image was opened and checked against the menu description before use.

**Two were downloaded and then rejected**, and should not be re-imported without a decision from Zach: the "french fries" post (`DXOvc1dD_XT`) and the "fish & chips" post (`DU-p0xpj-yN`). Both show serving paper printed **"Village Post"**, which is not yum! branding, so neither plate can be confirmed as a yum! item no matter what the caption says. They may be reposted content. That is the standard for this whole set: the caption alone is not enough, the photo has to hold up.

## From the live site (`yum-live-*.jpg`)

Five dishes came from yum!'s own current site at yumkitchen.com, where the filenames name the dish: avocado toast, crunchy french toast, matzah ball soup, salad sampler, and szechuan salmon. These are 1200 to 2000px, better than the Instagram set, and were converted from PNG to JPEG. The avocado toast photo shows an egg, greens, and salmon, which the menu lists as its add-ons, so the alt text says so.

Post URLs follow the pattern `https://www.instagram.com/p/<code>/`.
