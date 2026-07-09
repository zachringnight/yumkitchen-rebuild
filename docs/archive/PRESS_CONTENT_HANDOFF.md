# Yum! Kitchen & Bakery Website Handoff for Codex

> **Historical.** Found on Zach's machine outside this repo (`~/Downloads/yum_kitchen_bakery_codex_handoff.md`), not previously committed. This is a press/credibility content brief, distinct from `docs/archive/CODEX_HANDOFF.md` (the T-01 scaffold kickoff note). The `/in-the-news` page it specifies has since shipped, but the full messaging hierarchy, press citation inventory, and do-not-lead-with guidance below are not captured anywhere else in the repo. Source of truth if the press page is ever expanded. Kept for project-history and future-reference value, not a current task list.

## Purpose

Build or update a website section for Yum! Kitchen & Bakery that uses earned media, awards, press mentions, TV appearances, podcasts, community coverage, and expansion stories as proof points.

The goal is not to dump every mention onto a page. The goal is to translate the strongest outside validation into a credible, polished site experience.

## Brand entity

**Name:** Yum! Kitchen & Bakery  
**Also styled as:** yum! Kitchen and Bakery  
**Primary market:** Twin Cities metro, Minnesota  
**Category:** Restaurant, bakery, catering, neighborhood food brand  
**Founded / operating claim:** Made from scratch since 2005  
**Leadership:** Patti and Robbie Soskin  
**Current locations:** St. Louis Park, Minnetonka / Shady Oak, St. Paul, Woodbury  
**Core positioning:** Made-from-scratch seasonal food, bakery items, casual neighborhood hospitality, family-owned Twin Cities institution.

## Site objective

Create a media/press/recognition system that can support:

1. A public “In the News” or “Press” page.
2. Homepage credibility modules.
3. Product-specific proof modules for signature bakery items.
4. Founder story modules around Patti Soskin.
5. Community-impact modules around events like the Great Minnesota Bake Sale.
6. SEO-friendly pages around cakes, pies, cookies, bakery, catering, holiday menus, and Twin Cities restaurant recognition.

## Primary narrative

Yum! Kitchen & Bakery is a long-running Twin Cities restaurant and bakery institution with repeated third-party validation from respected local and food media.

The strongest story is:

**Founder-led hospitality + made-from-scratch bakery credibility + signature items repeatedly validated by Star Tribune, Eater Twin Cities, Mpls.St.Paul Magazine, CBS/WCCO, and KSTP.**

## Messaging hierarchy

### Lead with

1. Hall of Fame / best restaurant recognition.
2. Best bakery and best dessert placements.
3. Star Tribune critic/listicle validation for pies, cookies, and Patticake.
4. TV appearances with Patti Soskin.
5. Community and charitable food work.
6. Expansion and neighborhood growth.

### Do not lead with

The 2015 crash/reopen story. It is real and shows resilience, but it is not the cleanest brand proof point for a main press or homepage module.

Use only if the page has a deeper “history” or “community” section.

## Recommended website sections

### 1. Homepage proof band

Suggested headline:

**A Twin Cities favorite, recognized by the people who know food here best.**

Suggested body:

From bakery counters to neighborhood lunches, Yum! has been recognized by local food writers, TV shows, and Twin Cities publications for its made-from-scratch food, signature desserts, and founder-led hospitality.

Suggested proof chips:

- Mpls.St.Paul Magazine Hall of Fame
- Star Tribune best pies and cookies
- Eater Twin Cities best desserts
- KSTP / Minnesota Live features
- CBS / WCCO DeRusha Eats feature

### 2. Press / In the News page

Recommended title:

**In the News**

Recommended intro:

Yum! Kitchen & Bakery has been featured by Twin Cities food writers, local TV, podcasts, and community partners for its made-from-scratch food, signature bakery case, and neighborhood hospitality.

Recommended filters:

- Awards & Lists
- TV & Video
- Podcasts & Interviews
- Bakery & Desserts
- Community
- Expansion & Business
- Holiday & Catering

### 3. Signature items module

Recommended title:

**The bakery case has its own fan base.**

Items to feature:

- Patticake
- Chocolate chip cookies
- Mini French silk pie
- Mini coconut cream pie
- Key lime pies
- Pull-apart breads
- Holiday pies
- Soups, if using food-range proof beyond bakery

### 4. Founder story module

Recommended title:

**Led by Patti and Robbie Soskin. Built around hospitality.**

Use TV, podcast, and long-form interview mentions to support Patti’s role as a visible founder/operator.

Suggested body:

Yum! is led by Patti and Robbie Soskin and a team that has built the brand around made-from-scratch food, bakery staples, and the kind of hospitality that keeps regulars coming back.

### 5. Community module

Recommended title:

**Food, community, and showing up locally.**

Use Great Minnesota Bake Sale and Open Arms of Minnesota mentions as proof.

Suggested body:

Yum! regularly participates in community food moments, including the Great Minnesota Bake Sale supporting Open Arms of Minnesota.

## Press item schema

Use this structure for content/data.

```ts
type PressItem = {
  id: string;
  title: string;
  outlet: string;
  date: string; // ISO preferred, YYYY-MM-DD if known
  year: number;
  category:
    | "awards_lists"
    | "tv_video"
    | "podcast_interview"
    | "bakery_desserts"
    | "community"
    | "expansion_business"
    | "holiday_catering"
    | "critic_mentions";
  summary: string;
  quote?: string;
  url: string;
  priority: 1 | 2 | 3;
  featured: boolean;
  relatedTopics: string[];
  relatedProducts?: string[];
};
```

## Suggested priority rules

### Priority 1

Use for homepage modules, top of press page, and brand proof.

Criteria:

- Recognized editorial outlet.
- Strong award/list inclusion.
- Direct mention of Yum! as a standout.
- TV/video with Patti or brand presence.
- Strong product-specific validation.

### Priority 2

Use in press archive and supporting modules.

Criteria:

- Expansion coverage.
- Seasonal/holiday coverage.
- Community event coverage.
- Local business features.

### Priority 3

Use only in full archive, not main proof modules.

Criteria:

- Lower-authority blog/social mentions.
- General neighborhood listings.
- Older or niche items.
- User-generated/review content.

## Best press items to feature first

### 1. Mpls.St.Paul Magazine Hall of Fame

**Outlet:** Mpls.St.Paul Magazine  
**Category:** Awards & Lists  
**Priority:** 1  
**Suggested site label:** Hall of Fame recognition  
**Use for:** Homepage proof, press page hero, founder/institution story  
**URL:** https://mspmag.com/eat-and-drink/best-restaurants-hall-of-fame/

Why it matters:

This is the strongest overall proof point. It positions Yum! as a durable Twin Cities restaurant institution and frames Patti Soskin as a respected local restaurant figure.

### 2. Mpls.St.Paul Magazine Best Bakeries

**Outlet:** Mpls.St.Paul Magazine  
**Category:** Awards & Lists / Bakery & Desserts  
**Priority:** 1  
**Suggested site label:** Best bakeries in the Twin Cities  
**Use for:** Bakery landing page, homepage proof, Patticake module  
**URL:** https://mspmag.com/eat-and-drink/mill-city-rising-best-bakeries-of-the-twin-cities/

Why it matters:

This is a strong bakery authority hit and calls out the Patticake as a signature item.

### 3. Eater Twin Cities Best Desserts

**Outlet:** Eater Twin Cities  
**Category:** Bakery & Desserts  
**Priority:** 1  
**Suggested site label:** Best desserts in Minneapolis and St. Paul  
**Use for:** Bakery page, dessert SEO, product proof  
**URL:** https://twincities.eater.com/maps/best-desserts-pastries-restaurants-minneapolis-st-paul

Why it matters:

Eater is a food-media authority. The writeup specifically names the Patticake and other bakery-case items.

### 4. Star Tribune Best Pies / Best Cookies / Critic Mentions

**Outlet:** Star Tribune  
**Category:** Critic Mentions / Bakery & Desserts  
**Priority:** 1  
**Suggested site label:** Star Tribune food writer picks  
**Use for:** Product modules, bakery proof, press archive  
**Representative URLs:**

- https://www.startribune.com/the-10-best-pies-our-food-writers-ate-this-week/601587853
- https://www.startribune.com/here-are-the-15-best-chocolate-chip-cookies-in-the-twin-cities-bakery-gluten-free-dessert/600254733
- https://www.startribune.com/pi-day-best-pie-minneapolis-st-paul-minnesota/600350735

Why it matters:

Multiple Star Tribune placements create a repeat-pattern proof point around Yum!’s desserts, especially pies and cookies.

### 5. KSTP / Good Company Patti Soskin founder interview

**Outlet:** KSTP / Twin Cities Live / Good Company  
**Category:** TV & Video / Founder Story  
**Priority:** 1  
**Suggested site label:** Founder story feature  
**Use for:** About page, founder story, press page  
**URL:** https://kstp.com/tcl/good-company-yum-kitchen-bakery/

Why it matters:

Best founder-story video hit found. It covers Patti Soskin’s journey and the Woodbury expansion.

### 6. CBS/WCCO DeRusha Eats

**Outlet:** CBS / WCCO  
**Category:** TV & Video  
**Priority:** 1  
**Suggested site label:** DeRusha Eats feature  
**Use for:** About page, press archive, homepage proof if video assets are available  
**URL:** https://www.cbsnews.com/minnesota/news/derusha-eats-yum-kitchen/

Why it matters:

Strong legacy TV/media hit showing Yum!’s long-running local relevance and bakery operation.

### 7. Woodbury Magazine fourth location feature

**Outlet:** Woodbury Magazine  
**Category:** Expansion & Business  
**Priority:** 2  
**Suggested site label:** Woodbury opening feature  
**Use for:** Locations page, Woodbury location page, press archive  
**URL:** https://woodburymag.com/yum-kitchen-and-bakery-is-set-to-open-this-summer/

Why it matters:

Best expansion story for the Woodbury location and useful for location-specific SEO.

### 8. KSTP / Minnesota Live Great Minnesota Bake Sale

**Outlet:** KSTP / Minnesota Live  
**Category:** Community / TV & Video  
**Priority:** 1 or 2  
**Suggested site label:** Great Minnesota Bake Sale feature  
**Use for:** Community section, press page, seasonal campaign modules  
**URLs:**

- https://kstp.com/special-coverage/minnesota-live/great-minnesota-bake-sale-2/
- https://kstp.com/tcl/great-minnesota-bake-sale-yum-kitchen-bakery/

Why it matters:

Strong community-impact placement connecting Yum! with Open Arms of Minnesota.

## Additional press archive items

### MPR News / Appetites Passover popovers

**Outlet:** MPR News  
**Category:** Holiday & Catering / Food Culture  
**Priority:** 2  
**URL:** https://www.mprnews.org/story/2024/04/24/appetites-flaky-and-puffed-with-air-popovers-are-a-passover-staple

Use this for holiday/cultural food credibility.

### Mpls.St.Paul Magazine soup mention

**Outlet:** Mpls.St.Paul Magazine  
**Category:** Critic Mentions / Food Range  
**Priority:** 2  
**URL:** https://mspmag.com/eat-and-drink/foodie/lull-soup/

Use this to show range beyond bakery.

### Eater Twin Cities Rosh Hashanah guide

**Outlet:** Eater Twin Cities  
**Category:** Holiday & Catering  
**Priority:** 2  
**URL:** https://twincities.eater.com/2022/9/13/23351296/rosh-hashanah-twin-cities-minneapolis-st-paul-jewish-restaurant-deli

Use this for holiday ordering and catering credibility.

### Visit St. Paul Allianz Field guide

**Outlet:** Visit St. Paul  
**Category:** Location / Local Guide  
**Priority:** 2 or 3  
**URL:** https://www.visitsaintpaul.com/blog/all-about-allianz-guide-to-the-home-of-minnesota-united-fc/

Use this for the St. Paul location page.

### Star Tribune expansion to Minnetonka

**Outlet:** Star Tribune  
**Category:** Expansion & Business  
**Priority:** 2  
**URL:** https://www.startribune.com/yummy-news-yum-kitchen-and-bakery-to-expand-into-minnetonka/301453361

Use this for brand timeline.

### Star Tribune St. Paul opening coverage

**Outlet:** Star Tribune  
**Category:** Expansion & Business  
**Priority:** 2  
**URL:** https://www.startribune.com/yum-bakery-kitchen-st-paul-open-hours-ordering/600126989

Use this for St. Paul location history.

## Suggested page architecture

### Route: `/press`

Sections:

1. Hero
2. Featured recognition grid
3. Awards & lists
4. TV & video
5. Founder interviews
6. Bakery and dessert mentions
7. Community and events
8. Full archive

### Route: `/about`

Add modules:

- Founder-led story
- Made from scratch since 2005
- Recognition strip
- Community strip

### Route: `/bakery`

Add modules:

- Signature bakery items
- Patticake feature
- Press proof carousel
- Holiday ordering / custom cakes / catering CTA

### Route: `/locations/[slug]`

For each location page, optionally add location-specific mentions:

- St. Paul: Visit St. Paul / Allianz Field guide, Star Tribune opening coverage
- Woodbury: Woodbury Magazine feature
- Minnetonka / Shady Oak: Star Tribune expansion coverage
- St. Louis Park: original flagship language, brand-history framing

## Suggested UI components

### `PressCard`

Fields:

- Outlet
- Date
- Title
- Summary
- Category badge
- External link
- Featured flag

Behavior:

- Opens external articles in a new tab.
- Use `rel="noopener noreferrer"`.
- Do not scrape full article bodies.
- Use short summaries only.

### `FeaturedPressGrid`

Use 3 to 6 cards.

Best initial set:

1. Mpls.St.Paul Hall of Fame
2. Mpls.St.Paul Best Bakeries
3. Eater Best Desserts
4. Star Tribune best pies/cookies
5. KSTP Good Company founder interview
6. CBS/WCCO DeRusha Eats

### `PressFilterBar`

Filters:

- All
- Awards & Lists
- TV & Video
- Founder Story
- Bakery & Desserts
- Community
- Expansion
- Holiday & Catering

### `RecognitionStrip`

Small homepage module.

Example labels:

- Mpls.St.Paul Hall of Fame
- Eater Best Desserts
- Star Tribune Food Writer Picks
- KSTP Minnesota Live
- CBS/WCCO DeRusha Eats

### `SignatureItemProof`

Use on bakery/product modules.

Example:

**Patticake**  
Featured by Eater Twin Cities and Mpls.St.Paul Magazine as a Yum! signature.

## Suggested copy blocks

### Press page hero

**Headline:**

In the news.

**Body:**

Yum! Kitchen & Bakery has been recognized by Twin Cities food writers, local TV, podcasts, and community partners for its made-from-scratch food, signature bakery case, and neighborhood hospitality.

### Homepage credibility module

**Headline:**

Recognized across the Twin Cities food scene.

**Body:**

From best bakery lists to TV features and food-writer picks, Yum! has earned repeat recognition for its bakery case, seasonal food, and founder-led hospitality.

### Bakery proof module

**Headline:**

The Patticake is not quiet about itself.

**Body:**

Our signature triple-layer chocolate cake with vanilla buttercream has become one of Yum!’s most recognized bakery items, earning mentions from Twin Cities food media and regulars alike.

### Founder module

**Headline:**

Founder-led, every day.

**Body:**

Patti and Robbie Soskin built Yum! around the details that regulars notice: food made from scratch, a bakery case worth planning around, and a team that knows how to make a neighborhood restaurant feel personal.

### Community module

**Headline:**

Part of the local food community.

**Body:**

Yum! participates in community food events like the Great Minnesota Bake Sale, supporting organizations including Open Arms of Minnesota.

## SEO targets

Primary SEO themes:

- Twin Cities bakery
- Minneapolis bakery
- St. Louis Park bakery
- Minnetonka bakery
- St. Paul bakery
- Woodbury bakery
- Twin Cities cakes
- Patticake
- Best desserts Twin Cities
- Twin Cities holiday catering
- Passover food Twin Cities
- Rosh Hashanah takeout Twin Cities
- Twin Cities restaurant and bakery

Do not keyword-stuff. Use earned media as credibility, not filler.

## Structured data ideas

Use relevant schema where appropriate:

- `Restaurant`
- `Bakery`
- `LocalBusiness`
- `Organization`
- `NewsArticle` only for Yum-owned articles, not third-party articles
- `ItemList` for press mentions

## Content governance

1. Do not quote long passages from articles.
2. Use short summaries and outbound links.
3. Do not imply awards beyond what the article actually says.
4. Do not call every listicle an “award.” Use “featured,” “recognized,” “included,” or “named” when more precise.
5. Keep self-published Yum archive items separate from third-party editorial sources.
6. Prioritize current and authoritative sources.
7. Re-check links during build. Media URLs can change.

## Known caveats

- Yum’s own “In the News” page is a useful index but should not be treated as independent proof.
- Some third-party articles may be updated after publication.
- Some Star Tribune links may have metered access.
- Some KSTP segments may have different program labels, including Minnesota Live, Twin Cities Live, and Good Company.
- Search results may confuse Yum! Kitchen & Bakery with Yum! Brands or unrelated restaurants named Yum. Filter carefully.

## Build recommendation

Start with a static JSON or TypeScript data file for press items. This is faster and cleaner than building a CMS workflow before the content model is proven.

Recommended path:

```txt
/src/data/press.ts
/src/components/press/PressCard.tsx
/src/components/press/FeaturedPressGrid.tsx
/src/components/press/PressFilterBar.tsx
/src/components/press/RecognitionStrip.tsx
/src/app/press/page.tsx
```

If the site already uses a CMS, map the schema above into the CMS. Otherwise, use local typed data first.

## Initial press data seed

```ts
export const pressItems = [
  {
    id: "msp-hall-of-fame-2026",
    title: "Best Restaurants in the Twin Cities: Hall of Fame",
    outlet: "Mpls.St.Paul Magazine",
    date: "2026-03",
    year: 2026,
    category: "awards_lists",
    summary: "Yum! was included in Mpls.St.Paul Magazine’s Hall of Fame restaurant coverage, positioning it as a durable Twin Cities favorite.",
    url: "https://mspmag.com/eat-and-drink/best-restaurants-hall-of-fame/",
    priority: 1,
    featured: true,
    relatedTopics: ["restaurants", "Twin Cities", "founder story"],
    relatedProducts: []
  },
  {
    id: "msp-best-bakeries-2025",
    title: "Best Bakeries of the Twin Cities",
    outlet: "Mpls.St.Paul Magazine",
    date: "2025-09",
    year: 2025,
    category: "awards_lists",
    summary: "Yum! was included in a Twin Cities bakery roundup, with the Patticake highlighted as a signature item.",
    url: "https://mspmag.com/eat-and-drink/mill-city-rising-best-bakeries-of-the-twin-cities/",
    priority: 1,
    featured: true,
    relatedTopics: ["bakery", "desserts", "Twin Cities"],
    relatedProducts: ["Patticake"]
  },
  {
    id: "eater-best-desserts",
    title: "The Best Desserts at Restaurants in Minneapolis and St. Paul",
    outlet: "Eater Twin Cities",
    date: "2023-09",
    year: 2023,
    category: "bakery_desserts",
    summary: "Eater highlighted Yum!’s Patticake and bakery case among standout Twin Cities desserts.",
    url: "https://twincities.eater.com/maps/best-desserts-pastries-restaurants-minneapolis-st-paul",
    priority: 1,
    featured: true,
    relatedTopics: ["desserts", "bakery", "Patticake"],
    relatedProducts: ["Patticake", "Key lime pie", "cookies", "pull-apart bread"]
  },
  {
    id: "star-tribune-best-pies-2026",
    title: "The 10 best pies our food writers ate this week",
    outlet: "Star Tribune",
    date: "2026-03",
    year: 2026,
    category: "critic_mentions",
    summary: "Star Tribune food writers included Yum!’s mini French silk pie in a best-pies roundup.",
    url: "https://www.startribune.com/the-10-best-pies-our-food-writers-ate-this-week/601587853",
    priority: 1,
    featured: true,
    relatedTopics: ["pies", "bakery", "desserts"],
    relatedProducts: ["Mini French silk pie"]
  },
  {
    id: "star-tribune-chocolate-chip-cookies-2025",
    title: "Best chocolate chip cookies in the Twin Cities",
    outlet: "Star Tribune",
    date: "2025-08",
    year: 2025,
    category: "critic_mentions",
    summary: "Star Tribune included Yum! in its Twin Cities chocolate chip cookie coverage.",
    url: "https://www.startribune.com/here-are-the-15-best-chocolate-chip-cookies-in-the-twin-cities-bakery-gluten-free-dessert/600254733",
    priority: 1,
    featured: true,
    relatedTopics: ["cookies", "bakery", "desserts"],
    relatedProducts: ["Chocolate chip cookies"]
  },
  {
    id: "kstp-good-company-founder-2023",
    title: "Good Company: Yum! Kitchen & Bakery",
    outlet: "KSTP / Good Company",
    date: "2023-03",
    year: 2023,
    category: "tv_video",
    summary: "KSTP interviewed Patti Soskin about her journey building Yum! and the Woodbury expansion.",
    url: "https://kstp.com/tcl/good-company-yum-kitchen-bakery/",
    priority: 1,
    featured: true,
    relatedTopics: ["founder story", "TV", "Woodbury"],
    relatedProducts: []
  },
  {
    id: "cbs-wcco-derusha-eats-2019",
    title: "DeRusha Eats: Yum! Kitchen",
    outlet: "CBS / WCCO",
    date: "2019",
    year: 2019,
    category: "tv_video",
    summary: "CBS/WCCO featured Yum! and its bakery operation through DeRusha Eats.",
    url: "https://www.cbsnews.com/minnesota/news/derusha-eats-yum-kitchen/",
    priority: 1,
    featured: true,
    relatedTopics: ["TV", "bakery", "restaurant history"],
    relatedProducts: []
  },
  {
    id: "woodbury-mag-opening-2023",
    title: "Yum! Kitchen and Bakery Is Set To Open This Summer",
    outlet: "Woodbury Magazine",
    date: "2023-07",
    year: 2023,
    category: "expansion_business",
    summary: "Woodbury Magazine covered Yum!’s fourth location and Patti Soskin’s expansion into Woodbury.",
    url: "https://woodburymag.com/yum-kitchen-and-bakery-is-set-to-open-this-summer/",
    priority: 2,
    featured: false,
    relatedTopics: ["Woodbury", "expansion", "locations"],
    relatedProducts: []
  },
  {
    id: "kstp-great-minnesota-bake-sale-2025",
    title: "Great Minnesota Bake Sale",
    outlet: "KSTP / Minnesota Live",
    date: "2025-04",
    year: 2025,
    category: "community",
    summary: "KSTP covered Yum!’s participation in the Great Minnesota Bake Sale supporting Open Arms of Minnesota.",
    url: "https://kstp.com/special-coverage/minnesota-live/great-minnesota-bake-sale-2/",
    priority: 1,
    featured: true,
    relatedTopics: ["community", "Open Arms of Minnesota", "TV"],
    relatedProducts: []
  },
  {
    id: "mpr-passover-popovers-2024",
    title: "Popovers are a Passover staple",
    outlet: "MPR News / Appetites",
    date: "2024-04-24",
    year: 2024,
    category: "holiday_catering",
    summary: "MPR included Patti Soskin in coverage of Passover popovers and holiday food traditions.",
    url: "https://www.mprnews.org/story/2024/04/24/appetites-flaky-and-puffed-with-air-popovers-are-a-passover-staple",
    priority: 2,
    featured: false,
    relatedTopics: ["Passover", "holiday food", "bakery"],
    relatedProducts: ["Popovers"]
  }
];
```

## Codex task list

1. Create typed press data file.
2. Build reusable press card component.
3. Build featured press grid.
4. Build filterable press archive.
5. Add homepage recognition strip.
6. Add press proof module to bakery page.
7. Add founder media module to about page.
8. Add community module using Great Minnesota Bake Sale coverage.
9. Validate all outbound links.
10. Avoid long copied article text.
11. Add basic SEO metadata for press, bakery, about, and location pages.
12. Review language so press claims are accurate and not overstated.

## Definition of done

The implementation is ready when:

- Press page exists and is navigable.
- Featured recognition appears on homepage or relevant landing page.
- Press items are typed and easy to update.
- Links open externally and safely.
- Page copy distinguishes awards, features, mentions, and TV appearances.
- No third-party article body copy is reproduced.
- Mobile layout is clean.
- Highest-value proof points are visible without scrolling too far.
- The site can support new press items without redesigning the page.

