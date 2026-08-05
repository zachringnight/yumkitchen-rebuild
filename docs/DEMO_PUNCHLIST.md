# Demo punchlist: yum! and Patticake

Purpose: this build is a demo shown to Patti and Robbie Soskin, not a launch.
Production wiring (live email delivery, analytics destinations, DNS cutover) is
explicitly out of scope. Optimize for how the site reads during a walkthrough.

Started August 5, 2026.

## yum! Kitchen: open, parked behind Patticake work

These are logged and waiting. Patticake work comes first.

### 1. The founders are barely on their own site (blocked on assets)

`/about` names Patti and Robbie in the hero copy and one photo caption. The
"behind the counter" section carries Hugo, Margaret, and Mike, and no founders
card at all.

- There is no labeled photo of Robbie anywhere in the repo.
- The only Patti photo is `/images/yum-patti-kelli.jpeg`, already used twice
  (`app/about/page.tsx`, `components/PatticakeOriginBand.tsx`).

Blocked on Zach supplying photos. Do not substitute another person's photo.
When photos arrive: add a founders card at the top of the "behind the counter"
grid in `lib/site.ts` (`leaderCards`).

### 2. Margaret's card renders text-only (blocked on assets)

`lib/site.ts` `leaderCards` deliberately leaves Margaret's `image` unset because
no photo of her exists. Sitting between two photo cards, it reads as a failed
image load.

Options: a real photo of Margaret, or drop the grid to two cards for the demo
and restore hers later. Owner's call.

### 3. The bare link opens Patticake, not yum!

`NEXT_PUBLIC_YUM_HOST_ROUTING` is unset, so `lib/hostRouting.ts` leaves host
routing off and `/` serves the Patticake home on every host except
`yumkitchen.com`. On any preview URL, the first two screens Patti and Robbie see
are the Patticake password gate and the Patticake home.

Options: send them straight to `/yum-kitchen`, or set
`NEXT_PUBLIC_YUM_HOST_ROUTING=1` on the preview deploy so it behaves like the
real domain. Owner's call; not yet made.

## Patticake: verified working, do not touch

The whole commerce path was driven end to end on August 5, 2026 and works:
`/patticake` add to box, `/patticake/checkout` (multi-recipient, order summary,
shipping math), and `/patticake/checkout/confirmation`. A test order produced
`PC-GJNCPO`, $59.95 + $14.95 = $74.90, with the delivery date, ship-to address,
and gift note all echoed back. Demo disclaimers are honest and visible on both
the checkout and the confirmation. The empty-box state is handled.

Earliest delivery date is enforced at three days out, matching the "delivery
dates start three days out" copy. This is the strongest thing to show.

## Patticake: fixed

- The required "Pickup restaurant" select on `/order-a-cake` offered an **N/A**
  option. It read as leftover test data and, being a non-empty value, slipped
  past the required check and degraded recipient routing to the fallback inbox.
  `components/forms/InquiryForm.tsx` now renders N/A only when the location
  field is optional, so it stays on `/contact` and is gone from the cake pickup
  and catering forms.
- The checkout State select had no `autoComplete`, so browser autofill filled
  every address field except state. Now `address-level1`.

## Patticake: open, needs an owner call

### 1. The homepage asks the same two questions four times

`/` carries eight calls to action that resolve to two destinations:
`/patticake#national-order` (3 times) and `/order-a-cake#cake-inquiry` (3
times), plus `/patticake` and `/order-a-cake` once each. They appear as four
near-identical button pairs down one scroll.

This runs against the stated creative rule in `docs/HANDOFF_CURRENT.md`: "One
idea and one action lead at a time." Proposed fix is to keep the hero pair and
the closing pair and drop the two middle repeats. Not done: it is a visible
structural change to a page that has been through several audit rounds.

### 2. The four-step explainer repeats across every Patticake surface

`components/PatticakeProcessSteps.tsx` is deliberately the single canonical
wording, rendered on `/`, `/patticake`, and `/order-a-cake`. That is good for
consistency, but in the demo click path (home, then "Ship a Cake") the same
four steps appear twice in a row within seconds.

Worth considering: keep the full four steps on `/patticake`, and let the
homepage tease rather than duplicate. Deliberate design, so leaving it alone.

### 3. `/patticake` is very long to scroll live

One page carries the cake explainer, commerce module, other cakes, an occasion
marquee, shipping notes, the four steps, occasions, a prep checklist, six press
outlets with five stories, three ratings sources, independent coverage, social
links, six FAQs, a fifteen-field shipping form, and a closing CTA. The proof
stack alone is longer than the product story.

## yum! Kitchen: done

- Form failures no longer print `Email delivery is disabled until
  RESEND_API_KEY is configured` to the guest. `app/api/inquiry/route.ts` now
  returns plain language, because that string renders verbatim in the form UI.
- Hugo's leader card had a "Visit Location" button pointing back at `/about`, a
  dead click. `LeaderCard.href` is now optional; a card without one renders
  unlinked and without the call to action.
