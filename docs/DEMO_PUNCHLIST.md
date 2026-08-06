# Demo punchlist: yum! and Patticake

Purpose: this build is a demo shown to Patti and Robbie Soskin, not a launch.
Production wiring (live email delivery, analytics destinations, DNS cutover) is
explicitly out of scope. Optimize for how the site reads during a walkthrough.

Started August 5, 2026.

## yum! Kitchen: open, parked behind Patticake work

These are logged and waiting. Patticake work comes first.

### 1. Founders photo: RESOLVED 2026-08-05 from the site archive

`Yum_0467.jpg` (a professional portrait of Patti and Robbie, arm in arm) was
found in the original-site archive at
`/Users/zsoskin/codex outputs/yum-audit/03_assets/images/`. Provenance
verified two ways: the original yumkitchen.com about page ran this exact file
beside "Led by Patti and Robbie Soskin" (checked in the archive's
`01_html/about.html`), and Patti's face matches the labeled
`yum-patti-kelli.jpeg`. Source is the live-site photo shoot Zach owns,
including likeness. Now at `/images/yum-founders-patti-robbie.jpg` on
`/about`, with `yum-patti-kelli.jpeg` remaining only in
`PatticakeOriginBand`, which also ends its double-use.

### 2. Margaret's card: RESOLVED 2026-08-05, one caveat for Zach

The original about page ran `Yum_0726.jpg` as Margaret's location-leader
photo (same archive, same verification path). Now at
`/images/yum-margaret-curbside.jpg` on her card. **Caveat: it is a 2020-era
curbside handoff shot and she is masked.** It is genuinely her and
unmistakably yum! (red bag, red cap), but if a newer portrait exists, swap
it. Zach can veto back to text-only.

### 3. Landing on Patticake is INTENTIONAL, decided 2026-08-06

Zach confirmed the demo is going to **patticake.com** and that Patticake
leads, not yum!. So `NEXT_PUBLIC_YUM_HOST_ROUTING` stays unset, `/` correctly
serves the Patticake home, and the Patticake-branded password gate is the
right first screen. This is no longer an open question; do not "fix" it.

Priority follows: Patticake surfaces (`/`, `/patticake`, `/order-a-cake`,
checkout) outrank the yum! pages for any remaining work.

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

## Patticake: RESOLVED 2026-08-05 in the demo upgrade round

The three items previously listed here (repeated homepage CTAs, the four-step
explainer duplicating across surfaces, and the /patticake page length) were
all executed and verified the same day, along with the full hero rebuild.
Details, measurements, and acceptance evidence live in
`docs/superpowers/plans/2026-08-05-patticake-demo-upgrade-plan.md`. Headline
numbers: homepage CTA clusters four to two, homepage steps tease titles-only,
/patticake 12.2 to 9.4 screens with proof compressed from 2,281px to 702px
and the buy module now the largest section on the page.

## Photo sourcing round, 2026-08-05 (Apify pull of @yumkitchen)

Pulled 71 posts (May 22 to Aug 5) from the owned @yumkitchen Instagram via
Apify. Used:

- **Baker's Man card fixed.** `/patticake`'s "more cakes" card wore a
  Patticake photo; post `Da-NWFlCDf3` (caption names the cake: "three-layer
  chocolate cake w/ swiss buttercream") is now
  `/images/patticake/bakers_man_stand.jpg` in `lib/patticake/catalog.ts`.

Found but not used, saved in the session scratchpad only:

- **Coconut Cake card still wears a Patticake top view.** Every lead was
  chased on 2026-08-05: the June 9 IG video is 604px assembly footage that
  never shows the finished cake (frames extracted and checked), the Toast
  online-ordering item carries only a logo placeholder, and Yelp's photo
  gallery 403s automated browsing. Yelp reviews confirm the cake
  photographs well ("coconut cream, 7 minute frosting and coconut flakes").
  Fastest close: Zach opens the Yelp gallery or shoots one photo in-store.
- Team photo (`DZ91cU7DDZL`, three bakers in yum! whites, "all smiles behind
  the counter") and a night-event Patticake spread (`Da5Dt8nGz0Y`). Both
  owned and usable if a slot opens; nothing on the site needs them today.

Update 2026-08-05: Zach removed the photo-rights gating for this project.
Any source may be used; the only remaining photo rule is accuracy (the photo
must actually show the yum! item it claims to show). This unblocks the
WeddingWire gallery in the site archive and outside sources for the Coconut
Cake photo and an unmasked Margaret.

## Marketing asset review, 2026-08-05

The active social pack (`social/yum-patticake-creative-launch-2026-07-14`) is
launch-ready: all 13 delivery ZIPs pass SHA256 verification, exports and
`/asset-gallery` counts reconcile with `docs/HANDOFF_CURRENT.md`, and the
retired packs are properly quarantined. A dated "site alignment check" was
added to the top of `PATTICAKE-LAUNCH-ROLLOUT.md` covering the three deltas a
rollout operator needs: the collapsed `#delivery-support` anchor, the
note-first `how-to-patticake` carousel now contradicting the site's canonical
checkout-first process, and the August 5 photography the pack predates.

**Found in `~/dev/yumkitchen-reference/media-for-review/`:**

- **`parade-video/Yum! Parade v1.mov`, 88 seconds, professionally shot.** A
  community parade with a "thank you for a decade of yum!" banner, staff in
  red caps, a drone shot, and a fire truck with balloons. The strongest
  unused emotional brand asset on the machine. Candidates: a 10-15s cut for
  the D+12 `patticake-made-by-yum` slot, an /about community moment, or the
  demo walkthrough itself. Needs a transcode (47MB .mov) and a creative
  decision; parked rather than wedged in.
- `brand-reference-boards/`: two reference PNGs (menu PDF, packaging board),
  reference-only.
- `instagram-reference/`: duplicate of the May @yumkitchen pull already in
  the site archive; nothing new.


## Round of 2026-08-06: the nine review items

**Site (all three fixed and verified at 1440x900 DPR2):**
- Hero middle frame was a landscape macro in a near-square slot, so cover
  discarded most of the photograph. Grid rows are now uneven (0.62fr/1.38fr):
  the short wide top slot shows nearly the whole cake face, and the reclaimed
  height went to the slices frame. `sizes` recomputed for the new geometry.
- Left column ended 272px above the grid. It now stretches and seats its proof
  row on the grid's bottom edge. **Measured gap: 0px.**
- Footer reserved `md:pb-32` for the MobileOrderBar, which is `md:hidden`. Also
  the 13-item quick-links column ran ~2x the location columns and left an
  L-shaped void; it now flows in two sub-columns. All five columns: 294px.

**Pack (fixed):**
- Four carousel sets repeated a photo mid-swipe. Fixed by CONTENT hash, not
  filename: the pack ships byte-identical duplicates under different names
  (`Yum_1239-1.jpg` = `yum-catering-tray.jpg`, `yum-patticake-just-married.jpeg`
  = `06_8inch_a.jpg`). A filename check passes sets that visibly repeat.
- Message cards showed cakes with no writing while the piped-message cake sat
  on "share the date." Swapped.
- **Beat timing was worse than reported:** every lane lost its LAST beat in the
  8s cuts, not just 4-beat lanes. `sceneFrames` divided the whole clip while the
  cue fades to zero at 4.85s. 14 lanes x 4 formats. Both cuts now divide the
  pre-panel window.
- Review board showed only the 4:5 feed still; five crops shipped unapproved.
  Manifest expanded 14 -> 84 cards, board rebuilt with the real renderer.
- Four guards added to `validate-motion`, all failing closed.

**NOT reproduced:** the logo sting does not open on an unmasked crop. The slice
`clipPath` applies from frame 0; the opening frames show the masked silhouette
filled with the photo, which then morphs to vector. Verified by extracting
frames from the rendered 1x1 master. The milder true observation is that the
circle behind it uses the same blue as the canvas, so the wedge has no ground.

**Measurement trap worth remembering:** reading `naturalWidth` off an in-page
element in headless Chrome under-reports badly (567x850 for an image the
optimizer serves at 1200x1800, proven by reloading the same URL). Judge hero
sharpness from a device-scale screenshot, never that number.

## yum! Kitchen: done

- Form failures no longer print `Email delivery is disabled until
  RESEND_API_KEY is configured` to the guest. `app/api/inquiry/route.ts` now
  returns plain language, because that string renders verbatim in the form UI.
- Hugo's leader card had a "Visit Location" button pointing back at `/about`, a
  dead click. `LeaderCard.href` is now optional; a card without one renders
  unlinked and without the call to action.
