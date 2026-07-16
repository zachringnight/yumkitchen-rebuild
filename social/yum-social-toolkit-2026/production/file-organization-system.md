# file organization system

## folder hierarchy

```text
social/
  00_admin/
    briefs/
    approvals/
    rights_and_releases/
    operational_confirmations/
  01_yum/
    organic/
    paid/
    stories/
    reels/
    locations/
      st-louis-park/
      shady-oak/
      saint-paul/
      woodbury/
    catering/
    gift-cards/
  02_patticake/
    organic/
    paid/
    stories/
    reels/
    birthdays/
    gifting/
    corporate-gifting/
    weddings-events/
    shipping/
    local-pickup/
  03_shared/
    seasonal/
    creator-ugc/
    email-social-crossover/
  04_raw/
    photo/
    video/
    audio/
    creator-originals/
  05_templates/
    remotion/
    canva/
    figma/
    adobe-express/
  06_exports/
    approved/
    draft/
    organic/
    paid/
    platform-crops/
  07_reporting/
    manifests/
    creative-results/
    winning-hooks/
    retired-assets/
```

## naming convention

`{brand}_{campaign}_{concept}_{audience-or-location}_{channel}_{ratio}_{date}_v##_{status}.{ext}`

Examples:

- `yum_lunch_first-order_saint-paul_ig-reel_9x16_20260709_v01_draft.mp4`
- `yum_catering_room-ready_office-meta_4x5_20260709_v03_approved.png`
- `patticake_birthday_first-slice_gift-buyer_tiktok_9x16_20260709_v02_approved.mp4`
- `patticake_corporate-gifting_client-thanks_linkedin_4x5_20260709_v01_draft.png`

## version rules

- Increment `v##` for any copy, crop, timing, image, audio, or CTA change.
- Never overwrite an approved export.
- Use `draft`, `review`, `approved`, `live`, or `retired`. Do not use `final-final`.
- Save campaign approval and operational expiry alongside the approved asset.
- Paid variants get a distinct concept and hook ID even when they share footage.

## source and export rules

- Raw files remain untouched under `04_raw` with creator and rights metadata.
- Editable templates live under `05_templates`; platform exports live under `06_exports`.
- Keep organic and paid exports separate because rights, music, copy, crop, and CTA may differ.
- Store creator originals, signed rights, disclosures, edit approvals, and paid-usage terms together.
- Draft folders may contain placeholders. Approved folders must not.
