# SECTION 0: CORRECTIONS AND CLARIFICATIONS FOR AI CODER

> **Historical.** Found on Zach's machine outside this repo (`~/Downloads/Yum_Brief_Addendum_Section0_v1.md`), not previously committed. This is the design-system correction record: it documents why the brand palette is what it is (overriding an earlier wrong terracotta/burnt-orange brief). The palette values below (`#E1383F` primary red, etc.) have since been refined further; current values are in `yumkitchen-web/app/globals.css` and `AGENTS.md`. Kept for the correction rationale, not as current color values.

**READ THIS SECTION FIRST. It overrides conflicting information elsewhere in this brief.**

This document is being handed to an AI coder. Every ambiguity will produce a wrong output. This section resolves conflicts and fills gaps so you can build without guessing.

---

## 0A. COLOR PALETTE (OVERRIDES SECTION 13)

Section 13 describes a "terracotta or burnt orange" palette. That is wrong. Use the actual brand colors extracted from the live site and logo:

```css
:root {
  --yum-red: #E1383F;           /* Primary brand red (logo background, buttons, CTAs) */
  --yum-light-blue: #AED2EF;    /* Secondary accent (header background, highlights) */
  --yum-off-white: #FFF4F5;     /* Warm white with pink undertone (modals, light sections) */
  --yum-white: #FFFFFF;         /* Pure white (cards, content backgrounds) */
  --yum-dark: #2D2D2D;          /* Near-black (headlines, text, dark sections, hover states) */
  --yum-gray: #736E6E;          /* Body text, secondary text */
  --yum-light-gray: #D8CFD1;    /* Borders, dividers */
  --yum-bg: #F3F3F3;            /* Page background (current site uses this) */
}
```

**Color usage rules:**
- Buttons: `--yum-red` background, `--yum-off-white` text. Hover: `--yum-dark` background.
- Header bar: `rgba(202, 228, 253, 0.8)` (light blue with transparency). On scroll, add white background with blur.
- Footer: `--yum-light-blue` (#AED2EF) background with `--yum-dark` text.
- Body text: `--yum-gray` (#736E6E).
- Headlines: `--yum-dark` (#2D2D2D).
- Links: `--yum-red` default, `--yum-dark` on hover.
- Modal backgrounds: `--yum-off-white` (#FFF4F5).
- Section alternation: white sections and off-white sections. Use `--yum-dark` for occasional contrast sections where food photos need to pop.

**Do NOT use:** terracotta, burnt orange, sage green, warm gold, or muted clay. These are not part of the yum! brand.

The brief's guidance about "the food photography should always be the loudest color on the page" remains correct. The red and blue palette supports this by staying warm but restrained.

---

## 0B. TYPOGRAPHY (CLARIFICATION FOR SECTION 13)

The current site uses:
- **Headlines/Display:** Trocchi (Google Font, serif), weight 400
- **Body/UI:** Archivo Narrow (Google Font, sans-serif), weights 400, 500, 700

Section 13 suggests Playfair Display, Lora, DM Sans, Plus Jakarta Sans, or Inter. These are acceptable alternatives IF the client approves a typography change. If no explicit approval is given, default to Trocchi and Archivo Narrow to match the existing brand.

**Safe upgrade option:** Keep Trocchi for headlines. Replace Archivo Narrow with DM Sans or Plus Jakarta Sans for improved readability at body sizes. This is a subtle improvement that will not surprise the client.

---

## 0C. SOCIAL MEDIA URLs (FILLS GAP FROM SECTION 10)

```
Facebook:  https://www.facebook.com/yumkitchenandbakery
Instagram: https://www.instagram.com/yumkitchen/
Twitter/X: https://twitter.com/YumKitchen
```

Use these in the footer "Follow for more yum!" section. Display as icon links (Facebook, Instagram, X).

---

## 0D. CAREERS APPLICATION (FILLS GAP FROM SECTION 7)

The careers page links to `/jobs/general-job-description/` which contains a Gravity Forms application form built into WordPress.

**For the rebuild:** The job application form must be rebuilt natively. Current form captures:
- Preferred location (dropdown: St. Louis Park, Shady Oak, St. Paul, Woodbury)
- Preferred role (checkboxes or multi-select)
- Name, email, phone
- Availability
- Resume upload (optional)
- Additional notes

**Form submission:** Send to a configurable email address. Use a hidden field for the selected location. Store submissions in the CMS if possible, or use a service like Formspree/Resend as a fallback. **Ask the client for the destination email address before launch.**

---

## 0E. CATERING MENU (CLARIFICATION FOR SECTION 6)

The current site's catering page has a "View Catering Menu" button, but it links to the main `/menu/` page, not a separate catering-specific menu. There is no standalone catering menu PDF or page on the current site.

**For the rebuild:** The catering section should reference the main menu. Add a note like "Our full menu is available for catering. Call any location for custom orders and pricing for groups." Link the CTA to `/menu/`. If the client provides a separate catering menu later, it can be added as a PDF download or dedicated page.

**Do not create a fake catering menu with made-up items or prices.**

---

## 0F. CONTACT FORM DESTINATIONS (FILLS GAP FROM SECTION 14)

Current contact form uses Gravity Forms. The rebuild needs:

**Contact form** (`/contact/`):
- Fields: name, email, location selector (dropdown with all 4 locations), message
- Submit to: configurable email address (placeholder: `info@yumkitchen.com` until client confirms)

**Wedding cake inquiry** (`/order-a-cake/`):
- Fields: name, email, phone, event date (date picker), pickup location preference (dropdown), guest count (number), description/notes (textarea)
- Submit to: configurable email address (placeholder: `cakes@yumkitchen.com` until client confirms)

Use environment variables for all email destinations so the client can update them without code changes.

---

## 0G. NEWS ARTICLE URLs (REFERENCE FOR SECTION 9)

All 22 article slugs from the current site. Preserve these URLs in the rebuild with 301 redirects or identical paths:

```
/top-bakeries-in-the-twin-cities/
/top-dessert-in-the-twin-cities/
/coming-to-woodbury/
/woodbury-magazine-feature/
/pick-up-picnic-eats/
/pregame-mnufc-at-yum-st-paul/
/best-patios-in-the-twin-cities/
/passover-friendly-food/
/5-best-things-the-startribune-food-critics-ate-this-week/
/yum-on-good-company/
/top-15-best-chocolate-chip-cookies-in-the-twin-cities/
/where-to-pick-up-local-soup/
/yum-at-taste-of-the-twin-cities/
/14-best-restaurants-in-minnetonka-mn/
/best-business-lunch-in-the-twin-cities/
/derusha-eats-feature/
/celebrate-rosh-hashanah-with-yum/
/breakfast-with-megs-and-eggs/
/critics-choice/
/inside-yum/
/patti-on-motivation/
/235-2/
```

Note: `/235-2/` is likely "yum!'s New Location" with a WordPress auto-generated slug. Redirect this to a cleaner URL like `/yums-new-location/` in the rebuild.

**Article body content:** Scrape from the current WordPress site before it goes offline. Each article is a short blog post (typically 1 to 3 paragraphs with an embedded image or external link). If scraping is not possible before launch, create placeholder pages with the article titles and a "Content coming soon" note.

---

## 0H. LOGO FILE

The logo is a circular red badge with "yum!" in light blue serif text and "Kitchen and Bakery" in dark text. A .webp raster version is provided.

**For the rebuild:**
- Use the provided .webp logo as-is for the header and footer
- Create an SVG version of the wordmark "yum!" for inline use if needed
- The logo should appear at approximately 9.5em width in the desktop header (matches current site)
- On mobile, center the logo at approximately 8em width
- In the footer, the logo should be rendered in `--yum-off-white` (#FFF4F5) against the blue footer background, approximately 10em width

**Do not recreate or redesign the logo.** Use the provided file.

---

## 0I. ACCESSIBILITY STATEMENT

The current site has an accessibility statement page linked from the footer at `/accessibility-statement/`. Content for this page was not provided.

**For the rebuild:** Include a standard restaurant website accessibility statement. Use the following template and customize:

"yum! Kitchen and Bakery is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards. If you experience any difficulty accessing any part of this website, please contact us at [PHONE] or [EMAIL] and we will work with you to provide the information you need."

---

## 0J. HOSTING AND DEPLOYMENT

Not specified by the client. **Default recommendation for an AI-coded Next.js site:**
- Deploy to Vercel (native Next.js support, automatic preview deployments)
- Domain: yumkitchen.com (transfer DNS or point nameservers)
- SSL: automatic via Vercel
- Images: use next/image with automatic WebP/AVIF optimization
- CMS: Sanity (free tier supports this site's content volume)

**Do not deploy to production without client approval.** Build to a preview URL first.

---

## 0K. ANALYTICS

No existing Google Analytics property ID was provided.

**For the rebuild:**
- Create a placeholder for GA4 measurement ID using an environment variable: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Include the GA4 script tag conditionally (only loads when the env var is set)
- Add Google Tag Manager container support as a secondary option
- **Do not create a new GA4 property.** The client or their team will provide the measurement ID.

---

## 0L. FAVICON AND APP ICONS

Not provided. **Generate from the logo:**
- Extract the red circle with "yum!" text from the logo
- Create favicon.ico (32x32), apple-touch-icon.png (180x180), and android-chrome icons (192x192, 512x512)
- Use the red background with light blue "yum!" text, matching the logo exactly

---

## 0M. TOAST INTEGRATION BEHAVIOR

The current site opens Toast ordering URLs as external redirects (full page navigation to order.toasttab.com). **Do not attempt to embed or iframe Toast.** Always open Toast links in a new tab or redirect.

The location selector modal pattern:
1. User clicks "Order Now" (persistent button in header)
2. Modal appears with all 4 locations as clickable cards
3. User clicks a location
4. Browser opens that location's Toast URL in a new tab

Same pattern for "Call Us" but with `tel:` links instead of Toast URLs.

---

## 0N. NEWSLETTER / EMAIL SIGNUP

No ESP (Email Service Provider) specified. **Build the signup form with a generic handler:**
- Email-only input field
- Store submissions to a simple API endpoint or serverless function
- Output to a CSV/JSON file or database table that can be exported
- When the client chooses an ESP (Mailchimp, Klaviyo, etc.), swap the handler

**Do not hardcode any ESP API keys or integrations without client specification.**

---

## 0O. CMS CONTENT MODEL

If using Sanity (recommended), the following content types should be editable without a developer:

**Editable by the client (CMS-managed):**
- Menu items (name, price, description, add-ons, category, dietary tags, photo)
- Menu categories and ordering
- Seasonal spotlight items (featured dish, photo, description, date range)
- News articles (title, body, featured image, publish date)
- Location details (address, phone, hours, Toast URL, Google Maps URL, photos)
- Catering page copy
- Homepage hero images (carousel)
- Team member profiles (name, location, photo, title)
- Downloadable PDFs (allergen guide, printable menu)

**Hardcoded (requires developer to change):**
- Site layout and page structure
- Navigation structure
- Color palette and typography
- Animation behavior
- Form field configurations
- Toast and Google Maps integration URLs (as fallbacks if not in CMS)

---

## 0P. SEARCH BEHAVIOR

Section 13 mentions "Menu Search" but does not define scope.

**Build menu search only.** The search input on the menu page should filter menu items by name and description. It should not be a site-wide search. Use client-side filtering (no server round-trips needed for a menu this size).

---

## 0Q. GEOLOCATION FALLBACK

Section 13 mentions geolocation detection for the location finder. If the user denies location permission or geolocation is unavailable:
- Do not show an error
- Show all 4 locations equally (no highlighting)
- Default the location cards to alphabetical order: Shady Oak, St. Louis Park, St. Paul, Woodbury

---

## 0R. ITEMS STILL REQUIRING CLIENT INPUT BEFORE LAUNCH

These cannot be resolved by the AI coder. Flag them in a README or pre-launch checklist:

1. [ ] Contact form email destination
2. [ ] Wedding cake inquiry email destination
3. [ ] GA4 measurement ID
4. [ ] Newsletter ESP selection and API key
5. [ ] Domain DNS transfer / nameserver update
6. [ ] SVG vector logo file (optional, raster works for now)
7. [ ] Verify all menu prices are current before launch
8. [ ] Confirm news article content has been migrated
9. [ ] Client review and approval of all page content
10. [ ] Accessibility audit (automated + manual review)
