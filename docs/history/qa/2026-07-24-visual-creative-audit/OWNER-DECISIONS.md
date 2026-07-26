# Owner decisions: visual/creative audit round

Everything from the 2026-07-24 audit round that cannot be closed by an engineer, in one place. Prepared 2026-07-26 on branch `visual-creative-audit-fixes`.

Nothing here is a blocker on the branch as a whole. Items in section A block **deploying two specific pages**; everything else is a product or asset decision that can land later.

## A. Blocks deploy: unresolved placeholders

These render as visible bracketed text on the live page, so they cannot ship silently, but they also cannot ship at all. Each is a factual and liability statement about the business, not copy, which is why no engineer picked a value.

| # | Decision | Where | Current placeholder |
|---|---|---|---|
| A1 | WCAG conformance target, and whether the framing is "working to conform to" or "conforms to" | `yumkitchen-web/app/accessibility-statement/page.tsx:20`, rendered at line 48 | `[OWNER SIGN-OFF: WCAG conformance target, for example WCAG 2.1 Level AA]` |
| A2 | Response time for an accessibility issue | `yumkitchen-web/app/accessibility-statement/page.tsx:21`, rendered at line 64 | `[OWNER SIGN-OFF: response-time commitment, for example within 2 business days]` |
| A3 | General reply time for any form submission | `yumkitchen-web/app/thank-you/page.tsx:21`, rendered at line 61 | `[OWNER SIGN-OFF: response-time commitment, for example within 2 business days]` |

A2 and A3 can be the same value. If they are, they should be hoisted into a single constant in `lib/site.ts` rather than kept in two files.

**What the accessibility statement already claims, all verified against this repo, so these need no sign-off:** the axe-core gate over 15 routes that fails the PR on any serious or critical violation, the skip link in `SiteShell`, reduced-motion support via `MotionConfig reducedMotion="user"` plus the `noscript` fallback, and labelled form fields with announced errors. A Lighthouse score claim was deliberately left out, because `verify.sh` enforces its accessibility threshold on the homepage only, so "scores 100 everywhere" could not be supported.

## B. Product decisions

**B1. `/thank-you` is orphaned. Wire it up, or delete it?**

Not an audit finding, found during this round. Nothing in `app/`, `components/`, `lib/`, or `scripts/` links or redirects to `/thank-you`. `InquiryForm` shows an inline success message and resets, so no visitor has ever reached this page.

The page now has a response-time line and per-kind next steps (catering, cake, careers, accessibility), branching on an optional `?kind=` param, with the gift-card upsell suppressed after an accessibility complaint. All of it is inert until something redirects there.

- To activate: `InquiryForm.onSubmit` redirects to `/thank-you?kind={kind}` on success instead of, or after, the inline message. One small change, but it alters the conversion flow on every form on the site, which is why it was not done unilaterally.
- To drop: delete the page. The work is small and recoverable from git.

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
- DNS cutover go, and setting `NEXT_PUBLIC_YUM_HOST_ROUTING=1` in Vercel at cutover time
- Zach-supplied data: dietary tags, location amenities, per-location SEO copy, menu CMS
