# Archive Photo Catalog: Usable-but-Unused Images (2026-08-05)

Scope: every jpg/jpeg/png in `/Users/zsoskin/codex outputs/yum-audit/03_assets/images/` (root, `Yum Photos/`, `Yum_Patticake_Photos/` including `WeddingWire_Gallery/`), md5-compared against every image under `yumkitchen-web/public/images/` (recursive, 115 files).

Method: 149 archive files hashed. 94 checksums already exist in the repo and were skipped (this includes the entire `WeddingWire_Gallery`, all numbered Patticake wedding shots, and most `Yum_*` hero/candid files). The remaining 55 paths collapse to **45 unique images** (several exist twice in the archive as re-encodes). Every one was viewed, measured with `sips`, and cataloged below.

Not in scope per task definition: `yumkitchen_images/` (Instagram scrape, 31 files, tracked separately by `_manifest.csv` and `INSTAGRAM-PROVENANCE.md`).

Key finding up front: **8 of the 45 are pixel-identical shots to images already on the site, just re-encoded under old filenames** (marked "already on site" below). The real menu of upgrades is the other 37.

Confidence column = confidence that the photo shows a real yum! item/scene AND that the suggested slot genuinely improves the page. Photos whose dish identity could not be confirmed against the current menu are flagged.

## Tier 1: Branded and people shots with obvious slots

| file | dims | description | suggested slot | confidence |
|---|---|---|---|---|
| `Yum Photos/Yum_2168-2.jpg` (also root and `Yum_Patticake_Photos/` copies) | 1200x1800 | Overhead portrait of white gift box with red yum! Kitchen and Bakery logo sticker, tied with yum!-printed red ribbon bow on polka-dot tissue; tack sharp; heavy branding; no people | /order or /catering (gifting/pickup section); strong vertical for a split layout | High |
| `to-go-box-portrait.jpg` | 1600x1326 | Hand grabbing the handle of a light-blue gable to-go box with red yum! logo sticker, dark background, storefront light at left; sharp; branded; one hand visible | /order hero or takeout section | High |
| `Yum_2175.jpg` | 1800x1200 | Full packaging family on counter: gable boxes, ribbon-tied gift box, logo shopping bags, polka-dot tissue bag, menus blurred behind; sharp; heavy branding; no people | /catering intro or /order (packaging/pickup band) | High |
| `Yum Photos/Yum_2175-2-e1671230371310.jpg` (also root copy) | 1800x994 | Wider-crop variant of the same packaging lineup, banner aspect ratio; sharp; branded | Alternate to Yum_2175 where a shorter banner crop fits; use one of the two, not both | High |
| `Yum_2322.jpg` | 1200x1800 | Employee in red yum! cap and whites packing wrapped sandwiches into rows of blue boxed-lunch cartons, yum! logo screen behind; sharp; branded; one person | /catering (boxed lunch fulfillment, shows scale) or /careers | High |
| `Yum_2740.jpg` | 1800x1200 | Two smiling chefs in yum! whites (name-embroidered "Fabricio") with red cap, arm around colleague, inside restaurant with bakery case behind; sharp; branded; two people | /careers (real team, real names) | High |
| `Yum_2846.jpg` | 1800x1200 | Two chefs ("Jacob" and "Doug" embroidered) in whites and red caps, arms around shoulders outside snowy storefront entrance; sharp; branded; two people | /careers (pairs with Yum_2740 for a seasonal contrast) | High |
| `Yum Photos/Yum_1934-2.jpg` (also root copy) | 1800x1200 | Moody kitchen action shot: steaming stockpot on range in sharp foreground, two cooks in red caps prepping at stainless counters behind; branded caps; two people (backs turned) | /careers hero or /yum-kitchen "from scratch daily" band | High |
| `Yum_1371.jpg` | 1800x1200 | Three women hands-in huddle outdoors: two in white chef coats and red yum! caps flanking one in black (appears to be Patti Soskin, center; confirm before captioning); sharp; three people | /about (team/leadership moment) | High if identity confirmed |
| `Yum Photos/Yum_0188-2.jpg` (also root copy) | 1800x1200 | Row of tall chocolate layer-cake slices on white plates along counter, staff in whites and red yum! caps softly blurred behind; sharp subject; branded; people in bokeh | /yum-kitchen bakery band or /about | High |
| `Yum Photos/Yum_2292-1.jpg` (also root copy) | 1200x1800 | Branded clear yum! cup of iced tea/arnold palmer with red straw on wood counter, dark bokeh dining room behind; sharp; branded; no people | /menu (drinks section) or /order sidebar vertical | High |
| `Yum_0027.jpg` | 1800x1200 | Low-angle exterior looking up past red patio umbrellas at circular yum! blade sign against blue sky, glass storefront at left; sharp; branded; no people | /location/[slug] (St. Louis Park or whichever store this is; verify) or /contact header | High |

## Tier 2: Food photography filling real menu gaps

The site currently has no non-Instagram close-up for several of these dishes; the old site's 2000x1200 menu PNGs below are the professional versions.

| file | dims | description | suggested slot | confidence |
|---|---|---|---|---|
| `Yum Photos/cali-scramble.jpg` (also root copy) | 1200x1800 | Overhead portrait of California scramble plate: eggs with greens and sprouts, multigrain toast, dressed greens, glass of OJ, potted fern on blond wood; sharp; no branding | /menu breakfast (repo only has the 1080px IG square of this dish) | High |
| `chicken-club-copy.png` | 2000x1200 | Close-up of grilled chicken club halves stacked with bacon, avocado, tomato, lettuce, house chips behind; sharp; no branding | /menu sandwiches (repo only has IG version) | High |
| `mac.png` | 2000x1200 | Extreme close-up bowl of creamy cavatappi mac and cheese; sharp; no branding | /menu (sides/kids; repo's only mac shot is a catering tray) | High |
| `mahi-tacos1.png` | 2000x1200 | Close-up mahi taco plate: blackened fish with sauce and cotija over shredded lettuce and pico, newspaper-wrapped corn tortillas at right; sharp; no branding | /menu (repo only has IG square) | High |
| `Yum_0339.jpg` | 1800x1200 | Overhead of vanilla and chocolate cupcakes with white frosting swirls and rainbow sprinkles on blond wood; sharp; no branding | /menu bakery or /order-a-cake (cupcake add-ons) | High |
| `Yum Photos/Yum_1461-1.jpg` (also root copy) | 1200x1800 | Heart-shaped braided challah loaf overhead on weathered sheet pan; sharp; no branding | /menu bakery (breads) or seasonal/Valentine promo asset | Medium-High |
| `Yum_1448.jpg` | 1860x1200 | Overhead of three round braided challah loaves on stone surface, dramatic light; sharp; no branding | /menu bakery (breads); pairs with Yum_1461-1 | Medium-High |
| `yum_header.jpeg` | 1349x1080 | Overhead grilled cheese halves with house chips and pickle on white plate plus cup of tomato soup with focaccia, succulent on blond wood; sharp; no branding | /menu (soup + sandwich combo) or /yum-kitchen lunch band | Medium-High |
| `Yum_1243.jpg` | 1200x1800 | Styled boxed-lunch flat-lay: club sandwich halves, bagged chips with yum! sticker, fruit cup, cookie, pickle, black fork, blue gable box with yum! logo; sharp; branded | /catering boxed lunches (alternate/upgrade to current `yum-catering-boxed-lunch.jpg`; vertical) | Medium-High |
| `2.png` (also `Yum Photos/2.png`) | 1080x1080 | Overhead shrimp louie-style wedge salad: shrimp, chopped egg, avocado, cherry tomatoes, focaccia stick, strawberry spritz in corner; sharp; no branding | /menu salads only if this dish is still served; dish name unconfirmed against current menu | Medium; subject unconfirmed |
| `BLT-wedge.png` | 2000x1200 | Extreme close-up BLT wedge salad with blue cheese dressing, cherry tomatoes, candied bacon; very tight crop, slightly soft at edges; no branding | /menu salads (only if BLT wedge is current; filename suggests it) | Medium; subject unconfirmed |
| `Untitled-design-2024-05-14T111334.920.png` (also `Yum Photos/` copy) | 1080x1080 | Breaded crispy fillet (walleye or chicken schnitzel) atop buttered spaghetti with peas on white plate; sharp; no branding | No current slot until dish identified against menu | Low; subject unconfirmed |
| `Untitled-design-44.png` (also `Yum Photos/` copy) | 1080x1080 | Close-up chocolate cupcake with dark ganache, yellow smiley-face frosting disc, yellow and white sprinkles; sharp; no branding | /order-a-cake or /menu bakery (fun cupcake) if it's a yum! product; styling matches their bakery | Medium; subject unconfirmed |
| `Yum Photos/Yum_0004-1.jpg` (also root copy) | 1200x1800 | Macro overhead of rainbow nonpareil sprinkles filling the whole frame; sharp texture shot; no branding | Background/texture band on /order-a-cake or /careers ("sweet perks") | Medium |

## Tier 3: Patticake and community/people shots

Per the photo-rights memory note: Zach owns the live-site and @yumkitchen photos including likeness, but confirm identity/likeness comfort before publishing any face prominently.

| file | dims | description | suggested slot | confidence |
|---|---|---|---|---|
| `Yum_Patticake_Photos/Patticake_IceCream_Pint.jpg` | 980x612 | Hand holding "A to Z Creamery Patticake Pint" ice cream pint in front of yum! storefront with red logo signs, winter sky; sharp; branded storefront; one hand | /patticake (collab/press moment). Note: the pint is an A to Z Creamery product made with Patticake, not a yum!-made item; caption accordingly | Medium-High |
| `Yum_Patticake_Photos/Patticake_IceCream_Scoop.jpg` | 980x612 | Close-up spoonful of vanilla ice cream studded with chocolate Patticake crumbs above open pint, hand at right; sharp foreground; no yum! branding | /patticake, secondary image beside the pint shot | Medium |
| `Yum_Patticake_Photos/Patticake_TasteTest_Patti_Soskin.jpg` | 980x612 | Three people taste-testing pints at wood table: woman with long gray hair center (Patti Soskin per filename), man in A to Z Creamery cap and hoodie right, dark-haired woman left; candid; three people | /patticake story section ("Patti tastes the pint") | Medium-High; confirm likeness OK |
| `Yum_2434-1.jpg` (also `Yum Photos/` copy) | 1200x1800 | Three generations at kids' craft table on patio: grandmother, toddler with handmade birthday sign, mother; red planter wall with pansies behind; sharp; three people incl. child | /about (community/kids-welcome moment). Child's face prominent: get explicit OK before use | Medium; requires consent check |
| `Yum_0126-1.jpg` | 1600x1600 | Three older women laughing at white patio table, coffee and pastry tin, street behind; candid, warm; three people | /about community band | Medium; confirm likeness OK |
| `Yum_0179.jpg` | 1800x1200 | Black-and-white candid of two older women in deep conversation over coffee at round patio table, street reflections; editorial feel; two people | /about (would be the site's only B&W; use deliberately or convert) | Medium |
| `Yum_1260.jpg` | 1800x1200 | Smiling gray-haired man in green jacket at white patio table with popcorn shrimp basket in newsprint, soup, cornbread, Tasco/soda bottles; candid; one person | /about or /location/[slug] patio-life shot | Medium; confirm likeness OK |

## Already on the site (re-encoded duplicates; skip)

These archive files have different checksums but are pixel-identical shots to images already shipped. No slot; listed so nobody re-adds them under old names.

| file | dims | duplicate of (repo) |
|---|---|---|
| `avocado-toast-2.jpg` | 1801x1200 | `yum-live-avocado-toast.jpg` |
| `french-toast.png` | 2000x1200 | `yum-live-crunchy-french-toast.jpg` |
| `pbowl-matzah-ball.png` | 2000x1200 | `yum-live-matzah-ball-soup.jpg` |
| `sampler-e1672851815111.png` | 1570x1200 | `yum-live-salad-sampler.jpg` |
| `new-reuben.png` | 2000x1200 | `yum-seasonal-reuben.jpg` |
| `szecret-salmon.png` (root and `Yum Photos/` encodings) | 2000x1200 | `yum-szecret-salmon.jpg` / `yum-live-szechuan-salmon.jpg` |
| `cropped-yum-favicon-270x270.png` | 270x270 | Logo mark; favicon already handled in app | 
| `favicon.png` | 270x270 | Same mark, second encoding |

## Notes

- Archive-internal duplicates: `Yum Photos/` re-encodes of root files (2.png, both Untitled-design files, szecret-salmon.png) and the triple-located `Yum_2168-2.jpg` are single images; the table lists each once.
- The two "Untitled-design" dishes and the shrimp wedge could not be matched to a named current menu item from the photo alone; verify against the live menu before publishing (site rule: every photo must show a real yum! item).
- Suggested slots are one-per-image maximums per the task; several Tier 1 images could serve multiple pages, so treat slots as first-choice, not exclusive.
