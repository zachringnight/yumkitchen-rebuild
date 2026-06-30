# Packet 08 - Forms + analytics live verification

Wave: 2
Depends on: 02 (preview URL), 03, 04, 05, 06

## Objective
Prove the two things that have never been verified end to end: real form delivery via Resend, and all 9 analytics events firing in a deployed preview. This packet has a human-in-loop step (secret entry) flagged on the eyeball list.

## Files
- Updates `docs/plans/2026-06-30-yum-ship-and-elevate/verify/forms-analytics-log.md`.
- May update `yumkitchen-web/DEPLOYMENT.md` if a step is wrong.

## Consumes
- `PREVIEW_URL` from P02. `app/api/inquiry/route.ts` (single endpoint, all forms). Event list in `DEPLOYMENT.md`.

## Produces
- A pass/fail log: each form type delivered, each event observed.

## The human-in-loop boundary
Entering `RESEND_API_KEY` and confirming a real inbox are Zach actions. This packet:
1. Confirms the preview has `RESEND_API_KEY` set (BLOCK and ask Zach if absent, do not invent one).
2. Submits one test per form: contact, catering, wedding cake, careers, accessibility feedback.
3. Records whether each arrived at `YUM_FORMS_TO` (`info@yumkitchen.com`).

## Steps
1. Verify preview env: `RESEND_API_KEY` present, `NEXT_PUBLIC_GTM_ID=GTM-P9584HPC`.
2. Submit each of the 5 form types against `PREVIEW_URL`. Capture the success state and the delivered email (or Resend dashboard log id).
3. In GTM Preview + GA4 DebugView, trigger and confirm all 9 events: `click_order_online`, `click_call_location`, `submit_contact_form`, `submit_catering_form`, `submit_wedding_cake_form`, `submit_careers_form`, `click_gift_card_buy`, `click_gift_card_balance`, `click_patticake_national_delivery_order`.
4. Confirm UA `UA-83446946-1` does not load (network tab).
5. Log every result with evidence.

## Verification
Manual + evidence. Pass = 5/5 forms delivered, 9/9 events observed, 0 UA hits. Record in `forms-analytics-log.md`.

## Done-signal
`DONE` only with 5/5 + 9/9. `BLOCKED` with the exact missing secret or access if Zach action is needed. Never claim delivery without an inbox or Resend log id as evidence.
