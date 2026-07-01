# Yum Upgrade Round 2 run report (2026-07-01)

## Result
Shipped clean. VERIFY PASSED (axe 0 serious/critical on all 15 routes, Lighthouse mobile 100/100/100/100 on the homepage).

## Done-checks
| Task | Check | Result |
|------|-------|--------|
| 01 repo hygiene | fetch --prune, main at 098f2fb, 4 shipped branches deleted (2 remote), 9 .bak + 6 .DS_Store removed, working tree clean | pass |
| 02 OG images (A5) | about, careers, news, contact now use real photos in lib/site.ts pageMeta; files verified in public/images | pass |
| 03 press nofollow (A6) | featured external press links rel="nofollow noopener noreferrer"; archive links to own domain left follow on purpose | pass |
| 04 gift card band (B3) | GiftCardBand on /yum-kitchen (white tone), /menu, all /location pages, /thank-you (compact); Toast URLs exact; click_gift_card_buy/balance events with data-source | pass |
| 05 location routing (G4) | cake and catering inquiries route to YUM_FORMS_TO_<LOCATION> env when set, fallback YUM_FORMS_TO unchanged; DEPLOYMENT.md documents the 4 vars | pass |
| 06 catering FAQ (H4) | 6-question accordion + FAQPage JSON-LD on /catering, copy sourced from existing site facts only | pass |
| 07 gates | verify.sh VERIFY PASSED, rendered Playwright QA desktop+mobile on 5 changed pages, QA_LOG row appended | pass |

## Caught and fixed during gates
- First verify run: 5 serious axe color-contrast violations, all from the new band's body copy (default body gray on blue-tint is ~3.8:1). Fixed with text-ink. Gate re-run clean.
- Rendered QA: the lowercase heading transform rendered standalone "I" as "i" in three FAQ questions. Questions rephrased to avoid the pronoun.
- Rendered QA: on /yum-kitchen the blue band stacked directly on the blue-tint catering callout and read as a seam artifact. Band got a tone prop; homepage uses white.
- Rendered QA soft note applied: items-start on the FAQ grid so closed cards keep natural height.

## Deliberately not done (needs Zach data or taste, do not fabricate)
- C1 dietary filter tags (needs verified GF/vegan/vegetarian/nut-free list; menu-seed has 0 tagged items).
- C2 location amenities (kid-friendly, patio, Wi-Fi) and real dining-room photos.
- A2 location SEO copy to 400-600 words.
- G1 menu CMS. H1 loyalty. H2 holiday menu pages. H3 press kit.
- brand-blue-pass branch + open PR #2: conflicts with main in 3 files, rewrites pinned brand tokens. Keep-or-kill is Zach's call.

## Eyeball list
- Gift card band copy ("share the love", "Give the gift of made from scratch") is new customer-facing brand copy. Family brand, worth Patti-level review.
- FAQ answers assert 24-hour notice, pickup-only, four locations, easy parking. All sourced from existing site copy, but confirm they are still operationally true.
- Per-location routing is inert until YUM_FORMS_TO_* env vars are set. Setting them changes where real customer email lands.
