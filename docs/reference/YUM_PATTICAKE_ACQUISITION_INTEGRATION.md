# yum! and Patticake acquisition handoff integration

## preserved source

The complete v1.2 acquisition handoff is preserved unchanged at:

- `docs/reference/yum-patticake-acquisition-v1.2/yum_patticake_handoff_complete_v1_2.zip`
- `docs/reference/yum-patticake-acquisition-v1.2/yum_patticake_handoff_complete_v1_2.sha256`

Verified SHA-256:

`4407f5b4f53f73a6c1c78521608ab30a363cde8f9797a16a92056319d61e6d66`

The archive passes `unzip -t`. It contains 45 files across strategy, engineering, agent prompts, project management, tracking, templates, tool recommendations, and competitive benchmarks.

## authority rules

1. Live app code is the implementation source of truth.
2. `AGENTS.md` and `yumkitchen-web/app/globals.css` control engineering and brand rules.
3. The July 14 creative launch pack controls current social art direction, voice, real-photo usage, baby blue, red, logo behavior, and motion.
4. The v1.2 handoff supplies acquisition strategy, measurement requirements, funnel backlog, QA gates, and competitive experiments.
5. Tool recommendations are advisory. They do not authorize new subscriptions, accounts, or publishing.
6. Operational claims still require owner approval before release.

Nothing in the preserved handoff should overwrite newer creative assets or production code automatically.

## implementation reconciliation

Status definitions:

- **Built**: implemented in the current checkout.
- **Partial**: useful implementation exists, but the handoff acceptance criteria are not fully satisfied.
- **Open**: no dedicated implementation exists.
- **Gated**: implementation depends on owner, operations, rights, credentials, or production confirmation.

| Handoff IDs | Status | Current state and remaining work |
| --- | --- | --- |
| P1-001 | Built | Site crawl, live-site comparison, link audits, and browser QA exist. Re-run before DNS cutover. |
| P1-002 | Partial, gated | Voice and claim references exist. Shipping, pickup, catering, wedding, and fulfillment details still need operational approval. |
| P1-003 | Built | Redirect documentation and canonical metadata are implemented. Preserve the four canonical location slugs. |
| P1-004 | Partial | GTM events now include canonical acquisition names and required click context. Production GTM and GA4 mappings still require DebugView confirmation. |
| P1-005 | Built | Global `data-event` click tracking now includes destination URL, canonical event name, page path, CTA label, phone, location, and attribution context. |
| P1-006 | Built | UTMs, landing page, and referrer persist through internal navigation in session storage and populate inquiry payloads. |
| P1-007 | Partial | Reusable React Hook Form and Zod forms include validation, success and error states, and hidden attribution fields. Several funnel-specific fields remain. |
| P1-008 | Built | Mobile order controls exist for Yum and Patticake surfaces. |
| P2-001 | Partial, gated | Patticake checkout, shipping, and local pickup routes exist. Final terminology and fulfillment behavior still need production confirmation. |
| P2-002 | Built | Sample customer reviews no longer render or remain in production data. Verified aggregate ratings and attributed press quotes remain. |
| P2-003 | Partial | Pickup and delivery forms capture core cake details, hidden attribution fields, and canonical funnel events. Final operational approval remains. |
| P2-004 | Partial | Delivery captures occasion. Occasion-aware landing and form defaults are not implemented across every cake path. |
| P3-001 | Built | Catering page, proof, FAQ schema, phone path, menu link, and inquiry form exist. |
| P3-002 | Built | Catering captures contact, company or organization, event date and time, guest count, location, dietary notes, message, and attribution. Client and server validation agree. |
| P3-003 | Partial | Catering proof and content modules exist, but package cards do not preselect form interest. |
| P4-001 through P4-005 | Partial | All four canonical location pages exist with metadata, Restaurant schema, order, phone, directions, parking, and pickup information. Dedicated local FAQs and final unique SEO copy review remain. |
| P5-001 through P5-004 | Open | Dedicated occasion, birthday, thank-you, and city pickup landing pages do not exist. |
| P6-001 through P6-002 | Open, gated | Dedicated corporate gifting page and intake do not exist. Minimums, address workflow, timing, owner, and service scope require approval. |
| P7-001 through P7-002 | Partial, gated | The cake page includes a gallery and general event inquiry. A dedicated wedding page, venue and style fields, FAQ, and approved service scope remain. |
| P8-001 | Partial | Gift card calls to action are tracked across existing pages. A dedicated acquisition page does not exist. |
| P9-001 | Partial, gated | The designed email capture is preserved but hidden until a real signup webhook is configured. The false demo success path is removed; success now requires an accepted backend response. |
| P9-002 through P9-003 | Open, gated | Segmentation and lifecycle automation are not implemented. CRM and ESP ownership must be chosen. |
| P10-001 through P10-002 | Open, gated | Review landing page and packaging QR routes do not exist. Review destinations and feedback ownership require approval. |
| P11-001 through P11-004 | Open | Reduced-navigation paid landing-page template and three campaign pages do not exist. |
| P12-001 through P12-002 | Open, gated | Reporting schema and dashboard do not exist. GTM and GA4 production confirmation is required first. |
| P13-001 through P13-002 | Open | Test-ready content slots and the first documented CRO test are not implemented. |
| P14-001 | Partial | A dated competitive review exists. Monthly refresh ownership and dead-link review are not automated. |
| P14-002 | Partial, gated | Toolkit concepts and assets exist. A weekly inventory-backed publishing process does not. |
| P14-003 | Partial, gated | Message-led Patticake creative exists. Recurring bakery production and publishing ownership remain. |
| P14-004 | Partial, gated | Shipping guidance exists, but service area, timing, packaging, arrival, storage, weather, and confirmation rules are not fully approved. |
| P14-005 | Open, gated | Office Birthday Patticake pilot does not exist. Pricing, capacity, sales owner, and lead workflow are required. |
| P14-006 | Open, gated | Multi-address workflow does not exist. Privacy, secure intake, validation, and fulfillment ownership are required. |
| P14-007 | Partial, gated | Regional nostalgia concepts exist. A dedicated landing page, targeting plan, and approved shipping capacity remain. |
| P14-008 | Open, gated | Birthday and occasion reminder capture, consent, tags, and annual automation do not exist. |
| P14-009 | Open, gated | Patticake box insert and campaign-level QR destinations do not exist. |
| P14-010 | Open, gated | Pack-out and recipient-unboxing seed program does not exist. Usage rights, budget, and fulfillment process are required. |

## execution order

1. Close P1-004 through P1-007: analytics schema, attribution persistence, CTA enrichment, and form attribution.
2. Close P2-002: remove all sample customer reviews from production surfaces.
3. Resolve P1-002 and P14-004 with operations before paid Patticake shipping campaigns.
4. Build the highest-intent landing pages: birthday, thank-you, corporate gifting, wedding and events, and paid campaign variants.
5. Add review, referral, reminder, and email lifecycle systems only after owners and destinations are confirmed.
6. Build the dashboard after production GTM and GA4 events are verified.

## verification expectations

- Run `bash verify.sh` before PR-ready status.
- Confirm events in GTM Preview and GA4 DebugView before paid launch.
- Confirm UTMs survive an internal navigation and appear in inquiry payloads.
- Keep social media, customer review, and creator content behind source and rights checks.
- Revalidate all competitor links before using them as current evidence.
