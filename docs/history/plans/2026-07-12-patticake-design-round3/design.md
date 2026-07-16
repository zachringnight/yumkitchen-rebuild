# Patticake design round 3, design

Date: 2026-07-12. Branch: `qa-visual-review-2026-07-09` (stacked on the committed QA round).
Brief: "keep improving the patticake.com website design, creative, ui, ux", within the existing brand (no palette/token, copy-voice, Toast-URL, or slug changes; family brand rule).

## Read of the current state

Full-page before screenshots (desktop + mobile, `/`, `/patticake`, `/order-a-cake`) show a healthy site:
no broken layouts, the polaroid/taped-label visual language is cohesive, mobile sticky CTA already
covers the Patticake surface. What's left is not decoration, it's finishing the signature interaction
and removing self-duplication.

The signature element of the Patticake brand pages is the **message**: floating taped labels in the
hero, the message ribbon, and the interactive message maker ("make it sound like them") where a visitor
types words and sees them piped onto the cake. But the message maker is a **dead end**: the composed
words go nowhere, and the form further down the page asks the visitor to type them again. The strongest
design move this round is to complete that loop, not to add anything new.

## Changes

### R1, the message carries through (signature UX)
`PatticakeMessagePreview` gains a primary action under the preview: **"send these words"**.
Clicking it:
1. fires `click_patticake_use_message` (existing analytics pattern),
2. dispatches a `patticake:cake-message` CustomEvent with the composed message,
3. jumps to the page's form section by setting `location.hash` (native smooth scroll, existing
   `scroll-mt` offsets, and the mobile sticky bar's hash-sync all keep working).

`InquiryForm` (cake kinds only) listens for the event:
- delivery form (`/patticake#delivery-support`): prefills the `giftMessage` field (140-char clamp,
  counter updated) and focuses it with `preventScroll`,
- pickup form (`/order-a-cake#cake-inquiry`): has no gift-message field, so it seeds the message
  textarea with `Words on the cake: "…"`, only appends, never overwrites what a visitor typed.

The component takes a `formHref` prop (`/patticake` passes `#delivery-support`; default
`#cake-inquiry` serves `/order-a-cake`).

### R2, home hero proof strip de-duped
The 2×2 proof grid's first cell is "Patticake", a duplicate of the H1 directly above it. Replaced
with **"made from scratch since 2005"** (grounded: the site footer's long-standing claim). The other
three cells stay.

### R3, home moment-card buttons name the next step
Two of the three cards repeat their own title as the button ("Ship a Cake" title + "Ship a Cake"
button). Buttons now say what actually happens next, matching the forms' vocabulary:
"Start a Shipping Note" / "Start a Pickup Note". The third card already differed and keeps
"Visit yum! Kitchen and Bakery".

### R4, home cross-links the message maker
The filler white card in the "what you get" band ("patticake, made at yum!, shared as the cake
people ask for by name") gains a `btn-link` to the message maker on `/patticake` (section gets
`id="message-maker"`), so the home page points at the signature interaction instead of restating
the brand name a fourth time.

## Explicitly not done (restraint)
- No new bands, no palette or token changes, no motion added (the pages already have a full motion
  system with pause buttons and reduced-motion handling).
- OG crops for Patticake pages (backlog B4), real but invisible in-page; separate round.
- No copy-voice changes beyond the four strings above.

## Verification plan
`bash verify.sh` (typecheck, lint, motion audit, content validation, build, UI smoke, link audit,
axe, Lighthouse) + a new smoke assertion is not added this round; instead the message handoff is
exercised manually via rendered screenshots (before/after in `docs/plans/2026-07-12-patticake-design-round3/`)
and the existing `smoke:ui` must stay green.
