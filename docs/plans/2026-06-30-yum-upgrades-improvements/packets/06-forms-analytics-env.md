# Task 06: Forms, Analytics, And Environment

**Wave:** 4
**Depends on:** 04, 05

## Files
- Modify: `yumkitchen-web/app/api/inquiry/route.ts`
- Modify: `yumkitchen-web/components/forms/InquiryForm.tsx`
- Modify: `yumkitchen-web/components/AnalyticsEvents.tsx`
- Modify: `yumkitchen-web/components/DeferredGoogleTagManager.tsx`
- Modify: `yumkitchen-web/DEPLOYMENT.md`
- Modify: `yumkitchen-web/lib/site.ts`

## Interfaces
- Consumes: `RESEND_API_KEY`, `RESEND_FROM`, `YUM_FORMS_TO`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL`, `NEXT_PUBLIC_YUMKITCHEN_URL`, `NEXT_PUBLIC_PATTICAKE_URL`, `NEXT_PUBLIC_SITE_URL`.
- Produces: explicit env requirements, safe form behavior, and analytics events that can be verified without live deployment.

## Steps
- [ ] Audit form route behavior.
  Confirm missing `RESEND_API_KEY` fails safely in production and does not silently claim delivery.
- [ ] Confirm every form has visible labels and usable success and error states.
- [ ] Confirm forms route to `info@yumkitchen.com` by default through `YUM_FORMS_TO`, unless an env override is set.
- [ ] Confirm Patticake order-details form does not imply a completed paid order when `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL` is unset.
- [ ] Confirm analytics event names in code match the spec:
  `click_order_online`, `click_call_location`, `submit_contact_form`, `submit_wedding_cake_form`, `submit_careers_form`, `click_gift_card_buy`, `click_gift_card_balance`, plus Patticake-specific events if used.
- [ ] Confirm UA legacy `UA-83446946-1` is not loaded.
- [ ] Update `DEPLOYMENT.md` with the exact env matrix and manual checks for form email, GTM DebugView, Toast URLs, and Patticake domain behavior.
- [ ] Run checks.
  Run from `yumkitchen-web`: `npm run typecheck && npm run lint && npm run build`
  Expected: all pass.

## Done-check
Run from `07_codex`: `bash verify.sh`
Expected: `VERIFY PASSED`.

## Report
DONE unless live email delivery cannot be tested without production secrets. Use DONE_WITH_CONCERNS if local validation passes but real Resend delivery still needs Zach approval and credentials.
