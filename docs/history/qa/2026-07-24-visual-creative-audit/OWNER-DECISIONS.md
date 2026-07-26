# Owner decisions: visual/creative audit round

Everything from the 2026-07-24 audit round that cannot be closed by an engineer, in one place. Prepared 2026-07-26 on branch `visual-creative-audit-fixes`.

**Nothing here blocks deploy any more.** As of 2026-07-26 every item is an improvement waiting on the owner, not a gate: sections A and B1 were resolved by making the commitments opt-in and wiring the confirmation page, and the rest are asset or product decisions that can land later.

## A. Optional commitments, no longer blocking

**Resolved 2026-07-26: these no longer block deploy.** They were bracketed placeholders that would have rendered as literal `[OWNER SIGN-OFF: ...]` text on live pages. Each is now an opt-in constant: left null the page states only what the repo can back up and makes no claim, and set to an approved value the page names it. Verified across 15 routes that no placeholder text renders anywhere.

| # | Decision | Where | Today | With a value |
|---|---|---|---|---|
| A1 | WCAG conformance target | `app/accessibility-statement/page.tsx` `CONFORMANCE_TARGET` | "We want every guest to be able to use this site, however they browse." No conformance claim. | "We are working to conform to WCAG 2.1 Level AA." |
| A2 | Accessibility reply time | same file, `RESPONSE_TIME` | "We will get back to you." | "We will get back to you within 2 business days." |
| A3 | General reply time | `app/thank-you/page.tsx` `RESPONSE_TIME` | "We reply to every message." | "We reply to every message, usually within 2 business days." |

A2 and A3 can share a value; if they do, hoist them into one constant in `lib/site.ts`.

**What the accessibility statement already claims, all verified against this repo, so none of it needs sign-off:** the axe-core gate over 15 routes that fails the PR on any serious or critical violation, the skip link in `SiteShell`, reduced-motion support via `MotionConfig reducedMotion="user"` plus the `noscript` fallback, and labelled form fields with announced errors. A Lighthouse score claim was deliberately left out, because `verify.sh` enforces its accessibility threshold on the homepage only.

## B. Product decisions

**B1. RESOLVED 2026-07-26: `/thank-you` is wired up.**

`InquiryForm` now redirects to `/thank-you?kind={kind}` after a successful submit, so the per-kind branches are live. The inline success state is still set first, so the confirmation is never blank if navigation is slow, and it is a soft client navigation, so the analytics event stays on the dataLayer. Verified in a real browser: submitting `/contact` lands on `/thank-you?kind=contact`, and all five branches render correctly with the gift-card upsell suppressed only for `kind=accessibility`.

Original finding, for the record: nothing in `app/`, `components/`, `lib/`, or `scripts/` linked or redirected to `/thank-you`, so no visitor had ever reached it.

The page carries an optional reply-time line and per-kind next steps (catering, cake, careers, accessibility), branching on the `?kind=` param, with the gift-card upsell suppressed after an accessibility complaint. The param stays optional, so a visitor landing here directly still gets a sensible neutral page.

**B2. Press and media contact.** There is no press email or phone anywhere in the repo. The rebuilt `/contact` routes press and media inquiries to the general form with a "Press" subject. If a real press address exists, that card should point at it instead.

## C. Photos needed

The round fixed every photo problem that could be fixed with assets already on disk. These three cannot be.

**C1. A photo of Margaret, Woodbury hospitality lead.** Her `/about` card previously used `/images/yum-patti-kelli.jpeg`, whose own filename says it depicts Patti and Kelli. The card now runs text-only, which is honest but plainly worse than the other leader cards. `LeaderCard.image` is optional specifically so this card does not get filled with a borrowed photo.

**C2. A labeled photo of founders Patti and Robbie Soskin together.** The `/about` copy names both and shows neither with a label. `yum-patti-kelli.jpeg` now sits in the founders story section captioned only as far as its filename supports.

Zero-cost possibility worth checking: `/images/yum-location-slp.jpg` shows two people holding a cake outside the original St. Louis Park restaurant. If that is Patti and Robbie, confirming it turns an existing asset into the founders photo.

**C3. Confirm the Hugo leader card photo.** New finding, same class as C1. The Hugo card uses `/images/yum-chef-kitchen.jpg`, a generic filename with nothing in the frame identifying who it depicts. Unlike the Margaret case the filename does not actively contradict the label, so it was left in place, but there is no evidence it shows the person named on the card. Either confirm it or supply a real photo.

## D. Already open before this round, unchanged

Listed only so this file is a complete picture of what needs the owner. See `tasks.md` and `docs/DEPLOYMENT.md`.

- `RESEND_API_KEY` plus a live form test
- GTM/GA4 DebugView confirmation
- (DNS cutover was previously listed here. Removed 2026-07-26: no cutover is planned or scheduled, so `NEXT_PUBLIC_YUM_HOST_ROUTING` is not pending work.)
- Zach-supplied data: dietary tags, location amenities, per-location SEO copy, menu CMS
