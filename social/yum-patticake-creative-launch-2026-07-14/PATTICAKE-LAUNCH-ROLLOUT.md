# Patticake.com launch rollout

Prepared July 15 and revised July 21, 2026 from current real Yum photography, the July 9 brand toolkit, the live Patticake site copy, and the baby-blue box and red logo system.

## site alignment check, August 5, 2026: read before executing

The site changed after this plan was frozen. Three deltas to reconcile before
any spend:

1. **`/patticake#delivery-support` now lands on a collapsed disclosure.** The
   shipping-note form was deliberately demoted so the on-page checkout is the
   unambiguous buy path. The anchor still works, but arrivals see a closed
   "start your shipping note" panel, one click from the form. The note-first
   assets (`how-to-patticake` carousel, `patticake-start-the-note`) keep this
   destination because their creative is note-first; just know what it lands
   on, and prefer `#national-order` (the real checkout) for any asset whose
   copy talks about ordering rather than the note.
2. **The `how-to-patticake` carousel's five steps are the old note-first
   process.** The site's canonical four steps now end in "we bake it fresh"
   with online checkout as the first action. Before the D+3 slot runs paid,
   consider a re-render aligned to `components/PatticakeProcessSteps.tsx`
   wording, which is the single source of process copy.
3. **The photo pool was repaired on August 5 and 6; the pack is current.**
   All 14 numbered lanes, the four launch films, and all 31 carousel cards
   now draw from the repaired pool. The blurry `layers_slice_vertical` and
   the unreadable `03_top_view` appear in no lane, film, or card. The
   `made-by-yum` lane runs the verified founders portrait, and the
   `nationwide` lane shows the shippable product rather than a wedding tier.
   Do not re-audit these; they are done.

   Worth knowing: the August 5 pass only covered `src/specs.json`, so the
   launch films and carousels kept the evicted photos for a day. If you
   change the photo pool again, all three spec files need it:
   `src/specs.json`, `src/launch-moment-specs.json`, and
   `src/carousel-specs.json`.

   Also new since the pack froze: the 12-second decade-parade cut at
   `yumkitchen-web/public/videos/yum-parade-decade.mp4` (full 88s master in
   `~/dev/yumkitchen-reference/media-for-review/parade-video/`), a natural
   fit for the D+12 made-by-yum slot.

## rollout sequence

| Timing | Asset | Job | Primary channels | Destination |
| --- | --- | --- | --- | --- |
| Launch morning hero | `patticake-launch-day` | Lead with real Yum packaging, the blue box, the cake, and nationwide availability | Instagram Reel, TikTok, YouTube Short, Facebook, protected site preview | `https://patticake.com` |
| Launch afternoon proof | `patticake-blue-box-arrival` | Turn the blue box, unboxing, and first slice into the launch ritual | Instagram Reel, Story, TikTok, Meta paid | `https://patticake.com` |
| Launch week origin | `patticake-bakery-to-nationwide` | Connect the real Yum kitchen and packaging to the national rollout | Instagram, Facebook, LinkedIn, press and partner outreach | `https://patticake.com` |
| D-7 | `patticake-site-teaser` | Create curiosity around nationwide delivery | Instagram Reel, Story, TikTok | `https://patticake.com/patticake` |
| D-3 | `patticake-three-layers` | Show the actual product proof | Instagram feed, Reel, Pinterest | `https://patticake.com/patticake` |
| Launch morning support | `patticake-site-reveal` | Announce nationwide availability clearly in the established template system | Reel, TikTok, YouTube Short, Facebook | `https://patticake.com/patticake` |
| Launch afternoon | `meet-patticake` carousel | Explain box, cake, message, and action | Instagram and Facebook carousel | `https://patticake.com/patticake` |
| D+1 | `patticake-gift-drop` | Establish the core gifting idea | Reel, Story, Meta feed | `https://patticake.com/patticake` |
| D+3 | `how-to-patticake` carousel | Reduce uncertainty around the first step | Instagram and Facebook carousel, Story motion | `https://patticake.com/patticake#delivery-support` |
| D+5 | `patticake-birthday` | Own a familiar occasion | Reel, TikTok, Meta feed | `https://patticake.com/order-a-cake` |
| D+7 | `patticake-thank-you` | Expand beyond birthdays | Feed, Story, Pinterest | `https://patticake.com/patticake` |
| D+9 | `patticake-local-pickup` | Clarify the Twin Cities path | Instagram, Facebook, local paid | `https://patticake.com/order-a-cake` |
| D+12 | `patticake-made-by-yum` | Connect Patticake to the Yum bakery story | Instagram, Facebook, LinkedIn | `https://patticake.com/patticake` |
| D+14 | `patticake-occasions` carousel | Build an occasion library | Instagram and Facebook carousel | `https://patticake.com/patticake` |
| Evergreen | `patticake-start-the-note` | Retarget people who visited but did not start | Meta paid, Story, Reel | `https://patticake.com/patticake#delivery-support` |
| Evergreen | `patticake-event` | Support weddings and event inquiries | Instagram, Pinterest, Meta paid | `https://patticake.com/order-a-cake` |

## channel-ready formats

| Export | Size | Use |
| --- | --- | --- |
| Primary vertical motion | 1080 x 1920, 10 seconds | Instagram Reels, Facebook Reels, TikTok, YouTube Shorts, Stories |
| Vertical motion cutdown | 1080 x 1920, 8 seconds | Meta paid, short Story placements |
| Feed motion | 1080 x 1350, 8 seconds | Instagram and Facebook feed |
| Square motion | 1080 x 1080, 8 seconds | Square paid and legacy placements |
| Wide motion | 1280 x 720, 8 seconds | YouTube, LinkedIn, X, web embeds |
| Story still | 1080 x 1920 | Stories and paid vertical stills |
| Feed still | 1080 x 1350 | Instagram, Facebook, Threads |
| Square still | 1080 x 1080 | Square feed and paid |
| Wide still | 1200 x 675 | X, LinkedIn, YouTube community |
| Link still | 1200 x 630 | Facebook and LinkedIn link cards |
| Pin still | 1000 x 1500 | Pinterest |
| Carousel card | 1080 x 1350 | Instagram and Facebook carousels |

All video files are silent masters. Add a current, rights-cleared track inside the publishing platform.

The four launch-moment film families use the same dimensions as the motion rows above. Their folders begin with `exports/launch-motion-`. The 10-second 9:16 files are the primary launch versions. The 8-second 9:16, 4:5, 1:1, and 16:9 files are native recompositions, not mechanical crops.

## publishing copy

### teaser

Something sweet is on its way. Patticake is now available nationwide.

Link: `https://patticake.com/patticake`

Alt text: A bright baby-blue Yum cake box tied with red Yum ribbon. A crisp baby-blue label reads "recognize the box." The Yum logo moves along a red ribbon near the bottom.

### nationwide reveal

Patticake is now available nationwide. Send cake, not a card, or plan local pickup in the Twin Cities.

Link: `https://patticake.com/patticake`

Alt text: A bright baby-blue Yum cake box, chocolate cake layers, and Patticake slices appear in sequence before a baby-blue end frame reads "patticake is now available nationwide" in red.

### launch-day hero

Patticake is now available nationwide. Made at yum!, boxed in baby blue, and ready to send.

Link: `https://patticake.com`

Alt text: Real bright baby-blue Yum bakery boxes, a ribboned blue cake box, and a three-layer chocolate cake cut open appear full frame. Separate baby-blue frames read "made at yum!" and "now available nationwide" in red before a Patticake by yum! end frame.

### blue-box arrival

The blue box is here. Open it, slice it, and share it.

Link: `https://patticake.com`

Alt text: A ribboned baby-blue Yum box, rows of triple-layer Patticake slices, and a tall plated slice appear full frame between simple baby-blue message frames.

### bakery to nationwide

It started in the yum! bakery. Now Patticake can go nationwide.

Link: `https://patticake.com`

Alt text: A real Yum kitchen team member, real baby-blue Yum packaging inside the restaurant, and a three-layer chocolate cake slice appear full frame before a Patticake by yum! end frame.

### three layers

Three layers. One big moment. Chocolate cake, vanilla buttercream, and the first slice everyone remembers.

Link: `https://patticake.com/patticake`

Alt text: Close views of three-layer chocolate cake with white buttercream above a baby-blue panel with a red product headline.

### send cake

Send cake, not a card. Add the message. Pick the moment. Share the first slice.

Link: `https://patticake.com/patticake`

Alt text: A stack of baby-blue yum! gift boxes, a single ribboned box, and a three-layer chocolate cake cut open.

### start the note

Start with the message. Tell us who it is for, where it is headed, and when the moment happens. Our team will help with the next step.

Link: `https://patticake.com/patticake#delivery-support`

Alt text: A white frosted cake, bright baby-blue Yum box, and plated slices appear with short prompts about the person, place, and date.

### birthday

Birthday cake, handled. Share the date, message, and cake details to start.

Link: `https://patticake.com/order-a-cake`

Alt text: Plated slices of chocolate cake and a close view of chocolate layers with vanilla buttercream.

### thank you

Thank you, with cake. For hosts, helpers, and the people who showed up.

Link: `https://patticake.com/patticake`

Alt text: A baby-blue yum! gift box, rows of triple-layer Patticake slices on white plates, and a tall plated slice, framed by red packaging ribbon.

### local pickup

Staying local? Pick it up. Plan a Patticake from one of four Twin Cities yum! restaurants.

Link: `https://patticake.com/order-a-cake`

Alt text: White frosted cakes and plated chocolate slices beside a baby-blue panel explaining Twin Cities pickup.

### made by yum!

Made by the people behind yum! The cake people ask for by name.

Link: `https://patticake.com`

Alt text: A three-layer chocolate cake cut open, yum! founders Patti and Robbie Soskin side by side, and plated Patticake slices, closing on a baby-blue field with red Yum story type.

### weddings and events

Cake for the table you planned. Start with the date, occasion, and details our bakery team should see.

Link: `https://patticake.com/order-a-cake`

Alt text: Three real tiered Patticake wedding cakes with flowers and buttercream details.

## launch gates

- Verify the live delivery and pickup options immediately before publishing.
- Confirm every destination and UTM link in the final post draft.
- Add platform-native audio only when the track is cleared for the intended organic or paid use.
- Do not add extra text stickers, glow, black panels, cream frames, or a second CTA over the masters.
- Customer, creator, child, and review content stays outside paid creative until usage rights are recorded.
