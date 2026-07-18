#!/usr/bin/env python3
from __future__ import annotations

import csv
import html
import json
import os
import shutil
import subprocess
import tempfile
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
SOCIAL = ROOT / "social"
OUT = SOCIAL / "yum-social-toolkit-2026"
DATA = OUT / "data"
REVIEW_ASSETS = OUT / "review-assets"
POST_PACK = SOCIAL / "yum-patticake-social-motion-pack"
MOTION_PACK = SOCIAL / "yum-social-motion-template-2026"
ACTIVE_PACK = SOCIAL / "yum-patticake-creative-launch-2026-07-14"
REVIEW_RENDERER_ROOT = Path.home() / ".codex" / "plugins" / "cache" / "openai-curated-remote" / "creative-production"
HISTORICAL_REVIEW_STATE = [
    Path("review-assets"),
    Path("contact-sheet.png"),
    Path("review-board.html"),
    Path("data/review-manifest.json"),
    Path("data/review-options.json"),
    Path("data/stream-static.json"),
    Path("data/stream.json"),
    Path("generated"),
    Path("latest-action.json"),
    Path("moodboard-widget-payload.json"),
    Path("run-state.json"),
]


def resolve_review_renderer() -> Path | None:
    configured = os.environ.get("CREATIVE_PRODUCTION_REVIEW_RENDERER")
    if configured:
        path = Path(configured).expanduser()
        if path.is_file():
            return path
        raise FileNotFoundError(f"Configured Creative Production renderer not found: {path}")

    candidates = sorted(REVIEW_RENDERER_ROOT.glob("*/scripts/review_renderer.py"), reverse=True)
    if candidates:
        return candidates[0]
    return None

TODAY = date(2026, 7, 9)

DESTINATIONS = {
    "yum_home": "https://yumkitchen.com/yum-kitchen",
    "menu": "https://yumkitchen.com/menu",
    "order": "https://yumkitchen.com/order",
    "catering": "https://yumkitchen.com/catering#inquiry",
    "locations": "https://yumkitchen.com/yum-kitchen#locations",
    "gift_cards": "https://www.toasttab.com/yumkitchenslp/giftcards",
    "patticake": "https://patticake.com/patticake",
    "cake_request": "https://patticake.com/order-a-cake",
    "contact": "https://yumkitchen.com/contact",
    "slp": "https://yumkitchen.com/location/st-louis-park",
    "shady_oak": "https://yumkitchen.com/location/shady-oak",
    "saint_paul": "https://yumkitchen.com/location/saint-paul",
    "woodbury": "https://yumkitchen.com/location/woodbury",
}

LOCATIONS = [
    {
        "id": "slp",
        "name": "St. Louis Park",
        "slug": "st-louis-park",
        "context": "the original Minnetonka Boulevard kitchen",
        "photo": "yum-location-slp.jpg",
    },
    {
        "id": "shady_oak",
        "name": "Shady Oak",
        "slug": "shady-oak",
        "context": "the Minnetonka and Hopkins neighborhood stop",
        "photo": "yum-location-shady-oak.jpg",
    },
    {
        "id": "saint_paul",
        "name": "St. Paul",
        "slug": "saint-paul",
        "context": "the Snelling Avenue kitchen",
        "photo": "yum-location-saint-paul.jpg",
    },
    {
        "id": "woodbury",
        "name": "Woodbury",
        "slug": "woodbury",
        "context": "the east metro City Centre kitchen",
        "photo": "yum-location-woodbury.jpg",
    },
]

PILLARS = [
    {
        "name": "made-from-scratch food",
        "brand": "yum!",
        "audience": "neighborhood regulars, families, first-time guests",
        "goal": "local orders and repeat visits",
        "ideas": "pan-to-plate sequence; soup and sandwich pairing; breakfast assembly; dinner pickup handoff",
        "channels": "Reels, TikTok, Feed, Shorts, GBP",
        "ctas": "Order online; See the menu; Pick your kitchen",
        "assets": "Reel, Short, carousel, paid ad",
    },
    {
        "name": "bakery case and daily treats",
        "brand": "yum!",
        "audience": "regulars, parents, office buyers",
        "goal": "same-day bakery visits and add-on orders",
        "ideas": "morning restock; close-up tray pull; case scan; meeting tray build",
        "channels": "Stories, Reels, Feed, GBP",
        "ctas": "Stop by today; Add something sweet; Find a location",
        "assets": "Story, Reel, static, GBP post",
    },
    {
        "name": "Patticake gifting",
        "brand": "Patticake",
        "audience": "long-distance gift senders, former Minnesotans, gift buyers",
        "goal": "cake orders and gift reminders",
        "ideas": "pack a cake; add a note; delivery-date reminder; unboxing and first slice",
        "channels": "Reels, TikTok, Pinterest, Feed, paid",
        "ctas": "Send a Patticake; Ship nationwide; Start an order",
        "assets": "Reel, Pin, carousel, conversion ad",
    },
    {
        "name": "birthday and celebration moments",
        "brand": "Patticake",
        "audience": "parents, partners, friends, office planners",
        "goal": "birthday pickup, shipping, and inquiry demand",
        "ideas": "cake pickup POV; first slice; message writing; office birthday table",
        "channels": "Reels, Stories, Pinterest, paid",
        "ctas": "Plan the birthday cake; Pick up locally; Send a cake",
        "assets": "Reel, Story sequence, Pin, paid ad",
    },
    {
        "name": "office catering",
        "brand": "yum!",
        "audience": "office managers, HR, executive assistants, catering buyers",
        "goal": "qualified catering leads",
        "ideas": "boxed lunch assembly; room-ready spread; bakery add-ons; planner checklist",
        "channels": "LinkedIn, Instagram, Facebook, GBP, paid",
        "ctas": "Start a catering note; Plan lunch; Get a quote",
        "assets": "carousel, Reel, lead ad, Story",
    },
    {
        "name": "four neighborhoods",
        "brand": "yum!",
        "audience": "nearby guests and commuters",
        "goal": "directions, location-page visits, and local orders",
        "ideas": "storefront walk-in; neighborhood errand pairing; parking arrival; four-kitchen montage",
        "channels": "Feed, Stories, Reels, GBP, local paid",
        "ctas": "Find your yum!; Get directions; Order from this kitchen",
        "assets": "location Reel, static, Story, local ad",
    },
    {
        "name": "staff favorites",
        "brand": "yum!",
        "audience": "regulars and menu explorers",
        "goal": "human trust, menu discovery, and repeat orders",
        "ideas": "one staff member, one order; counter recommendation; kitchen handoff; bakery pick",
        "channels": "Reels, TikTok, Stories, Feed",
        "ctas": "Try their order; See the menu; Tell us your favorite",
        "assets": "creator-style Reel, Story poll, portrait",
    },
    {
        "name": "seasonal drops",
        "brand": "both",
        "audience": "regulars, occasion buyers, lapsed guests",
        "goal": "urgency, saves, and reactivation",
        "ideas": "first tray out; limited bakery detail; seasonal menu close-up; deadline reminder",
        "channels": "Stories, Reels, Feed, GBP, paid",
        "ctas": "See what is available; Order this week; Check the deadline",
        "assets": "drop Reel, Story countdown, static, retargeting ad",
    },
    {
        "name": "gift cards",
        "brand": "yum!",
        "audience": "last-minute gift buyers, employers, families",
        "goal": "gift card sales",
        "ideas": "digital gift in three taps; teacher gift; host gift; employee thank-you",
        "channels": "Feed, Stories, Facebook, email crossover, paid",
        "ctas": "Buy a gift card; Send yum!; Check your balance",
        "assets": "static, Story, paid ad, email module",
    },
    {
        "name": "weddings and events",
        "brand": "Patticake",
        "audience": "couples, shower planners, event hosts",
        "goal": "qualified cake inquiries",
        "ideas": "tiered cake details; cutting moment; event table; inquiry checklist",
        "channels": "Pinterest, Reels, Feed, Stories, paid",
        "ctas": "Start a cake inquiry; Share your date; Plan the cake",
        "assets": "Pin, carousel, Reel, lead ad",
    },
]


TEMPLATES = [
    ("yum-local-order", "yum! local order post", "Move nearby guests into online ordering.", "1080x1350 and 1080x1920", "Unobstructed meal or pickup image beside a dedicated baby-blue field with logo-red headline and CTA.", "Real order handoff or plated menu image.", "lowercase Trocchi, 3-7 words", "One decision, one location cue, one action.", "Order Online", "meal, daypart, location", "Instagram, Facebook, GBP, paid", "order", "yum_local-order_{location}_{date}_v##"),
    ("yum-menu-feature", "yum! menu feature post", "Create menu discovery without unsupported availability claims.", "1080x1350 carousel or 1080x1920 Reel", "Macro food proof first; ingredient or preparation beats second; red CTA last.", "Current menu item or verified seasonal item.", "specific dish name in lowercase", "Describe what is visible and point to the current menu.", "See the Menu", "single item, pairing, preparation", "Instagram, TikTok, Shorts, paid", "menu", "yum_menu_{item}_{format}_{date}_v##"),
    ("yum-bakery-case", "yum! bakery case post", "Drive same-day visits and bakery add-ons.", "1080x1350 and 1080x1920", "Case scan or tray pull; blue caption tab; no inventory promise beyond the capture time.", "Fresh case footage from that location and day.", "what is in the case today", "Use 'today at capture time' language and invite an in-person check.", "Find a Location", "case scan, tray detail, staff pick", "Stories, Reels, GBP", "locations", "yum_bakery-case_{location}_{date}_v##"),
    ("yum-catering", "yum! catering post", "Generate qualified catering inquiries.", "1080x1350 carousel and 1080x1920 Reel", "Finished spread first; assembly proof; planner checklist; inquiry CTA.", "Real boxed lunches, trays, bakery add-ons, and room setup.", "feed the room", "Name the occasion and planning friction solved. Avoid unsupported capacity claims.", "Start a Catering Note", "office lunch, meeting, celebration", "Instagram, Facebook, LinkedIn, paid", "catering", "yum_catering_{occasion}_{format}_{date}_v##"),
    ("yum-location", "yum! location-specific post", "Build local relevance and direction clicks.", "1080x1350 and 1080x1920", "Storefront or room; neighborhood label; map-safe location CTA.", "Current exterior, counter, dining room, or staff image.", "your {location} yum!", "Tie the post to a real nearby routine without inventing landmarks.", "Get Directions", "four individual locations", "Instagram, Facebook, GBP, local paid", "location", "yum_location_{location}_{concept}_{date}_v##"),
    ("yum-gift-card", "yum! gift card post", "Drive gift card purchases.", "1080x1350 and 1080x1920", "Gift card or phone UI shown cleanly; red circle logo; white or blue copy surface.", "Verified gift card visual or real handoff.", "send lunch for later", "Connect the gift to a specific recipient and occasion.", "Buy a Gift Card", "teacher, host, employee, family", "Instagram, Facebook, Stories, email crossover", "gift-cards", "yum_gift-card_{occasion}_{date}_v##"),
    ("patticake-birthday", "Patticake birthday post", "Convert birthday intent into cake action.", "1080x1350 and 1080x1920", "Cake reveal; message detail; first slice; red CTA.", "Real Patticake, candle or message, and hands.", "a birthday cake that feels planned", "Name the recipient or moment, then route to pickup or shipping options.", "Plan the Cake", "pickup, shipped gift, office birthday", "Instagram, TikTok, Pinterest, paid", "cake_request", "patticake_birthday_{route}_{date}_v##"),
    ("patticake-thank-you", "Patticake thank-you gift post", "Create occasion demand beyond birthdays.", "1080x1350 and 1000x1500", "Gift box and note first; slice proof second; destination CTA third.", "Gift box, note card, hands, and cake slice.", "thank you, but make it cake", "Call out who deserves the thanks and keep fulfillment details current.", "Send a Patticake", "client, teacher, neighbor, host", "Instagram, Pinterest, Facebook, paid", "patticake", "patticake_thank-you_{recipient}_{date}_v##"),
    ("patticake-shipped", "Patticake shipped cake post", "Drive nationwide cake shipping orders.", "1080x1920 Reel and 1000x1500 Pin", "Pack, seal, message, handoff, unbox. Lead with nationwide availability and leave exact dates to checkout.", "Real packing process and current packaging.", "pack a Patticake with us", "Describe the steps visible. Do not promise a date until checkout confirms it.", "Ship Nationwide", "packing, unboxing, first slice", "Reels, TikTok, Shorts, Pinterest, paid", "patticake", "patticake_shipping_{concept}_{date}_v##"),
    ("patticake-pickup", "Patticake local pickup post", "Convert local celebration demand.", "1080x1350 and 1080x1920", "Boxed cake at counter; location selection; pickup handoff.", "Real box, counter, and staff handoff.", "birthday pickup, handled", "Route to the request or order flow and avoid claiming availability.", "Pick Up Locally", "location, office, family", "Instagram, Facebook, Stories, local paid", "cake_request", "patticake_pickup_{location}_{date}_v##"),
    ("patticake-corporate", "Patticake corporate gifting post", "Generate bulk gifting leads.", "1080x1350 carousel and 1080x1920 Reel", "Recipient occasion; repeatable packing; message option; inquiry CTA.", "Multiple boxes, note workflow, and real gifting setup.", "client thank-yous people remember", "Speak to planners. Use inquiry language for quantity, timing, and addresses.", "Ask About Corporate Gifting", "clients, teams, partners", "LinkedIn, Instagram, Facebook, paid", "cake_request", "patticake_corporate-gifting_{audience}_{date}_v##"),
    ("patticake-wedding", "Patticake wedding and event post", "Generate qualified event inquiries.", "1000x1500 Pin, 1080x1350, 1080x1920", "Tiered cake proof; detail crop; event scene; inquiry CTA.", "Real event cake and venue details with permission.", "cake for the table you planned", "Invite date, guest context, and inspiration. Do not promise customization.", "Start an Event Inquiry", "wedding, shower, rehearsal, event", "Pinterest, Instagram, paid", "cake_request", "patticake_event_{occasion}_{date}_v##"),
    ("seasonal-campaign", "seasonal campaign post", "Create timely demand without stale claims.", "1080x1350, 1080x1920, 1200x628", "Current product hero; date or availability line; one CTA.", "Verified seasonal item or occasion footage.", "seasonal line tied to the actual item", "Include a publish-by date and owner confirmation field.", "See What Is Available", "food, bakery, gifting", "all social, GBP, email crossover, paid", "menu", "{brand}_seasonal_{campaign}_{date}_v##"),
    ("testimonial", "customer quote or testimonial post", "Add proof without fake or unattributed reviews.", "1080x1350 carousel", "Unobstructed real image beside a dedicated baby-blue quote field with logo-red type, source, and date.", "Approved review text with source record and usage approval.", "short attributed quote", "Keep the exact quote and route to the relevant action.", "See the Menu", "yum!, Patticake, catering", "Instagram, Facebook, paid retargeting", "menu", "{brand}_testimonial_{source}_{date}_v##"),
    ("review", "review post", "Turn verified review proof into a conversion assist.", "1080x1350", "Real review screenshot or exact transcription; photo proof; CTA.", "Verified live review with captured URL and date.", "what guests noticed", "Never rewrite a quote. Remove private information.", "Order Online", "location, catering, gifting", "Instagram, Facebook, Stories", "order", "{brand}_review_{source}_{date}_v##"),
    ("staff-favorite", "staff favorite post", "Humanize recommendations and drive menu exploration.", "1080x1920 Reel and 1080x1350", "Staff face or hands; order build; final plate; name and location.", "Consent-cleared staff footage and current menu item.", "{name}'s yum! order", "One reason they order it, one visible proof point, one CTA.", "Try the Order", "staff, baker, counter, kitchen", "Reels, TikTok, Stories", "menu", "yum_staff-pick_{location}_{name}_{date}_v##"),
    ("limited-drop", "limited-time drop post", "Create urgency around verified limited availability.", "1080x1920 and 1080x1350", "Product reveal; date range; location or channel; CTA.", "Same-day or campaign-approved product capture.", "here while it is here", "State only approved dates and locations. Add an internal expiry date.", "Check Availability", "bakery, seasonal menu, gifting", "Stories, Reels, GBP, paid", "menu", "{brand}_drop_{item}_{date}_v##"),
    ("story-order", "Order Now Story frame", "Move viewers directly to ordering.", "1080x1920", "Food photo; 3-5 word headline; red button zone above bottom UI.", "Current food or pickup image.", "lunch is handled", "One support line maximum.", "Order Now", "daypart, location, menu category", "Instagram Stories, Facebook Stories", "order", "yum_story_order_{concept}_{date}_v##"),
    ("story-quote", "Get Quote Story frame", "Generate catering leads.", "1080x1920", "Unobstructed spread photo beside a baby-blue field for the planner hook, proof, and native link cue.", "Real catering setup and optional planner hands.", "feed the room", "Mention pickup and route to the inquiry. Confirm notice language before posting.", "Get a Quote", "office, meeting, event", "Instagram Stories, Facebook Stories", "catering", "yum_story_catering-quote_{occasion}_{date}_v##"),
    ("story-send-cake", "Send a Cake Story frame", "Convert Patticake gifting intent.", "1080x1920", "Real gift box, note, and slice beside a baby-blue field with logo-red type and native link cue.", "Real Patticake packing or gifting image.", "send cake, not a card", "Lead with nationwide availability or the current local pickup path.", "Send a Cake", "birthday, thank-you, client", "Instagram Stories, Facebook Stories", "patticake", "patticake_story_send-cake_{occasion}_{date}_v##"),
]


CHANNELS = [
    ("Instagram Feed", "1080x1440 3:4 or 1080x1350 4:5; 1080x1080 fallback", "Keep logo and text 64 px from edges; carousel focal point consistent across cards.", "Aim for 80-220 useful characters before optional detail.", "3-5 relevant hashtags after the message, not a hashtag wall.", "Use one direct action and one destination.", "3-4 feed posts per week across both brands.", "3:4 photos, 4:5 carousels, proof-led statics.", "Create separate 4:5 paid crops and verify the CTA destination."),
    ("Instagram Reels", "1080x1920, 9:16, 30 fps or higher", "Primary text zone x 88-892 and y 250-1460 on a 1080x1920 master; check cover crop separately.", "Hook in first line; keep supporting copy short enough to scan.", "2-5 precise hashtags; include searchable dish, occasion, and location terms.", "Burn in the core action and use the profile or ad link path.", "3 Reels per week across both brands.", "8-20 second native motion, process, hands, first-slice, location POV.", "Use 9:16 with audio and key messages inside the safe zone."),
    ("Instagram Stories", "1080x1920, 9:16", "Keep key text above y 1460 and below y 250; reserve right rail for UI.", "One idea per frame, 3-12 words on screen.", "Skip hashtags unless one campaign tag is useful.", "Link sticker plus a visible action label.", "5-7 days per week for yum!, 3-5 for Patticake.", "3-frame sequence, poll, countdown, link frame.", "Build a clean 9:16 version with no organic sticker baked in."),
    ("TikTok", "1080x1920, 9:16; MP4 or MOV", "Use the same conservative center-left safe zone; preview with app UI.", "Write a searchable first sentence and a plain-language CTA.", "2-5 niche tags; favor search phrases over trend stuffing.", "Say the action on screen and in voiceover.", "2-3 posts per week.", "9-20 second process, POV, staff voice, unboxing, decision guide.", "TikTok says ads must be dynamic, legible, high resolution, 5-60 seconds, and include audio."),
    ("Facebook Feed", "1080x1350 4:5 and 1200x628 link fallback", "Keep text away from lower link-preview crop and mobile edge truncation.", "Use 1-3 short paragraphs with the location or occasion up front.", "0-3 hashtags; local context matters more.", "Use platform CTA for paid; link directly for organic.", "3 posts per week, with location and catering emphasis.", "4:5 food, location, gifting, catering, event posts.", "Split local order, catering lead, and gifting audiences by intent."),
    ("Facebook Stories", "1080x1920, 9:16", "Use the vertical safe zone and keep the CTA above the bottom UI.", "One line per frame.", "No hashtag requirement.", "Use a link sticker or ad CTA.", "Repurpose the strongest Instagram Story sequences.", "3-frame direct-response stories.", "Remove Instagram-only stickers before paid export."),
    ("Pinterest", "1000x1500 2:3 for image Pins; 1080x1920 9:16 for full-bleed video", "For 1080x1920 video keep text inside top 270, left 65, right 195, bottom 790 offsets per Pinterest guidance.", "Titles under 100 characters; prioritize the first 40. Write keyword-rich descriptions.", "Use search keywords in title and description instead of hashtag blocks.", "Every Pin gets one precise destination URL.", "4-6 original Pins per week.", "Cake occasions, catering checklists, local bakery, vertical process video.", "Use fresh creative and a destination link; avoid repeated duplicate Pins."),
    ("YouTube Shorts", "1080x1920 preferred; square or vertical uploads up to 3 minutes can classify as Shorts", "Keep captions in the same vertical safe zone and avoid the right rail.", "Use a searchable title and one short description with destination.", "Use 1-3 tags only when they aid discovery.", "Use a spoken and end-card CTA; link in description/profile where available.", "1-2 Shorts per week.", "15-30 second process, guide, first slice, catering build.", "Reuse only music and audio cleared for the intended use."),
    ("Google Business Profile", "720x720 JPG or PNG recommended; video 720p or higher, up to 30 seconds", "Keep key subject centered; Google may crop surfaces differently.", "80-180 characters is enough for a useful local update.", "No hashtag requirement.", "Use the action button to order, learn more, or visit the relevant page.", "1 post per location per week.", "Storefront, food, bakery, catering, Patticake pickup.", "Posts may archive after six months; use valid offer and event dates."),
    ("Meta Paid Ads", "1080x1350 4:5 feed; 1080x1920 9:16 Stories/Reels; 1080x1080 fallback", "Build placement-native crops. Keep 9:16 messages inside the safe zone.", "Front-load the occasion, proof, and next action.", "No hashtag dependence.", "Use Order Now, Learn More, Contact Us, or Shop Now based on destination.", "Always-on tests with weekly creative review.", "UGC-style video, process proof, clear product image, local proof.", "Separate objective, audience, creative angle, and destination. Never boost a post with a mismatched CTA."),
]


CALENDAR = [
    (1, "yum!", "Instagram Reel + TikTok", "made-from-scratch food", "First-time yum! lunch guide", "15s vertical video", "what we would order on a first yum! lunch", "Show three verified menu paths and a final pickup handoff.", "See the Menu", "menu", "yes", "Paid-ready local order creative. Use current menu footage."),
    (2, "Patticake", "Instagram Feed + Pinterest", "Patticake gifting", "Send cake, not a card", "4:5 static + 2:3 Pin", "send cake, not a card", "Gift box, personal note, and a real slice. Patticake is available nationwide; leave exact dates to checkout.", "Send a Patticake", "patticake", "yes", "Paid-ready gifting. No delivery deadline claim."),
    (3, "yum!", "Stories + GBP", "bakery case and daily treats", "Morning bakery case restock", "3-frame Story + square photo", "first look at today's bakery case", "Film the real case at open and label the capture location.", "Find a Location", "locations", "no", "Bakery post 1. Do not imply all-day stock."),
    (4, "yum!", "Instagram Feed + GBP", "four neighborhoods", "St. Louis Park location spotlight", "4:5 photo", "the original yum! on Minnetonka Boulevard", "Storefront, counter, and an order pickup moment.", "Visit St. Louis Park", "slp", "no", "Location post 1."),
    (5, "yum!", "LinkedIn + Facebook + Instagram", "office catering", "Meeting lunch without the last-minute scramble", "carousel", "the office lunch upgrade nobody complains about", "Show boxed lunches, trays, and bakery add-ons. Keep quantities unclaimed.", "Start a Catering Note", "catering", "yes", "Catering post 1. Paid lead-gen ready."),
    (6, "Patticake", "Reel + Shorts", "birthday and celebration moments", "Cut the first slice", "12s vertical video", "the part of the birthday everyone waits for", "Move from full cake to knife to layered slice.", "Plan the Cake", "cake_request", "no", "Birthday gifting post 1."),
    (7, "yum!", "Stories", "staff favorites", "Counter team favorite", "3-frame Story", "ask the person behind the counter", "Staff member names one current menu favorite and why.", "See the Menu", "menu", "no", "Human post 1. Get staff consent."),
    (8, "yum!", "Instagram Reel + TikTok", "bakery case and daily treats", "Tray to bakery case", "10s vertical video", "from the tray to the case", "Capture a real tray placement and the finished display.", "Stop By Today", "locations", "no", "Bakery post 2."),
    (9, "Patticake", "Stories + Facebook", "Patticake gifting", "Thank-you cake sequence", "3-frame Story", "thank you, but make it cake", "Who it is for, how the note works, and where to start.", "Send a Cake", "patticake", "no", "Gifting post 2."),
    (10, "yum!", "Instagram Feed + GBP", "four neighborhoods", "Shady Oak location spotlight", "4:5 photo", "your Minnetonka lunch stop", "Show exterior, easy arrival, and one current food detail.", "Visit Shady Oak", "shady_oak", "no", "Location post 2."),
    (11, "yum!", "Instagram Carousel + LinkedIn", "office catering", "Box lunch assembly", "carousel", "what goes into a room-ready lunch", "Assembly order, labels, finished boxes, pickup handoff.", "Plan Catering", "catering", "no", "Catering post 2."),
    (12, "Patticake", "Instagram Reel + TikTok", "Patticake gifting", "Pack a Patticake with us", "15s vertical video", "pack a Patticake order with us", "Box, cake, message, ribbon, handoff. Show only current packaging.", "Ship Nationwide", "patticake", "yes", "Gifting post 3. Paid-ready process proof."),
    (13, "yum!", "Facebook + Stories", "gift cards", "Teacher thank-you gift card", "4:5 static + Story", "lunch for the person who kept the year moving", "Show the verified gift card purchase flow or real gift handoff.", "Buy a Gift Card", "gift_cards", "no", "No discount or expiry claim."),
    (14, "yum!", "Instagram Reel + Shorts", "made-from-scratch food", "Rainy-day comfort food", "12s vertical video", "Minnesota weather has a lunch order", "Steam, spoon, sandwich cut, pickup bag.", "Order Online", "order", "no", "Use current item footage."),
    (15, "Patticake", "Pinterest + Instagram Feed", "weddings and events", "Wedding cake detail study", "2:3 Pin + 4:5 carousel", "cake for the table you planned", "Tier, piping, cut, and table context with permission.", "Start an Event Inquiry", "cake_request", "no", "No custom-design promise."),
    (16, "yum!", "Instagram Feed + GBP", "four neighborhoods", "St. Paul location spotlight", "4:5 photo", "yum! on Snelling", "Exterior and an everyday breakfast, lunch, or pickup moment.", "Visit St. Paul", "saint_paul", "no", "Location post 3."),
    (17, "yum!", "Stories + GBP", "bakery case and daily treats", "Bakery case this-or-that", "poll Story + square photo", "which one is leaving with you?", "Use two items actually in the photographed case.", "Find a Location", "locations", "no", "Bakery post 3. Expire after the day."),
    (18, "yum!", "LinkedIn + Instagram Reel", "office catering", "Bakery tray for the meeting", "12s vertical video", "the meeting starts better with a bakery tray", "Show tray build, cover, and table arrival.", "Start a Catering Note", "catering", "no", "Catering post 3."),
    (19, "Patticake", "Instagram Feed + Facebook", "birthday and celebration moments", "Office birthday cake", "4:5 carousel", "an office birthday that does not feel like an afterthought", "Box arrival, message, candles, first slice. Use consent-cleared hands.", "Plan the Cake", "cake_request", "no", "Birthday gifting post 4."),
    (20, "yum!", "Instagram Reel + TikTok", "staff favorites", "Baker's case pick", "15s vertical video", "what the bakery team takes home", "One baker, one real case pick, one close-up.", "See the Bakery Menu", "menu", "no", "Human post 2."),
    (21, "yum!", "Instagram Feed + GBP", "four neighborhoods", "Woodbury location spotlight", "4:5 photo", "east metro, this is your yum!", "Show exterior, family table, and pickup counter.", "Visit Woodbury", "woodbury", "no", "Location post 4."),
    (22, "Patticake", "Reel + Shorts + Pinterest", "Patticake gifting", "Minnesota nostalgia gift", "15s vertical video", "send a little Twin Cities home", "Gift box, note, cake layers, recipient handoff. Avoid unverified geography claims.", "Send a Patticake", "patticake", "no", "Gifting post 5."),
    (23, "yum!", "Instagram Carousel + Facebook", "office catering", "Catering add-ons checklist", "carousel", "do not forget the bakery tray", "Main meal, sides, bakery, labels, pickup plan.", "Plan Catering", "catering", "yes", "Catering post 4. Paid-ready lead creative."),
    (24, "yum!", "Stories + Instagram Feed", "seasonal drops", "Current seasonal close-up", "Story + 4:5 photo", "on the menu right now", "Show the verified item and point to the live menu.", "See the Menu", "menu", "no", "Owner must confirm item before scheduling."),
    (25, "Patticake", "Instagram Reel + TikTok", "Patticake gifting", "Client thank-you gift", "15s vertical video", "the client thank-you that gets opened first", "Note, packaging, layer proof, address workflow.", "Ask About Corporate Gifting", "cake_request", "yes", "Corporate gifting post. Paid-ready lead creative."),
    (26, "yum!", "GBP all locations + Facebook", "bakery case and daily treats", "Weekend bakery stop", "square photo", "bring something sweet to the table", "Use a current bakery image and location-specific destination.", "Find a Location", "locations", "no", "Bakery post 4. Create one version per location."),
    (27, "yum!", "Instagram Reel + TikTok", "staff favorites", "Behind the counter handoff", "12s vertical video", "the last ten seconds before your order is yours", "Bag check, name call, handoff, thank-you.", "Order Online", "order", "no", "Human post 3. Clear guest faces or get consent."),
    (28, "Patticake", "Stories + Pinterest", "birthday and celebration moments", "Graduation cake reminder", "3-frame Story + Pin", "the graduate gets the first slice", "Occasion, message option, current pickup or delivery path.", "Plan the Cake", "cake_request", "no", "Use a confirmed campaign window."),
    (29, "yum!", "LinkedIn + Facebook + GBP", "office catering", "Office lunch planning checklist", "carousel", "five things to settle before you feed the room", "Date, headcount, dietary questions, pickup plan, bakery add-ons.", "Start a Catering Note", "catering", "no", "Catering post 5. Do not promise dietary accommodation."),
    (30, "both", "Instagram Carousel + Stories", "seasonal drops", "Month-end save and send roundup", "carousel + link Stories", "save this for the next lunch, birthday, or meeting", "One yum! order, one catering spread, one Patticake gift, one location frame.", "Choose Your Next Move", "yum_home", "no", "Keep brand sections distinct inside the carousel."),
]


CAPTION_GROUPS = {
    "A. yum! local restaurant": [
        ("Lunch does not need a committee. Pick your nearest yum!, choose what sounds good, and send the order to the kitchen.", "Order Online", "Instagram Feed", "conversion", "Pickup bag, counter handoff, and current meal."),
        ("Breakfast, lunch, dinner, and the bakery case all live under one red circle. Start with the menu, then choose your Twin Cities kitchen.", "See the Menu", "Facebook", "consideration", "Four quick daypart cuts and the yum! logo."),
        ("The St. Louis Park move: order ahead, swing by Minnetonka Boulevard, and let dinner be handled.", "Order from St. Louis Park", "Instagram Feed", "conversion", "St. Louis Park exterior and pickup handoff."),
        ("Shady Oak has your weekday lunch plan. Check the current menu, order from the Minnetonka kitchen, and pick it up on your schedule.", "Order from Shady Oak", "Facebook", "conversion", "Shady Oak storefront and plated lunch."),
        ("On Snelling and hungry? Start with the St. Paul menu, then decide whether this is a table day or a take-it-home day.", "Visit St. Paul", "Instagram Feed", "consideration", "St. Paul room, food, and carryout bag."),
        ("East metro dinner can be this simple: choose Woodbury, place the order, and bring yum! home.", "Order from Woodbury", "Facebook", "conversion", "Woodbury exterior and family pickup."),
        ("First visit? Start with the craving, not the whole menu. Soup and sandwich, breakfast, salad, dinner, or something from the bakery case.", "Explore the Menu", "Instagram Carousel", "consideration", "Five-card first-order guide using current categories."),
    ],
    "B. yum! bakery": [
        ("The bakery case is not background scenery. It is the part of the order you decide on after you thought you were done.", "Find a Location", "Instagram Reel", "consideration", "Slow case scan ending on a bakery box."),
        ("Morning restock, one tray at a time. This is what the bakery case looked like at {CAPTURE_TIME} in {LOCATION}.", "Stop By Today", "Instagram Stories", "conversion", "Time-stamped tray-to-case footage."),
        ("A meeting tray that makes the conference room feel less like a conference room.", "Plan Catering", "LinkedIn", "consideration", "Bakery tray arriving on a meeting table."),
        ("Pick the meal. Then pick the thing you are saving for later.", "See the Bakery Menu", "Instagram Feed", "conversion", "Meal beside a boxed bakery item."),
        ("This-or-that from the real {LOCATION} bakery case. Vote before somebody else takes your pick.", "Vote in Stories", "Instagram Stories", "engagement", "Two same-day case items with poll sticker."),
        ("The tray is full now. The case may not be later. Check your nearest yum! for today's bakery selection.", "Find Your yum!", "Google Business Profile", "conversion", "Fresh tray with location label."),
        ("Bring dessert is a complete dinner plan when the dessert comes from the yum! bakery case.", "Find a Location", "Facebook", "consideration", "Hands placing bakery box on a home table."),
    ],
    "C. yum! catering": [
        ("The office lunch upgrade nobody complains about: a room-ready spread, a pickup plan, and bakery add-ons people notice.", "Start a Catering Note", "LinkedIn", "conversion", "Wide catering spread plus labels and bakery tray."),
        ("Boxed lunches are easier when the details are settled before pickup. Tell us the date, group size, location, and what the room needs.", "Plan Catering", "Facebook", "conversion", "Box assembly and inquiry-form screen."),
        ("The meeting is on the calendar. Lunch should be too. Start the catering note before it becomes tomorrow's problem.", "Get a Quote", "Instagram Feed", "conversion", "Calendar, catering boxes, and table setup."),
        ("Main meal, sides, bakery, pickup. Save this four-part checklist for the next time you feed the room.", "View Catering", "Instagram Carousel", "consideration", "Four-card catering checklist."),
        ("A bakery tray is not an afterthought. It is the part the room remembers after the slides are closed.", "Add Bakery to the Plan", "LinkedIn", "consideration", "Bakery tray beside laptops and coffee."),
        ("Planning lunch for more than your usual table? Start with a catering note so the yum! team can help route the details.", "Start a Catering Note", "Google Business Profile", "conversion", "Pickup-ready trays at the counter."),
        ("For best availability, the current yum! catering page asks for 24 hours of notice for most pickup orders. Bigger plans should start with a note or a call to the pickup restaurant.", "Plan Catering", "Facebook", "conversion", "Catering page and real pickup handoff."),
    ],
    "D. yum! gift cards": [
        ("Send lunch for later. A yum! gift card gives them the choice of breakfast, dinner, bakery, or the order they always get.", "Buy a Gift Card", "Instagram Feed", "conversion", "Gift card on white with real food around it."),
        ("Teacher thank-you, solved: one yum! gift card and a note about the lunches they earned.", "Buy a Gift Card", "Facebook", "conversion", "Gift card and handwritten thank-you note."),
        ("A host gift that does not need shelf space. Send a yum! gift card before you head out the door.", "Send a Gift Card", "Instagram Stories", "conversion", "Phone purchase flow and arrival at a dinner table."),
        ("For the coworker who knows everybody's lunch order by memory.", "Buy a Gift Card", "LinkedIn", "awareness", "Gift card beside labeled lunch bags."),
        ("Last-minute does not have to look last-minute. Make it a yum! meal they can choose themselves.", "Buy a Gift Card", "Facebook", "conversion", "Digital gift card and current menu montage."),
        ("Birthday today, dinner later. A yum! gift card keeps the celebration useful.", "Send a Gift Card", "Instagram Feed", "conversion", "Birthday note, gift card, and takeout bag."),
        ("Already have a yum! gift card? Check the balance before the next bakery-case stop.", "Check Balance", "Google Business Profile", "retention", "Gift card and bakery case."),
    ],
    "E. Patticake birthday": [
        ("A birthday cake that does not feel like a backup plan: real chocolate layers, vanilla buttercream, and a message made for the table.", "Plan the Cake", "Instagram Feed", "conversion", "Full cake, message detail, and first slice."),
        ("The candles are quick. The first slice is the moment. Plan the Patticake around the part everyone waits for.", "Start a Cake Order", "Instagram Reel", "consideration", "Candle blowout into layered slice reveal."),
        ("Birthday pickup, handled. Choose the local cake path, share the timing details, and let the bakery team follow up.", "Pick Up Locally", "Facebook", "conversion", "Boxed cake at a yum! counter."),
        ("For the person who always says they do not need anything: they still need cake.", "Send a Patticake", "Instagram Feed", "awareness", "Gift box arriving at a front door or office."),
        ("Office birthday on the calendar? Add the cake before somebody volunteers grocery-store cupcakes in the group chat.", "Plan an Office Cake", "LinkedIn", "conversion", "Office table, candles, and Patticake slice."),
        ("The birthday message matters almost as much as the layers. Show us what should go on the cake request.", "Start a Cake Request", "Instagram Stories", "engagement", "Piping message close-up with question sticker."),
        ("A birthday in another state can still get a little yum! Patticake is available nationwide; confirm the exact date at checkout.", "Ship Nationwide", "Facebook", "conversion", "Packing, date selection, and first slice."),
    ],
    "F. Patticake thank-you and gifting": [
        ("Thank you, but make it cake. Add the note, choose the current delivery or pickup path, and give them something meant to be shared.", "Send a Patticake", "Instagram Feed", "conversion", "Gift box, note, and cake slices."),
        ("For the neighbor who brought dinner, the friend who showed up, or the host who made room. Send the thank-you people can slice.", "Send a Thank-You Cake", "Facebook", "consideration", "Three recipient scenarios with one gift box."),
        ("A client thank-you should feel personal before they read the note. Start with the Patticake box, then make the message yours.", "Ask About Gifting", "LinkedIn", "conversion", "Multiple boxes, note cards, and desk delivery."),
        ("The best just-because gifts have an actual reason: I miss you, you helped, you did it, or I knew you would share.", "Send a Cake", "Instagram Reel", "awareness", "Four handwritten note options and slice reveal."),
        ("Teacher thank-you in layers: chocolate cake, vanilla buttercream, and a note that says exactly why.", "Plan the Gift", "Pinterest", "consideration", "Vertical gift box and note composition."),
        ("Send the former Minnesotan a reason to call home after dessert.", "Send a Patticake", "Instagram Feed", "awareness", "Gift box, Twin Cities note, and slice."),
        ("When flowers feel expected, send the cake people will put in the middle of the table.", "Check Gift Options", "Pinterest", "consideration", "Patticake centered on a real table with hands."),
    ],
    "G. Patticake shipping": [
        ("Pack a Patticake with us: cake secured, message checked, box finished, and nationwide shipping confirmed at checkout.", "Ship Nationwide", "TikTok", "consideration", "Real packing sequence, no staged shipping label data."),
        ("A delivery date is part of the gift. Check the current calendar before you promise the cake at the party.", "View the Delivery Calendar", "Instagram Stories", "conversion", "Date picker, packed box, and reminder frame."),
        ("From yum! bakery layers to the first slice at their table. Here is the trip a Patticake is built to make.", "Send a Patticake", "YouTube Shorts", "consideration", "Bake, frost, pack, transit handoff, unbox."),
        ("Unbox first. Read the note second. Cut the cake immediately after.", "Start an Order", "Instagram Reel", "awareness", "Recipient unboxing with consent and clean label framing."),
        ("Sending cake to more than one address? Start a corporate gifting note so timing, quantities, and recipient details can be reviewed.", "Ask About Multiple Gifts", "LinkedIn", "conversion", "Address list blurred, multiple boxes, inquiry form."),
        ("Before you post the tracking screenshot, post the layers. That is what they are waiting for.", "Send a Cake", "TikTok", "awareness", "Tracking notification into cake slice close-up."),
        ("Shipping availability can change. The Patticake order page is the source of truth for current dates and delivery options.", "Check Current Options", "Facebook", "conversion", "Current website page beside packed cake."),
    ],
    "H. Patticake local pickup": [
        ("Cake pickup should be the easy part of the birthday. Start the local request, share the date and location, and wait for the bakery follow-up.", "Pick Up Locally", "Instagram Feed", "conversion", "Boxed cake and counter handoff."),
        ("Four Twin Cities kitchens, one cake plan. Choose the pickup path that works for the table you are setting.", "Start a Local Cake Request", "Facebook", "conversion", "Four location exteriors and one Patticake."),
        ("The drive home with a cake in the passenger seat deserves its own careful soundtrack.", "Plan Pickup", "TikTok", "awareness", "Box placement, seatbelt-safe shot, arrival."),
        ("Office birthday nearby? Pick up the Patticake on the way in and let the first meeting be the cake meeting.", "Start a Cake Request", "LinkedIn", "conversion", "Pickup counter to office table."),
        ("Choose the message before pickup. It is easier than deciding what to write while the candles are already lit.", "Add Your Cake Details", "Instagram Stories", "consideration", "Message form and piping detail."),
        ("Local cake, real bakery team, and a pickup plan built around the occasion details you share.", "Pick Up Locally", "Instagram Feed", "consideration", "Bakery hands, box, and location cue."),
        ("Need help before you request the cake? Use the cake inquiry and share the date, location, occasion, and what you need the team to know.", "Start an Inquiry", "Facebook", "conversion", "Cake inquiry form and tiered cake detail."),
    ],
    "I. Patticake corporate gifting": [
        ("The client thank-you that gets opened first: a real cake, a clear note, and a gifting plan built around the recipient list.", "Ask About Corporate Gifting", "LinkedIn", "conversion", "Multiple gift boxes and note cards."),
        ("Team milestone, partner thank-you, or year-end gift. Start with who it is for, how many recipients, and when it needs to arrive.", "Start a Gifting Note", "LinkedIn", "conversion", "Planner checklist and stacked Patticake boxes."),
        ("A corporate gift can still feel like it came from a person. The message is not a footnote.", "Plan the Gift", "Instagram Feed", "consideration", "Handwriting, card insertion, and package close."),
        ("Before you upload the address list, settle the occasion, quantity, and timing with the bakery team.", "Ask About Gifting", "Facebook", "consideration", "Blurred spreadsheet, inquiry form, and boxes."),
        ("Send the team cake after the launch, not another branded water bottle before it.", "Start a Corporate Gift Inquiry", "LinkedIn", "awareness", "Team table and shared slices."),
        ("One recipient or a list of them, the current Patticake inquiry is where quantity, timing, and delivery questions belong.", "Start an Inquiry", "Facebook", "conversion", "Inquiry page and multiple boxes."),
        ("Client gifts work harder when the product looks as thoughtful as the note sounds.", "Plan Corporate Gifting", "Pinterest", "consideration", "Premium real package detail without luxury styling."),
    ],
    "J. Patticake wedding and event": [
        ("Cake for the table you planned. Start the inquiry with the date, occasion, guest context, and the details you want the bakery team to see.", "Start an Event Inquiry", "Pinterest", "conversion", "Tiered cake in a real event setting."),
        ("A wedding cake does not need to shout over the flowers, plates, and people around it. It needs to belong on the table.", "Plan the Cake", "Instagram Feed", "consideration", "Cake, floral detail, and place setting."),
        ("The cut is one moment. The layers are the proof everybody takes back to the table.", "Start a Cake Inquiry", "Instagram Reel", "awareness", "Cake cut and plated slices."),
        ("Shower, rehearsal, wedding, or anniversary: share the event details first so the bakery team can route the right next step.", "Start an Inquiry", "Facebook", "conversion", "Four occasion details and inquiry CTA."),
        ("Save this cake detail for the event board, then send the date when you are ready to ask what is possible.", "Save and Inquire", "Pinterest", "consideration", "Vertical piping and tier detail."),
        ("A dessert table can start with one cake question: what do you want people to remember after the first slice?", "Plan the Event Cake", "Instagram Feed", "engagement", "Dessert table and guest hands."),
        ("Event availability and customization need bakery confirmation. Use the inquiry form before putting the cake on the printed timeline.", "Start an Inquiry", "Pinterest", "conversion", "Planner, timeline, and cake detail."),
    ],
    "K. seasonal": [
        ("On the menu right now: {VERIFIED_ITEM}. Check the live menu before you choose the pickup kitchen.", "See the Current Menu", "Instagram Feed", "conversion", "Verified current item and date label."),
        ("The bakery drop is real, the quantity is not a promise. This is what we photographed at {LOCATION} on {DATE}.", "Find a Location", "Instagram Stories", "conversion", "Same-day product and timestamp."),
        ("A season is a good reason to change the lunch order. Start with what is currently on the yum! menu.", "Explore the Menu", "Facebook", "consideration", "Three verified seasonal food details."),
        ("Holiday cake timing belongs on the calendar before the guest list is final. Confirm the current order deadline at the destination page.", "Check Current Deadlines", "Instagram Stories", "conversion", "Calendar, Patticake, and confirmation badge."),
        ("A limited bakery item needs a publish-by date, a location check, and no caption that outlives the tray.", "Check Availability", "Google Business Profile", "conversion", "Current bakery item with location and date."),
        ("Bring the seasonal part of dinner home. Check the current yum! menu and order from the kitchen nearest you.", "Order Online", "Facebook", "conversion", "Seasonal entree and pickup bag."),
        ("Gifting deadline coming up? Use {CONFIRMED_DEADLINE} only after the bakery owner approves it for this campaign.", "Check Gift Options", "Instagram Feed", "conversion", "Gift box with approved deadline card."),
    ],
    "L. short paid-ad": [
        ("Lunch is one location choice away.", "Order Now", "Meta Feed", "conversion", "Meal, location selector, pickup handoff."),
        ("Feed the room. Start the catering note.", "Get Quote", "Meta Reels", "conversion", "Catering spread and inquiry screen."),
        ("Send cake, not a card.", "Shop Now", "Meta Reels", "conversion", "Gift box, note, and first slice."),
        ("Birthday pickup, handled.", "Learn More", "Meta Stories", "conversion", "Boxed Patticake at a local counter."),
        ("Client thank-yous people can slice.", "Contact Us", "LinkedIn Paid", "conversion", "Multiple boxes and note workflow."),
        ("Four Twin Cities kitchens. Pick yours.", "Order Now", "Meta Feed", "conversion", "Four storefronts and current food."),
        ("The bakery tray belongs in the meeting plan.", "Get Quote", "Meta Feed", "conversion", "Meeting table and bakery tray."),
    ],
}


HOOK_GROUPS = {
    "yum! food hooks": [
        "What we would order at yum! on a first visit.", "The lunch decision in three shots.", "This is your sign to order the soup and sandwich.", "The last ten seconds before your pickup is ready.", "A Minnesota weather forecast, but for lunch.", "Breakfast, lunch, dinner, or bakery: choose your lane.", "What goes from the yum! kitchen to your takeout bag.", "The order for when nobody agrees on dinner.", "Four kitchens, one very useful menu.", "The plate that makes the drive home worth it.",
    ],
    "bakery hooks": [
        "First look at today's bakery case.", "From the tray to the case in ten seconds.", "Pick one before the lunch rush does.", "The part of the order you save for later.", "What the bakery team takes home.", "The meeting tray people notice first.", "A bakery box is a dinner plan.", "This-or-that from the real case today.", "The case looked like this at {CAPTURE_TIME}.", "Bring dessert starts here.",
    ],
    "catering hooks": [
        "The office lunch upgrade nobody complains about.", "What a room-ready yum! order looks like.", "Pack boxed lunches with us.", "Five things to settle before you feed the room.", "Do not forget the bakery tray.", "The meeting is booked. Is lunch?", "Catering add-ons that make the table feel finished.", "From pickup counter to conference room.", "The lunch plan for people who plan every lunch.", "What office managers should send in the first catering note.",
    ],
    "Patticake birthday hooks": [
        "A birthday cake that does not feel like a backup plan.", "Cut the first slice with us.", "Birthday pickup, handled.", "The message goes on before the candles do.", "An office birthday that looks planned.", "The birthday part everyone waits for.", "What to send the person who says they need nothing.", "Cake in the passenger seat, careful turns only.", "The graduate gets the first slice.", "Three birthday details to settle before pickup.",
    ],
    "Patticake gifting hooks": [
        "Send cake, not a card.", "Thank you, but make it cake.", "Pack a Patticake with us.", "The client thank-you that gets opened first.", "A little Twin Cities, sent home.", "The note is part of the gift.", "What to send after they really showed up.", "Just because has four better reasons.", "Flowers were expected. Cake was not.", "A gift meant to go in the middle of the table.",
    ],
    "shipping and unboxing hooks": [
        "From yum! bakery to their first slice.", "Unbox first. Read the note second.", "What gets checked before the box closes.", "The delivery date is part of the gift.", "A shipping video with the label kept private.", "The cake journey in fifteen seconds.", "Open the blue box with us.", "Why the message card gets one more check.", "The tracking update is not the best part.", "What arrives before the thank-you text.",
    ],
    "wedding and event hooks": [
        "Cake for the table you planned.", "The cut is quick. The layers are the proof.", "A wedding cake that belongs in the room.", "Save this piping detail for the event board.", "What the bakery needs in the first event inquiry.", "One cake question before the timeline is final.", "The dessert-table anchor, up close.", "From full tier to plated slice.", "A shower cake that does not need a theme costume.", "The event detail everybody photographs twice.",
    ],
    "location and neighborhood hooks": [
        "The original yum! on Minnetonka Boulevard.", "Your Shady Oak lunch stop.", "yum! on Snelling in twelve seconds.", "East metro, this is your yum!.", "Four Twin Cities kitchens. Pick yours.", "The storefront before the pickup handoff.", "Which yum! is on your route home?", "A neighborhood dinner stop with a bakery case.", "The local order starts with one location choice.", "What each yum! looks like from the front door.",
    ],
    "seasonal hooks": [
        "On the menu right now.", "Photographed today, while it is here.", "The bakery drop with an expiration date.", "Check the deadline before you promise the gift.", "A season is a good reason to change the order.", "The current menu gets the final word.", "This post expires when the tray does.", "Save the date, then confirm the cake.", "The seasonal close-up before the full plate.", "What changed in the case this week.",
    ],
    "UGC hooks": [
        "Come to yum! with me for lunch.", "What I ordered on my first yum! visit.", "Rate my bakery-case decision.", "Watch me send a Patticake to someone who helped.", "The first slice reaction, no script.", "What an office catering pickup actually looks like.", "A birthday cake pickup from the driver's seat.", "My Twin Cities lunch stop between errands.", "Unbox a Patticake with me.", "The staff recommendation I would order again.",
    ],
}


def video(
    title: str,
    brand: str,
    goal: str,
    audience: str,
    hook: str,
    shots: list[str],
    onscreen: list[str],
    voiceover: str,
    cta: str,
    channels: str,
    rating: str,
    length: str = "15 seconds",
) -> dict[str, Any]:
    return {
        "title": title,
        "brand": brand,
        "goal": goal,
        "audience": audience,
        "length": length,
        "hook": hook,
        "shots": shots,
        "onscreen": onscreen,
        "voiceover": voiceover,
        "cta": cta,
        "editing": "Open on motion in frame one. Use straight cuts, one clean push-in, and burned-in captions. Keep photography unobstructed. Move copy through a dedicated baby-blue field with logo-red type and a two-second CTA hold. No floating cards, stickers, glow, or text over the photo.",
        "channels": channels,
        "rating": rating,
    }


VIDEO_SCRIPTS = [
    video("Pack a Patticake with us", "Patticake", "nationwide shipping consideration", "gift senders", "pack a Patticake order with us", ["Open box on clean packing table", "Lower real cake into insert", "Check gift note without showing private data", "Close box and tie current packaging", "Hand off for shipping"], ["cake checked", "message checked", "ready to send"], "A Patticake gift starts with the cake, the message, and one last check before the box closes.", "Ship Nationwide", "Reels, TikTok, Shorts, paid", "high"),
    video("Cut the first slice", "Patticake", "birthday and product proof", "birthday cake buyers", "the part of the birthday everyone waits for", ["Full cake on real table", "Knife breaks the buttercream", "Slice lifts from cake", "Layer macro", "Hands pass plates"], ["first cut", "real layers", "share the love"], "The candles are quick. The first slice is the moment.", "Plan the Cake", "Reels, TikTok, Shorts", "high", "12 seconds"),
    video("Birthday cake pickup", "Patticake", "local cake request", "Twin Cities birthday buyers", "birthday pickup, handled", ["Bakery box at counter", "Staff confirms name", "Hands receive box", "Careful placement in car", "Cake arrives on table"], ["choose the date", "choose the kitchen", "pick up locally"], "Share the date, location, and cake details, then let the bakery team confirm the next step.", "Pick Up Locally", "Reels, Stories, Meta paid", "high"),
    video("Send a thank-you cake", "Patticake", "occasion expansion", "friends, families, client gift buyers", "thank you, but make it cake", ["Write thank-you note", "Place card with gift box", "Reveal full cake", "Cut layered slice", "Recipient hands receive plate"], ["for showing up", "for helping out", "for sharing"], "A thank-you feels more personal when the note arrives with something meant for the middle of the table.", "Send a Patticake", "Reels, TikTok, Pinterest video, paid", "high"),
    video("Office catering spread", "yum!", "catering leads", "office managers and executive assistants", "the office lunch upgrade nobody complains about", ["Empty conference table", "Trays arrive", "Labels and utensils placed", "Wide finished spread", "First plate served"], ["pick the date", "plan the room", "feed the team"], "Start with the date, group size, pickup kitchen, and what the room needs. The catering note routes the details.", "Start a Catering Note", "LinkedIn, Reels, Meta paid", "high", "18 seconds"),
    video("Box lunch assembly", "yum!", "catering process proof", "catering buyers", "pack boxed lunches with us", ["Open boxes in a row", "Place verified meal components", "Add labels", "Close and stack", "Pickup handoff"], ["assembled", "labeled", "ready for pickup"], "A room-ready lunch is built one checked box at a time.", "Plan Catering", "Reels, TikTok, Shorts", "high"),
    video("Bakery case morning restock", "yum!", "same-day visits", "neighborhood regulars", "first look at today's bakery case", ["Empty case shelf", "Tray enters frame", "Items placed", "Glass closes", "Wide case scan with location and time"], ["{LOCATION}", "{CAPTURE_TIME}", "today's case"], "This is what the case looked like when we filmed it. Check your nearest yum! for today's selection.", "Find a Location", "Stories, Reels, GBP", "medium", "10 seconds"),
    video("Staff favorite order", "yum!", "human trust and menu discovery", "regulars and first-time guests", "ask the person behind the counter", ["Staff member names favorite", "Kitchen build", "Finished plate", "Staff takes first bite or holds order", "Menu CTA"], ["{NAME}'s order", "why they pick it", "try it your way"], "This is {NAME}'s current yum! order at {LOCATION}, and the reason it keeps winning lunch.", "See the Menu", "Reels, TikTok, Stories", "high", "20 seconds"),
    video("First-time yum! order guide", "yum!", "menu consideration", "first-time guests", "what we would order at yum! on a first visit", ["Menu category cards", "Soup and sandwich detail", "Breakfast or entree detail", "Bakery add-on", "Order-location screen"], ["start with the craving", "pick a kitchen", "save room for bakery"], "You do not need to study the whole menu. Start with what sounds good, then choose the kitchen nearest you.", "Explore the Menu", "Reels, TikTok, Shorts, paid", "high", "20 seconds"),
    video("Four-location neighborhood post", "yum!", "location discovery", "Twin Cities guests", "four Twin Cities kitchens. pick yours.", ["St. Louis Park exterior", "Shady Oak exterior", "St. Paul exterior", "Woodbury exterior", "Four-location grid and CTA"], ["St. Louis Park", "Shady Oak", "St. Paul", "Woodbury"], "One yum! for each route across the Twin Cities. Pick the location that works for today.", "Find Your yum!", "Reels, Stories, Meta paid", "high", "16 seconds"),
    video("Gift card holiday post", "yum!", "gift card sales", "last-minute and employer gift buyers", "send lunch for later", ["Gift card purchase screen", "Write recipient note", "Show real meal options", "Bakery case detail", "Gift-card CTA"], ["choose the amount", "add the note", "send yum!"], "A yum! gift card lets them choose breakfast, dinner, bakery, or the order they already love.", "Buy a Gift Card", "Reels, Stories, Facebook, paid", "high", "12 seconds"),
    video("Wedding cake alternative", "Patticake", "event inquiries", "couples and event planners", "cake for the table you planned", ["Tiered cake wide", "Piping detail", "Flowers or table detail", "Cake cut", "Inquiry screen"], ["share the date", "share the occasion", "start the inquiry"], "Start with the date and event details. The bakery team can follow up about what is possible.", "Start an Event Inquiry", "Reels, Pinterest video, paid", "high", "18 seconds"),
    video("Corporate gifting explainer", "Patticake", "corporate gifting leads", "office managers and client teams", "the client thank-you that gets opened first", ["Multiple boxes", "Message cards", "Recipient list blurred", "Pack and close", "Inquiry CTA"], ["who it is for", "how many", "when it matters"], "For multiple gifts, start with the recipient count, timing, address plan, and message needs.", "Ask About Corporate Gifting", "LinkedIn, Reels, Meta paid", "high", "20 seconds"),
    video("Customer review visual", "both", "retargeting proof", "warm prospects", "what guests noticed", ["Verified review source", "Exact short quote in the baby-blue copy field", "Supporting food or cake proof", "Source and date", "Relevant CTA"], ["exact quote only", "source: {SOURCE}", "captured: {DATE}"], "Use only a verified, attributed review with approval and a saved source link.", "See What They Ordered", "Reels, Stories, paid retargeting", "medium", "12 seconds"),
    video("What to order for lunch", "yum!", "local order conversion", "weekday lunch guests", "the lunch decision in three shots", ["Soup steam", "Sandwich cut", "Salad or entree close-up", "Pickup bag", "Order CTA"], ["warm", "handheld", "fresh"], "Pick the craving first. The current menu and your nearest kitchen handle the rest.", "Order Online", "Reels, TikTok, Shorts, paid", "high", "12 seconds"),
    video("Family dinner pickup", "yum!", "dinner orders", "families and parents", "the order for when nobody agrees on dinner", ["Parent checks menu", "Several current dishes packed", "Bag handoff", "Food placed on home table", "Family hands serve"], ["pick the kitchen", "place the order", "bring dinner home"], "Dinner does not need one unanimous craving. Start with the current menu and the nearest yum!.", "Order Online", "Reels, Facebook, Meta paid", "high", "18 seconds"),
    video("Cake message writing", "Patticake", "cake-request completion", "birthday and gift buyers", "the message goes on before the candles do", ["Blank cake surface", "Piping bag begins", "Message takes shape", "Full cake reveal", "Request CTA"], ["keep it short", "make it personal", "share the details"], "The message is part of the cake. Add exactly what the bakery team should know in the request.", "Start a Cake Request", "Reels, TikTok, Stories", "high", "12 seconds"),
    video("Frosting close-up", "Patticake", "product appetite", "cake buyers", "real buttercream, up close", ["Macro frosting sweep", "Cake turn", "Layer edge", "Knife cut", "Final slice"], ["vanilla buttercream", "chocolate layers", "ready to share"], "Let the frosting, layers, and first slice do the explaining.", "See Patticake", "Reels, TikTok, Shorts, paid", "high", "10 seconds"),
    video("Catering add-ons", "yum!", "larger catering basket and qualified leads", "office planners", "do not forget the bakery tray", ["Main catering trays", "Side or salad", "Bakery tray", "Labels and utensils", "Finished room"], ["main", "sides", "bakery", "pickup plan"], "A finished catering plan includes the food, the room, the pickup, and the part people save for the end.", "Plan Catering", "Reels, LinkedIn, paid", "high", "16 seconds"),
    video("Behind the counter", "yum!", "human brand trust", "regulars and prospective staff", "the last ten seconds before your order is yours", ["Final order check", "Bag close", "Name called", "Guest handoff without identifiable face", "Staff wave"], ["checked", "called", "ready"], "The order leaves the kitchen after one more check and a real person at the counter.", "Order Online", "Reels, TikTok, Stories", "medium", "10 seconds"),
    video("Minnesota nostalgia gift", "Patticake", "long-distance gifting", "former Minnesotans and their families", "send a little Twin Cities home", ["Write hometown note", "Pack Patticake", "Box handoff", "Recipient opens", "Slice on plate"], ["from yum!", "with a note", "for their table"], "For the person who still calls the Twin Cities home, even from somewhere else.", "Send a Patticake", "Reels, Facebook, Pinterest video", "high", "18 seconds"),
    video("Former local sends cake home", "Patticake", "gift reminder", "former locals", "send cake back home", ["Sender chooses occasion", "Message typed", "Cake packed", "Family receives box", "Shared first slice"], ["pick the reason", "add the note", "send it home"], "Distance changes the address, not the reason to show up for the table.", "Ship Nationwide", "Reels, TikTok, paid", "high", "18 seconds"),
    video("Graduation celebration", "Patticake", "seasonal cake demand", "families and graduates", "the graduate gets the first slice", ["Cap or approved graduation prop", "Cake message detail", "Candles or table", "First slice", "Cake-request CTA"], ["share the date", "add the message", "plan the cake"], "Put the date and cake details on the request before the celebration calendar fills up.", "Plan the Cake", "Reels, Stories, Pinterest", "high", "15 seconds"),
    video("Teacher thank-you", "Patticake", "thank-you gifting", "parents and school communities", "thank you in chocolate layers", ["Write teacher note", "Show gift box", "Pack cake", "Approved handoff", "Slice proof"], ["for the patience", "for the care", "for the whole year"], "Make the thank-you specific, then let the cake carry it to the table.", "Send a Thank-You Cake", "Reels, Facebook, Pinterest", "high", "15 seconds"),
    video("Office birthday", "Patticake", "office celebration lead", "office managers and executive assistants", "an office birthday that looks planned", ["Calendar reminder", "Box pickup or arrival", "Cake on conference table", "Candles", "First slice around the room"], ["date", "message", "cake", "handled"], "Add the cake before the birthday becomes a same-day group-chat problem.", "Plan an Office Cake", "LinkedIn, Reels, Meta paid", "high", "16 seconds"),
    video("Client thank-you gift", "Patticake", "corporate gifting leads", "sales and client-success teams", "the client thank-you that gets opened first", ["Client name on private list blurred", "Message card", "Multiple boxes", "Pack close-up", "Inquiry CTA"], ["personal note", "real cake", "planned delivery"], "Start the gifting note with who, how many, when, and what the message should say.", "Ask About Corporate Gifting", "LinkedIn, Reels, Meta paid", "high", "18 seconds"),
    video("Holiday gifting deadline", "Patticake", "deadline conversion", "holiday gift buyers", "check the deadline before you promise the cake", ["Approved deadline card", "Delivery calendar", "Packing process", "Gift note", "CTA hold"], ["order by {CONFIRMED_DEADLINE}", "dates subject to availability", "check current options"], "Use this script only after the bakery owner confirms the campaign deadline and available delivery path.", "Check Current Options", "Stories, Reels, paid", "high", "12 seconds"),
    video("Rainy day comfort food", "yum!", "same-day local orders", "nearby guests", "Minnesota weather has a lunch order", ["Rain on window", "Soup steam", "Sandwich cut", "Bag handoff", "Warm table shot"], ["warm", "ready", "nearby"], "When the weather changes the plan, let the current yum! menu make the next decision.", "Order Online", "Reels, TikTok, GBP", "medium", "12 seconds"),
    video("Bakery tray for meetings", "yum!", "catering add-on leads", "office planners", "the meeting starts better with a bakery tray", ["Empty table", "Tray arrives", "Lid lifts", "Coffee and plates", "Meeting begins"], ["add the bakery", "finish the table", "start a catering note"], "The bakery tray belongs in the plan before the first calendar invite goes out.", "Plan Catering", "LinkedIn, Reels, Meta paid", "high", "12 seconds"),
    video("Why Patticake?", "Patticake", "brand and product understanding", "new cake and gift buyers", "why Patticake?", ["Full cake", "Chocolate layer macro", "Vanilla buttercream top", "Gift note and box", "Local pickup and nationwide shipping path split"], ["real layers", "personal note", "local pickup or nationwide shipping"], "Patticake is yum!'s celebration cake: real chocolate layers, vanilla buttercream, and a message made for the occasion.", "See Patticake", "Reels, TikTok, Shorts, paid", "high", "20 seconds"),
]


PAID_CAMPAIGNS = [
    {
        "name": "local restaurant orders",
        "objective": "Sales or traffic optimized to completed online-order sessions",
        "audience": "Adults near each yum! location, site visitors, menu viewers, and recent orderers split by recency",
        "funnel": "consideration and conversion",
        "offer": "Made-from-scratch breakfast, lunch, dinner, bakery, and pickup. No discount assumed.",
        "landing": "order",
        "concept": "Craving-first 9:16 video with a location decision and pickup handoff.",
        "texts": [
            "Lunch is one location choice away. Pick your nearest yum!, check the current menu, and send the order to the kitchen.",
            "Breakfast, lunch, dinner, and the bakery case. Start with what sounds good, then choose your Twin Cities kitchen.",
            "The drive home gets easier when dinner is already headed to the pickup counter.",
            "Four Twin Cities kitchens. One useful answer to what should we eat?",
            "Order from the yum! on your route and let the kitchen handle the next step.",
        ],
        "headlines": ["Order from your yum!", "Lunch is handled", "Pick your kitchen", "Bring yum! home", "See the current menu"],
        "cta": "ORDER_NOW",
        "visual": "Unobstructed real food macro, four-location cue, dedicated baby-blue field with logo-red type, and pickup handoff.",
        "video": "12-15 second craving montage ending on the location selector and Order Now.",
        "testing": "Test daypart, location, craving family, food-first vs handoff-first, and 4:5 vs 9:16. Exclude recent purchasers from prospecting where data allows.",
        "metric": "Cost per completed order session, purchase conversion rate, and location-level return on ad spend where purchase value is available.",
    },
    {
        "name": "catering leads",
        "objective": "Lead generation or landing-page conversion to a completed catering inquiry",
        "audience": "Office managers, HR, executive assistants, event planners, site visitors to catering content, and customer-list lookalikes where permitted",
        "funnel": "consideration and conversion",
        "offer": "A clear pickup catering plan for meetings and group meals. No unsupported capacity or menu promise.",
        "landing": "catering",
        "concept": "Empty room to finished spread, with planning checklist proof.",
        "texts": [
            "The meeting is booked. Lunch should be too. Start a catering note with the date, group size, pickup kitchen, and what the room needs.",
            "Feed the room without turning lunch into another meeting. Show us the occasion and pickup plan.",
            "Boxed lunches, trays, bakery add-ons, and one place to start the conversation.",
            "Office lunch planning gets easier when the date, headcount, pickup, and bakery add-ons are settled early.",
            "The bakery tray is not an afterthought. Add it to the catering plan before the conference room fills up.",
        ],
        "headlines": ["Start a catering note", "Feed the room", "Plan office lunch", "Make lunch room-ready", "Add the bakery tray"],
        "cta": "CONTACT_US",
        "visual": "Real spread, boxes, labels, bakery add-ons, and planner hands.",
        "video": "15-20 second room transformation with checklist overlays and form CTA.",
        "testing": "Test office lunch vs celebration, boxes vs trays, checklist vs finished spread, and landing-page vs native lead form. Qualify by date, group size, and pickup location.",
        "metric": "Cost per qualified catering inquiry, inquiry completion rate, and lead-to-confirmed-order rate.",
    },
    {
        "name": "Patticake birthday",
        "objective": "Sales or conversion to cake order/request completion",
        "audience": "Birthday planners, parents, partners, office planners, cake-page visitors, and engaged social viewers",
        "funnel": "consideration and conversion",
        "offer": "A real chocolate-layer cake with vanilla buttercream and an occasion message. Pickup or delivery route depends on current options.",
        "landing": "cake_request",
        "concept": "Full cake to first slice, with date and message decision points.",
        "texts": [
            "A birthday cake that does not feel like a backup plan. Share the date, message, and pickup or delivery details to start.",
            "The candles are quick. The first slice is the moment. Plan the Patticake around the part everyone waits for.",
            "Birthday pickup, handled. Start the local cake request and let the bakery team confirm the details.",
            "An office birthday looks planned when the cake is on the calendar before the group chat starts.",
            "Real chocolate layers, vanilla buttercream, and a message for the table.",
        ],
        "headlines": ["Plan the birthday cake", "Birthday pickup, handled", "Cut the first slice", "Add the cake message", "Make it Patticake"],
        "cta": "LEARN_MORE",
        "visual": "Cake reveal, message writing, first slice, real hands, no staged confetti background.",
        "video": "12-15 second first-slice film with date, message, and route overlays.",
        "testing": "Test local pickup vs delivery intent, cake-first vs occasion-first, birthday person vs office planner, and message-writing proof.",
        "metric": "Cost per cake request or purchase, request completion rate, and birthday landing-page conversion rate.",
    },
    {
        "name": "Patticake thank-you gifts",
        "objective": "Sales or conversion to Patticake order start",
        "audience": "Gift buyers, past cake customers, site visitors, client-facing professionals, and former Minnesotans",
        "funnel": "awareness through conversion",
        "offer": "A giftable cake with a personal note and current pickup or delivery options.",
        "landing": "patticake",
        "concept": "Gift box and note open into layered slice proof.",
        "texts": [
            "Thank you, but make it cake. Add the note, choose the current route, and give them something meant to be shared.",
            "For the neighbor who helped, the host who made room, or the friend who showed up. Send the thank-you people can slice.",
            "Flowers were expected. Cake was not.",
            "The note is part of the gift. The chocolate layers make sure it gets opened first.",
            "Send a little Twin Cities to the person who still calls it home.",
        ],
        "headlines": ["Send a thank-you cake", "Send cake, not a card", "Make the note personal", "A gift meant to share", "Check gift options"],
        "cta": "SHOP_NOW",
        "visual": "Real blue gift box, note card, hands, cake layers, and table moment.",
        "video": "15 second note-to-box-to-first-slice sequence.",
        "testing": "Test recipient occasion, note-first vs slice-first, local nostalgia vs universal thanks, and static vs process video.",
        "metric": "Cost per order start, purchase conversion rate, and new-customer gift revenue.",
    },
    {
        "name": "Patticake corporate gifting",
        "objective": "Qualified lead generation",
        "audience": "Office managers, executive assistants, sales leaders, client-success teams, HR, and past business customers",
        "funnel": "consideration and conversion",
        "offer": "Personal cake gifts for client, team, and partner occasions. Quantity, timing, and address support require inquiry confirmation.",
        "landing": "cake_request",
        "concept": "Repeatable boxes with personal-note proof and planner checklist.",
        "texts": [
            "The client thank-you that gets opened first. Start with who it is for, how many, and when it matters.",
            "A corporate gift can still feel like it came from a person. The message is not a footnote.",
            "Team milestone, partner thank-you, or year-end gift. Start the gifting note before the address list gets complicated.",
            "Send the team cake after the launch, not another desk object before it.",
            "Multiple recipients? Share the quantity, timing, address plan, and message needs with the bakery team.",
        ],
        "headlines": ["Plan corporate gifting", "Client thank-yous people slice", "Start a gifting note", "Make the message personal", "Ask about multiple gifts"],
        "cta": "CONTACT_US",
        "visual": "Multiple real boxes, note cards, blurred recipient list, and table-ready cake.",
        "video": "18 second planner workflow from recipient list to packed gifts.",
        "testing": "Test client vs employee occasion, one-to-many visual proof, LinkedIn vs Meta, and lead form length.",
        "metric": "Cost per qualified corporate inquiry, average requested quantity, and inquiry-to-order rate.",
    },
    {
        "name": "Patticake weddings and events",
        "objective": "Qualified event inquiry",
        "audience": "Engaged couples, shower hosts, event planners, and Pinterest cake researchers",
        "funnel": "consideration and conversion",
        "offer": "A bakery conversation about the event date, cake, and table. No customization promise before confirmation.",
        "landing": "cake_request",
        "concept": "Event table, tier details, cake cut, and inquiry checklist.",
        "texts": [
            "Cake for the table you planned. Start the inquiry with the date, occasion, and details the bakery team should see.",
            "The cut is one moment. The layers are the proof everybody takes back to the table.",
            "Wedding, shower, rehearsal, or anniversary: share the event details first so the bakery team can route the next step.",
            "Save the piping detail. Send the date when you are ready to ask what is possible.",
            "A wedding cake should belong in the room, not compete with it.",
        ],
        "headlines": ["Start an event inquiry", "Cake for the table", "Share your event date", "Plan the cake", "Save the cake detail"],
        "cta": "CONTACT_US",
        "visual": "Real tiered cakes, piping, table context, cake cut, and permission-cleared event images.",
        "video": "18 second wide-to-detail-to-slice event story.",
        "testing": "Test wedding vs shower, detail vs full-table opening, Pinterest click vs Meta lead form, and checklist creative.",
        "metric": "Cost per qualified event inquiry, inquiry completion rate, and inquiry-to-consultation rate.",
    },
    {
        "name": "gift cards",
        "objective": "Sales to gift-card purchase",
        "audience": "Last-minute gift buyers, parents, employers, hosts, and past yum! guests",
        "funnel": "conversion and retention",
        "offer": "A yum! gift card for food, bakery, and the recipient's own menu choice. No discount assumed.",
        "landing": "gift_cards",
        "concept": "Recipient-specific gift moment plus real menu choice.",
        "texts": [
            "Send lunch for later. A yum! gift card lets them choose breakfast, dinner, bakery, or the order they already love.",
            "Teacher thank-you, handled with a meal they get to choose.",
            "A host gift that does not need shelf space.",
            "For the coworker who knows everybody's lunch order by memory.",
            "Last-minute does not have to look last-minute. Send yum!.",
        ],
        "headlines": ["Buy a yum! gift card", "Send lunch for later", "A useful thank-you", "Let them choose yum!", "Gift dinner, breakfast, or bakery"],
        "cta": "BUY_NOW",
        "visual": "Verified gift-card screen, real food choices, handwritten note, and red-circle logo.",
        "video": "10-12 second recipient scenario, purchase flow, and menu montage.",
        "testing": "Test recipient occasion, digital-flow proof vs food-first, and holiday vs always-on copy.",
        "metric": "Cost per gift-card purchase, purchase value, and new-customer recipient activation where measurable.",
    },
    {
        "name": "retargeting",
        "objective": "Sales or lead completion based on last high-intent action",
        "audience": "Menu viewers, order starters, catering-page visitors, cake-page visitors, form starters, cart abandoners, and past customers split by route",
        "funnel": "conversion and retention",
        "offer": "Resume the relevant action. No blanket discount.",
        "landing": "dynamic by last intent",
        "concept": "The exact product, occasion, or planning step the viewer left.",
        "texts": [
            "Still choosing lunch? The current menu and your nearest yum! are ready when you are.",
            "The meeting date did not move. Finish the catering note before lunch becomes urgent.",
            "The birthday is still coming. Return to the cake details and finish the request.",
            "You picked the gift idea. Now add the note and check the current delivery or pickup options.",
            "Ready for another yum! order? Start with the kitchen you used last time or choose the one on today's route.",
        ],
        "headlines": ["Finish the order", "Complete the catering note", "Return to the cake details", "Add the gift note", "Order yum! again"],
        "cta": "dynamic by route",
        "visual": "Intent-matched product, saved step, or reminder. Never show fake cart state or private data.",
        "video": "8-12 second reminder built from the same product proof as the original ad.",
        "testing": "Split by last intent and recency. Suppress converters. Test reminder copy before incentives. Keep yum! and Patticake audiences separate.",
        "metric": "Incremental conversion rate, cost per recovered order or lead, and frequency by recency window.",
    },
]


CREATOR_BRIEFS = [
    {
        "name": "yum! local restaurant creator brief",
        "goal": "Drive location-page visits and local orders through a real first-person meal experience.",
        "audience": "Twin Cities neighborhood regulars, families, and first-time guests.",
        "talking": ["Name the exact yum! location visited.", "Show the real order and why you chose it.", "Include the bakery case or pickup flow if it naturally happened.", "Point viewers to the current menu or ordering path."],
        "avoid": ["Do not claim every item is always available.", "Do not invent prices, hours, dietary claims, or wait times.", "Do not call yum! fine dining or luxury.", "Do not film identifiable guests without permission."],
        "shots": ["Exterior arrival", "Menu decision", "Food macro", "Hands eating or packing", "Bakery case", "Location CTA"],
        "deliverables": "One 20-35 second vertical video, one clean 9:16 cover, five raw vertical clips, and three still frames.",
        "cta": "See the current menu and choose your yum! location.",
    },
    {
        "name": "yum! catering creator brief",
        "goal": "Show how a real group meal moves from planning to a room-ready setup.",
        "audience": "Office managers, HR, executive assistants, and event planners.",
        "talking": ["Name the real meeting or gathering type.", "Show pickup, labels, setup, and bakery add-ons when present.", "Explain the planning detail that mattered most.", "Route viewers to the catering inquiry."],
        "avoid": ["Do not promise a capacity, delivery service, timing, or dietary accommodation.", "Do not show private attendee or client information.", "Do not stage a fake testimonial.", "Do not quote a price unless supplied and approved for the campaign."],
        "shots": ["Planner checklist", "Pickup counter", "Boxes or trays", "Labels", "Room setup", "Finished spread"],
        "deliverables": "One 25-40 second vertical video, one 15 second cutdown, eight raw clips, and one 4:5 still.",
        "cta": "Start a catering note with the date, group size, and pickup kitchen.",
    },
    {
        "name": "Patticake gifting creator brief",
        "goal": "Make Patticake feel specific to a real relationship and occasion.",
        "audience": "Birthday, thank-you, client, and long-distance gift buyers.",
        "talking": ["Say who the cake is for and why.", "Show the note, packaging, and first slice.", "Keep delivery or pickup language tied to current site options.", "Show the cake on a real table with real hands."],
        "avoid": ["Do not invent delivery dates, coverage, discounts, flavors, or customization.", "Do not show shipping labels or addresses.", "Do not use generic stock celebration props as the main story.", "Do not describe the gift as luxury."],
        "shots": ["Reason for gift", "Message note", "Gift box", "Unboxing", "First slice", "Recipient reaction with consent"],
        "deliverables": "One 20-30 second vertical video, one 10 second cutdown, six raw clips, and one cover still.",
        "cta": "Check current Patticake delivery or local pickup options.",
    },
    {
        "name": "Patticake shipping and unboxing creator brief",
        "goal": "Show the real package-to-table experience without making unsupported fulfillment claims.",
        "audience": "Long-distance gift senders and recipients.",
        "talking": ["Open on the delivered box or recipient context.", "Keep the label and address private.", "Show the note before or with the cake reveal.", "Show the first clean slice and describe the visible layers."],
        "avoid": ["Do not claim the cake arrived on a guaranteed date unless the campaign has proof and approval.", "Do not show personal addresses or tracking numbers.", "Do not change packaging to make it look more premium.", "Do not review a flavor that is not the cake received."],
        "shots": ["Safe box exterior", "Seal opening", "Message card", "Cake reveal", "Layer cut", "Shared table"],
        "deliverables": "One 20-35 second vertical video, one silent product cutdown, all raw clips, and two vertical stills.",
        "cta": "View current Patticake delivery options.",
    },
    {
        "name": "Patticake wedding and event creator brief",
        "goal": "Generate qualified event inquiries using a real cake in a real event environment.",
        "audience": "Couples, shower planners, and event hosts.",
        "talking": ["Name the event type without exposing private guest details.", "Show the cake in the room, then the details, then the cut.", "Describe the planning question the bakery helped route.", "Point to the event cake inquiry."],
        "avoid": ["Do not promise custom work, guest counts, delivery, setup, or availability.", "Do not film guests without permission.", "Do not use copyrighted music without paid-usage clearance.", "Do not present styled-shoot footage as a real customer event."],
        "shots": ["Room wide", "Cake in context", "Piping detail", "Table detail", "Cake cut", "Plated slice"],
        "deliverables": "One 25-40 second vertical video, one 12 second detail cut, eight raw clips, and four 2:3 Pinterest stills.",
        "cta": "Start an event inquiry with the date and occasion details.",
    },
]


STORY_SEQUENCES = [
    ("Order lunch today", "The lunch decision starts here.", "Show two current food paths.", "Choose the yum! on your route.", "Order Online", "This-or-that poll on frame 2", "Weekday 10:30am-1pm local conversion"),
    ("Bakery case drop", "First look at today's case.", "Show the real tray and location.", "Photographed at {CAPTURE_TIME}.", "Find a Location", "Poll between two available items", "Same-day bakery traffic"),
    ("Patticake birthday", "Birthday on the calendar?", "Choose local pickup or nationwide shipping.", "Add the date and cake message.", "Plan the Cake", "Countdown sticker after deadline confirmation", "Birthday planning"),
    ("Send a thank-you cake", "Who showed up for you?", "Write the note.", "Send something meant to be shared.", "Send a Patticake", "Question sticker: who deserves cake?", "Thank-you gifting"),
    ("Cake pickup reminder", "Cake pickup day.", "Confirm the location and approved time in your order details.", "Carry the box flat and head to the table.", "View Cake Details", "Reminder sticker", "Confirmed customer reminder only"),
    ("Office catering quote", "The meeting is booked. Is lunch?", "Send date, group size, and pickup kitchen.", "Add trays, boxes, and bakery questions.", "Get a Quote", "Question sticker: how many are you feeding?", "Catering lead generation"),
    ("Gift card promo", "Send lunch for later.", "Breakfast, dinner, bakery, their choice.", "A useful gift in a few taps.", "Buy a Gift Card", "Slider: who needs a yum! lunch?", "Always-on gifting"),
    ("Wedding and event inquiry", "Cake for the table you planned.", "Share the date and occasion.", "Show the bakery team the details that matter.", "Start an Inquiry", "Question sticker: what are you planning?", "Event lead generation"),
    ("Staff favorite", "Ask the person behind the counter.", "{NAME}'s pick: {VERIFIED_ITEM}.", "Here is why they order it.", "See the Menu", "Poll: would you order it?", "Human menu discovery"),
    ("This-or-that menu poll", "Choose lunch with us.", "Option A: {VERIFIED_ITEM_A}.", "Option B: {VERIFIED_ITEM_B}.", "Vote Now", "Poll sticker", "Engagement using current menu items"),
    ("Location spotlight", "Your {LOCATION} yum!.", "Show the storefront and one room detail.", "Order here or get directions.", "Visit This Location", "Location sticker", "Neighborhood awareness"),
    ("Holiday deadline", "Cake deadline check.", "Approved date: {CONFIRMED_DEADLINE}.", "Availability can change, so use the current order page.", "Check Current Options", "Countdown sticker", "Owner-approved deadline campaign"),
    ("Corporate gifting", "More than one thank-you?", "Share how many, when, and where.", "Make the message feel personal.", "Ask About Gifting", "Question sticker: how many recipients?", "Corporate lead generation"),
    ("Review request", "How was your yum! order?", "Tell us what worked.", "Use the official review path for your location.", "Leave a Review", "Emoji slider only if brand owner approves", "Post-purchase retention; destination needs confirmation"),
    ("Behind-the-scenes baking", "Before the bakery case opens.", "Show one real preparation step.", "Finish on the tray or cake, not a generic kitchen shot.", "Follow for More", "Question sticker: what should we film next?", "Process and staff trust"),
]


PINS = [
    ("Birthday cake planning checklist", "Birthday cake details to settle before pickup", "Save the date, message, pickup or delivery route, and the person getting the first slice.", "Birthday cakes", "birthday cake planning, chocolate birthday cake, Twin Cities cake", "Vertical checklist over real Patticake and message detail.", "cake_request", "consideration"),
    ("Patticake first slice", "A birthday cake with real chocolate layers", "See the cake, the vanilla buttercream, and the first slice before you plan the birthday table.", "Birthday cakes", "chocolate layer cake, vanilla buttercream cake, birthday cake ideas", "Macro layered slice with minimal red headline card.", "patticake", "consideration"),
    ("Thank-you cake", "A thank-you gift people can share", "A real cake, a personal note, and current pickup or delivery options for the person who showed up.", "Thank-you gifts", "thank-you cake, food gift, gift cake delivery", "Gift box, note, and slice on real table.", "patticake", "conversion"),
    ("Teacher thank-you", "Teacher thank-you gift with a personal note", "Make the reason specific, then send a Patticake or choose local pickup based on current options.", "Teacher gifts", "teacher thank-you food gift, cake gift, end of year teacher gift", "Vertical note and gift-box composition.", "patticake", "consideration"),
    ("Client gift", "Client thank-you gifts that feel personal", "Start with recipient count, timing, addresses, and the note before you plan multiple Patticake gifts.", "Corporate gifts", "client thank-you gift, corporate food gifts, business gifting", "Multiple real boxes and message cards.", "cake_request", "conversion"),
    ("Team milestone", "Cake for a team milestone", "Use a shared cake moment for the launch, anniversary, or project finish, then route quantity questions through the inquiry.", "Corporate gifts", "team celebration cake, employee appreciation food gift, office milestone", "Team hands around a real cake table.", "cake_request", "consideration"),
    ("Wedding table", "Wedding cake for the table you planned", "Save the cake in the full room, then start an inquiry with the date and event details.", "Wedding cakes", "Twin Cities wedding cake, wedding dessert table, tiered cake", "Real tiered cake in event context.", "cake_request", "conversion"),
    ("Wedding detail", "Piping and layer details for a wedding cake board", "Use the cake detail as inspiration, then ask the bakery what is possible for your date.", "Wedding cakes", "wedding cake piping, simple wedding cake, cake detail ideas", "Close piping detail plus plated slice.", "cake_request", "consideration"),
    ("Shower cake", "Cake ideas for a shower table", "A cake can anchor the shower table without turning into a theme prop. Start with the date and occasion.", "Event cakes", "shower cake ideas, baby shower cake, bridal shower dessert", "Cake, flowers, and place setting in real room.", "cake_request", "consideration"),
    ("Office birthday", "Office birthday cake planning", "Put the date, message, and pickup or delivery path on the calendar before the group chat starts.", "Office celebrations", "office birthday cake, workplace celebration ideas, employee birthday", "Calendar, boxed cake, office table.", "cake_request", "conversion"),
    ("Box lunch checklist", "Office box lunch planning checklist", "Settle date, group size, pickup kitchen, labels, and bakery add-ons before the meeting.", "Office catering", "box lunch catering Twin Cities, office lunch planning, meeting food", "Five-step carousel-style Pin using real boxes.", "catering", "conversion"),
    ("Catering spread", "Twin Cities office catering that feels room-ready", "Show the finished spread, then start a catering note with the actual group details.", "Office catering", "Twin Cities catering, office catering, lunch catering", "Wide real spread cropped vertically with planner notes.", "catering", "conversion"),
    ("Bakery meeting tray", "Bakery tray ideas for a morning meeting", "Add the bakery part of the room before the coffee and agenda take over.", "Office catering", "meeting breakfast ideas, bakery catering, office pastry tray", "Real tray, coffee, plates, and laptop edge.", "catering", "consideration"),
    ("Twin Cities bakery", "A Twin Cities bakery case worth the stop", "See real yum! bakery photography, then find the kitchen nearest your route.", "Twin Cities food", "Twin Cities bakery, Minneapolis bakery, St Paul bakery", "Vertical case scan with four-location footer.", "locations", "awareness"),
    ("St. Louis Park bakery", "Bakery and pickup in St. Louis Park", "Visit the original Minnetonka Boulevard yum! for the current menu, bakery case, and pickup.", "Twin Cities food", "St Louis Park bakery, St Louis Park restaurant, Minnetonka Boulevard food", "Storefront plus bakery detail.", "slp", "conversion"),
    ("Shady Oak lunch", "Lunch and bakery on Shady Oak Road", "Use the current menu and location page to plan a Minnetonka or Hopkins lunch stop.", "Twin Cities food", "Minnetonka lunch, Hopkins restaurant, Shady Oak food", "Shady Oak exterior and lunch macro.", "shady_oak", "conversion"),
    ("St. Paul lunch", "A Snelling Avenue lunch and bakery stop", "Find the St. Paul yum!, check the current menu, and choose dine-in or pickup.", "Twin Cities food", "St Paul lunch, Snelling Avenue restaurant, St Paul bakery", "St. Paul exterior, room, and food.", "saint_paul", "conversion"),
    ("Woodbury dinner", "Woodbury dinner pickup with bakery built in", "Use the Woodbury location page and current menu to plan the next east metro dinner.", "Twin Cities food", "Woodbury restaurant, Woodbury takeout, Woodbury bakery", "Woodbury exterior, pickup bag, bakery box.", "woodbury", "conversion"),
    ("Minnesota nostalgia gift", "Send a little Twin Cities home", "For the former local who still wants a familiar cake at the table, check current Patticake gift options.", "Minnesota gifts", "Minnesota food gifts, Twin Cities gifts, cake delivery gift", "Gift box, hometown note, layered slice.", "patticake", "consideration"),
    ("Gift card", "A Twin Cities food gift they can choose", "A yum! gift card lets them decide between breakfast, lunch, dinner, bakery, or the familiar order.", "Minnesota gifts", "Twin Cities restaurant gift card, food gift card, local restaurant gift", "Verified gift-card visual with real food choices.", "gift_cards", "conversion"),
]


GBP_THEMES = [
    ("Update", "order from {location}", "Planning breakfast, lunch, dinner, or bakery pickup near {context}? Check the current menu, then start your order from {location}.", "Order Online", "Current meal plus pickup handoff", "order"),
    ("Update", "meet your neighborhood yum!", "{location} is {context}. Stop in for made-from-scratch food, the bakery case, or pickup on your route.", "Learn More", "Current exterior and dining room", "location"),
    ("Update", "bakery case at {location}", "See what the bakery case looked like when we photographed it today, then stop by {location} to check the current selection.", "Learn More", "Same-day case image with capture time", "location"),
    ("Update", "plan office lunch from {location}", "Feeding a meeting or group near {location}? Start a catering note with the date, group size, and pickup details.", "Learn More", "Box lunches or catering trays", "catering"),
    ("Update", "pick up a Patticake locally", "Planning a birthday or celebration near {location}? Start a local cake request with the date, message, and pickup details.", "Learn More", "Boxed Patticake at the location counter", "cake_request"),
    ("Update", "bring something sweet", "Add a bakery stop to your next {location} order. Check the current menu and the in-store case before you decide what comes home.", "Order Online", "Bakery box beside a takeout order", "order"),
    ("Update", "breakfast, lunch, or dinner", "{location} serves the everyday yum! menu from {context}. Use the current menu and location page before you visit.", "Learn More", "Three real daypart images", "location"),
    ("Offer", "send a yum! gift card", "Give them the choice of food, bakery, and the order they already love with a yum! gift card.", "Buy", "Verified gift-card visual", "gift_cards"),
    ("Event", "seasonal menu check", "See what is currently featured at yum!, then choose {location} for the next order. Availability can change, so the live menu is the source of truth.", "Order Online", "Verified seasonal item with approved dates", "order"),
    ("Update", "need help with a larger plan?", "For catering, cake, or event questions connected to {location}, start with the relevant inquiry so the yum! team can route the details.", "Learn More", "Catering spread and Patticake detail", "catering"),
]


SHOT_GROUPS = {
    "Food": [
        ("Soup steam with spoon entering frame", "vertical and square", "comfort-food Reel opener", "P0", "Backlight steam and keep the bowl label-free.", "Current soup, spoon, clean table", "Reels, TikTok, Feed, GBP"),
        ("Sandwich cut and cross-section", "vertical", "menu feature and lunch ad", "P0", "Cut once on camera and hold the cross-section for two seconds.", "Verified sandwich, knife, plate", "Reels, Shorts, paid"),
        ("Breakfast assembly at the pass", "vertical", "daypart Reel", "P1", "Capture hands and sequence, not a static plate only.", "Verified breakfast order", "Reels, TikTok, Stories"),
        ("Family-style dinner handoff", "horizontal and vertical", "pickup and email crossover", "P1", "Show several real dishes without inventing a bundle.", "Current dishes, takeout bag", "Feed, Facebook, email, paid"),
        ("Seasonal item macro and full plate", "vertical and square", "limited menu campaign", "P1", "Record approval date and publish-by date with the shot.", "Verified seasonal item", "all social, GBP, paid"),
    ],
    "Bakery": [
        ("Morning case restock", "vertical", "same-day Story and Reel", "P0", "Capture location and time; do not imply lasting stock.", "Fresh trays, case cloth", "Stories, Reels, GBP"),
        ("Bakery case full scan", "vertical and horizontal", "location and menu proof", "P0", "Slow scan with no fast whip pan.", "Current case", "Reels, Feed, web, GBP"),
        ("Tray pull from oven or rack", "vertical", "process content", "P1", "Film only a safe, real production step.", "Tray, oven mitts", "Reels, TikTok, Shorts"),
        ("Bakery box closing", "vertical and square", "take-home and gifting", "P1", "Logo faces camera and hands stay natural.", "Current box, bakery item", "Feed, Stories, paid"),
        ("Staff bakery pick", "vertical", "human recommendation", "P1", "Record name, location, item, and consent.", "Current case item", "Reels, TikTok, Stories"),
    ],
    "Patticake": [
        ("Full cake turntable", "vertical and square", "product hero", "P0", "Use soft side light and preserve buttercream texture.", "Patticake, simple stand", "Feed, Reels, paid, Pinterest"),
        ("First slice lift", "vertical", "core motion proof", "P0", "Hold the clean layer reveal for at least two seconds.", "Patticake, knife, server", "Reels, TikTok, Shorts, paid"),
        ("Layer macro", "vertical and horizontal", "product proof and web crossover", "P0", "Keep focus on chocolate layers and vanilla buttercream.", "Fresh slice, white plate", "all channels"),
        ("Gift note placement", "vertical", "gifting process", "P0", "Do not show private names unless approved.", "Blank or approved note, box", "Reels, Stories, paid"),
        ("Top-view buttercream", "square and 2:3", "Pinterest and feed", "P1", "Keep the top visible and the background neutral.", "Patticake, simple surface", "Pinterest, Feed, GBP"),
    ],
    "Catering": [
        ("Box lunch assembly line", "vertical and horizontal", "process and lead ad", "P0", "Show labels and final check without private names.", "Boxes, current food, labels", "Reels, LinkedIn, paid"),
        ("Finished meeting spread", "horizontal and vertical", "lead conversion hero", "P0", "Show the whole room and one food detail.", "Trays, plates, napkins", "LinkedIn, Facebook, Feed, paid"),
        ("Bakery add-on tray", "vertical and square", "basket-building creative", "P0", "Place in real meeting context.", "Bakery tray, coffee, plates", "Reels, LinkedIn, GBP"),
        ("Catering pickup handoff", "vertical", "operational proof", "P1", "Use a manageable real order and no capacity claim.", "Packed catering order", "Reels, Stories, paid"),
        ("Planner checklist with food proof", "vertical and 4:5", "carousel and lead ad", "P1", "Blur private event details.", "Notebook, catering menu, food", "Feed, LinkedIn, Pinterest"),
    ],
    "Locations": [
        ("Each storefront straight-on", "vertical and horizontal", "location identification", "P0", "Shoot in open light with signage readable.", "Clean exterior", "Feed, Reels, GBP, paid"),
        ("Front door walk-in", "vertical", "location POV", "P0", "Stable walk with no identifiable guest faces.", "Storefront and entry", "Reels, TikTok, Stories"),
        ("Dining room wide", "horizontal and vertical", "room and family context", "P1", "Use a real service period or a clean empty-room moment.", "Current dining room", "Feed, Facebook, GBP, web"),
        ("Pickup counter", "vertical", "conversion proof", "P0", "Capture check and handoff.", "Real order and counter", "Reels, paid, Stories"),
        ("Parking-to-door route", "vertical", "practical location Story", "P2", "Do not block traffic or show license plates.", "Exterior route", "Stories, GBP"),
    ],
    "Staff": [
        ("Staff portrait in work context", "vertical and square", "human brand post", "P0", "Get written consent and record name/location.", "Work area, clean uniform", "Feed, LinkedIn, GBP"),
        ("One staff favorite explanation", "vertical", "recommendation Reel", "P0", "Record item availability and publish window.", "Current menu item", "Reels, TikTok, Stories"),
        ("Kitchen handoff between team members", "vertical", "process proof", "P1", "Film real workflow without disrupting service.", "Real order", "Reels, Shorts"),
        ("Baker finishing a real item", "vertical and horizontal", "craft content", "P0", "Show one precise step and the result.", "Current bakery item", "Reels, Feed, web"),
        ("Counter thank-you moment", "vertical", "hospitality proof", "P1", "No scripted cheer. Keep guest anonymous or consented.", "Pickup order", "Stories, Reels"),
    ],
    "Customers and hands": [
        ("Hands sharing the first cake slice", "vertical", "celebration proof", "P0", "Consent required; faces optional.", "Patticake, plates, server", "Reels, Feed, paid"),
        ("Order pickup handoff", "vertical", "local order conversion", "P0", "Keep names and receipts out of frame.", "Real takeout bag", "Reels, Stories, paid"),
        ("Family serving dinner", "horizontal and vertical", "home occasion", "P1", "Use real food and natural interaction.", "Current yum! dishes", "Facebook, Feed, email"),
        ("Meeting attendees serving plates", "horizontal and vertical", "catering proof", "P1", "Get permission from visible people.", "Real catering spread", "LinkedIn, Reels, paid"),
        ("Recipient opening gift note", "vertical", "Patticake gifting", "P0", "Hide private text unless approved.", "Gift box and note", "Reels, TikTok, paid"),
    ],
    "Packaging": [
        ("Patticake box open and close", "vertical", "shipping process", "P0", "Use current packaging only.", "Current box and inserts", "Reels, TikTok, Shorts"),
        ("yum! takeout bag at counter", "vertical and square", "pickup proof", "P0", "Logo clear, receipt hidden.", "Current bag and order", "Feed, Reels, paid"),
        ("Catering labels and stack", "vertical", "planner proof", "P1", "Use generic or approved names.", "Boxes and labels", "LinkedIn, Reels"),
        ("Gift card purchase on phone", "vertical", "gift card conversion", "P1", "Use test data and hide payment details.", "Phone, food backdrop", "Stories, Reels, paid"),
        ("Bakery box on home table", "horizontal and vertical", "take-home occasion", "P1", "Open into real product reveal.", "Bakery box and table", "Feed, Facebook, email"),
    ],
    "Gifting": [
        ("Thank-you note and Patticake box", "2:3 and vertical", "gift campaign hero", "P0", "Use approved or generic note text.", "Gift box, note, ribbon", "Pinterest, Feed, paid"),
        ("Client gift boxes in a row", "horizontal and vertical", "corporate gifting", "P0", "Avoid fake quantities; show what is real.", "Multiple current boxes", "LinkedIn, paid, Feed"),
        ("Birthday pickup in car", "vertical", "local pickup POV", "P1", "Vehicle stationary; box secure; no unsafe filming.", "Box and passenger seat", "TikTok, Reels, Stories"),
        ("Former local opens cake", "vertical", "nostalgia gifting", "P1", "Get recipient consent and real reaction.", "Delivered box, note, cake", "Reels, Facebook, paid"),
        ("Gift card and handwritten note", "square and 4:5", "always-on gift card", "P1", "Keep note recipient-specific but non-private.", "Gift card, note, food", "Feed, Facebook, GBP"),
    ],
    "Weddings and events": [
        ("Tiered cake in full room", "2:3 and vertical", "event context", "P0", "Permission from venue and client required.", "Real event cake and room", "Pinterest, Feed, paid"),
        ("Piping and floral detail", "2:3 and vertical", "inspiration and proof", "P0", "Do not over-style or add fake florals.", "Event cake details", "Pinterest, Reels"),
        ("Cake cut", "vertical", "motion centerpiece", "P0", "Capture wide and macro angles with consent.", "Knife, cake, couple or host hands", "Reels, Shorts, paid"),
        ("Plated event slice", "vertical and square", "layer proof", "P1", "Keep plate and table real to event.", "Slice, plate, fork", "Feed, Pinterest, Stories"),
        ("Planner inquiry setup", "4:5 and vertical", "lead-generation checklist", "P1", "Blur private timeline details.", "Notebook, cake photo, calendar", "Feed, Pinterest, paid"),
    ],
    "Seasonal": [
        ("Verified seasonal item hero", "vertical and square", "campaign launch", "P0", "Log approval, start date, and end date.", "Current item and simple prop", "all channels"),
        ("Holiday gift packing", "vertical", "deadline campaign", "P0", "Use only after deadline and packaging confirmation.", "Current gift packaging", "Reels, Stories, paid"),
        ("Graduation cake message", "vertical and 2:3", "occasion demand", "P1", "Use approved generic message or real consent.", "Cake and graduation prop", "Reels, Pinterest, Feed"),
        ("Teacher thank-you setup", "vertical and square", "seasonal gifting", "P1", "Avoid school logos without permission.", "Note, box, cake", "Feed, Facebook, Pinterest"),
        ("Rainy or snowy pickup", "vertical", "weather-relevant local order", "P2", "Film safely from indoors or while stationary.", "Weather window, pickup bag", "Stories, Reels, GBP"),
    ],
}


def clean_text(value: Any) -> str:
    return str(value).replace("|", "\\|").replace("\n", "<br>")


def table(headers: list[str], rows: list[list[Any] | tuple[Any, ...]]) -> str:
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join("---" for _ in headers) + " |",
    ]
    lines.extend("| " + " | ".join(clean_text(value) for value in row) + " |" for row in rows)
    return "\n".join(lines)


def write_text(rel: str, content: str) -> Path:
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")
    return path


def write_json(rel: str, payload: Any) -> Path:
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    return path


def write_csv(rel: str, headers: list[str], rows: list[list[Any] | tuple[Any, ...]]) -> Path:
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(headers)
        writer.writerows(rows)
    return path


def destination(key: str) -> str:
    return DESTINATIONS.get(key, key)


def build_strategy_overview() -> str:
    role_rows = [
        ("yum!", "Be the useful daily food habit for Twin Cities neighborhoods.", "Orders, pickup, location visits, catering leads, bakery add-ons, gift cards, repeat orders.", "Current food, staff, locations, catering process, and bakery case."),
        ("Patticake", "Create occasion urgency for a cake people can gift, pick up, or request.", "Cake orders or requests, gifting, birthdays, corporate leads, event inquiries, repeat reminders.", "Cake layers, message, packing, pickup, delivery or unboxing, and real celebrations."),
    ]
    channel_rows = [
        ("Instagram Feed", "Saveable proof and campaign anchors.", "Menu, cake, catering, location, occasion.", "Profile/link-in-bio destination or paid CTA."),
        ("Instagram Reels", "Reach, appetite, and fast process proof.", "Hands, assembly, first slice, location POV.", "On-screen CTA plus profile link or ad button."),
        ("Instagram Stories", "Same-day conversion and lightweight research.", "Bakery availability, polls, reminders, links.", "Link sticker to the exact route."),
        ("TikTok", "Native discovery and creator-style proof.", "POV, staff voice, packing, unboxing, decisions.", "Spoken and on-screen action."),
        ("Facebook", "Local conversion, families, planners, and retargeting.", "4:5 food, gifting, location, catering.", "Direct link or platform CTA."),
        ("Pinterest", "Long-tail occasion search.", "Birthday, wedding, gifts, office food, Twin Cities bakery.", "One destination per Pin."),
        ("YouTube Shorts", "Evergreen discovery and searchable process.", "Guides, first slice, catering build, location montage.", "End card and description destination."),
        ("Google Business Profile", "Location-level intent capture on Search and Maps.", "Current local food, bakery, catering, pickup.", "Order, Learn More, or location page button."),
        ("Meta paid", "Scale proven local, gifting, and lead concepts.", "Placement-native 4:5 and 9:16 variants.", "Objective-matched CTA and landing page."),
        ("Email/social crossover", "Reuse one campaign story without flattening the channel.", "Hero image, subject hook, social cutdown, reminder.", "Deep link with consistent campaign UTM."),
    ]
    conversion_rows = [
        ("Food or location Reel", "Menu or order page", "Menu view, location selection, order start, completed order where measurable."),
        ("Bakery Story", "Location page", "Direction click, location-page view, same-day in-store lift where measurable."),
        ("Catering carousel or video", "Catering inquiry", "Qualified inquiry and confirmed-order rate."),
        ("Patticake gift content", "Patticake order page", "Order start, purchase, delivery-option view."),
        ("Birthday or event content", "Cake inquiry", "Completed cake request and qualified follow-up."),
        ("Gift-card content", "Toast gift-card checkout", "Gift-card purchase and value."),
        ("GBP location post", "Exact location or order route", "Website click, direction action, order action."),
    ]
    return f"""# social strategy overview

## executive strategy

Keep the brands distinct in both creative and measurement:

- **yum!** is the everyday local food habit. Its social job is to reduce the next meal decision, make four locations easy to choose, and keep catering and bakery visible.
- **Patticake** is an occasion product. Its social job is to make the gift or celebration feel planned, personal, and urgent enough to act on.

{table(["Brand", "Role", "Acquisition objectives", "Proof to show"], role_rows)}

## primary objectives

1. Grow completed local order sessions by location and daypart.
2. Increase qualified catering inquiries from office and event planners.
3. Increase Patticake order starts, cake requests, and gift reminders.
4. Turn birthdays, thank-yous, client gifts, weddings, and events into distinct demand lanes.
5. Use bakery and staff content to improve repeat visits and add-on behavior.
6. Build a first-party retargeting pool through useful video, site visits, and completed forms.

## channel purpose

{table(["Channel", "Primary role", "Best content", "Conversion path"], channel_rows)}

## organic and paid split

Use a **70/30 production split**: 70% of monthly concepts should work as credible organic content, and 30% should be built specifically for paid conversion or lead generation. Paid spend is not required to follow the same ratio.

- Organic proves which hooks, products, occasions, staff voices, and locations earn attention.
- Paid takes the proven concept, gives it a cleaner action, a placement-native crop, and one matched destination.
- Do not boost a post simply because it performed well. Boost only when the creative, audience, objective, landing page, and CTA all point to the same action.

## conversion mapping

{table(["Content type", "Destination", "Measure"], conversion_rows)}

## recommended cadence

| Brand or surface | Sustainable cadence |
| --- | --- |
| yum! Feed and Reels | 4 posts per week, with at least 2 Reels |
| yum! Stories | 5-7 days per week, weighted to bakery, ordering, and location |
| Patticake Feed and Reels | 3 posts per week, with at least 2 occasion or process videos |
| Patticake Stories | 3-5 days per week, weighted to dates, gifting, pickup, and delivery options |
| TikTok | 2-3 native vertical posts per week across both brands |
| Pinterest | 4-6 original Pins per week, mostly Patticake and catering |
| YouTube Shorts | 1-2 useful evergreen Shorts per week |
| Google Business Profile | 1 fresh post per location per week |
| Paid creative refresh | Review weekly; add 2-4 new concepts or hooks every two weeks |

## paid boosting rules

Boost only when all are true:

1. The post has one measurable business goal.
2. The destination page is live, mobile-ready, and matches the post.
3. The creative is available in 4:5 and 9:16 where those placements are selected.
4. Copy contains no unconfirmed price, availability, deadline, review, capacity, or fulfillment promise.
5. Organic comments show relevant intent, not only broad engagement.
6. The campaign has an exclusion plan for recent converters and a frequency review.

## link and UTM system

Use this base:

`utm_source={{platform}}&utm_medium={{organic_social|paid_social}}&utm_campaign={{campaign_slug}}&utm_content={{asset_id}}`

Use location in either the campaign or content value, not in an untracked vanity redirect. Example:

`?utm_source=instagram&utm_medium=organic_social&utm_campaign=yum_lunch_summer&utm_content=yum_local-order_saint-paul_20260709_v01`
"""


def build_content_pillars() -> str:
    rows = [[item[key] for key in ["name", "brand", "audience", "goal", "ideas", "channels", "ctas", "assets"]] for item in PILLARS]
    return "# content pillars\n\n" + table(
        ["Pillar", "Brand fit", "Audience", "Business goal", "Example post ideas", "Best channels", "CTA examples", "Asset types"],
        rows,
    )


def build_visual_identity() -> str:
    return """# social visual identity toolkit

## shared brand signals

- **Logo:** use the current circular yum! mark. Preserve its proportions and colors. Do not redraw it, stretch it, add effects, or put it inside another badge.
- **Patticake lockup:** pair the yum! circle with `patticake` set in lowercase Trocchi when a wordmark is needed.
- **Display type:** Trocchi 400, lowercase, short, and warm. Never fake a bold Trocchi.
- **Support type:** Archivo Narrow 400, 500, or 700 for body, captions, labels, CTA, and burned-in subtitles.
- **Core colors:** brand primary red `#b4212b`, bright red `#e03a3e`, ink `#2d2d2d`, white, light blue `#cae4fd`, and soft blue `#aed2ef`.
- **Copy field:** reserve a dedicated baby-blue field beside or below unobstructed photography. Use logo-red type and action. Do not place a floating card, badge, glow, or text over the image.
- **Edges:** keep the copy field sharp and structural. Avoid pill-heavy styling and decorative gradients.

## visual principles

1. Food or cake is the first proof, not a decorative background.
2. Use real hands, staff, locations, packaging, tables, and bakery work.
3. Let one product or action dominate each frame.
4. Keep headlines to 3-8 words and one action per asset.
5. Show the operational path when it reduces uncertainty: pick a kitchen, write the note, pack the cake, assemble the boxes, or start the inquiry.
6. Reserve separate photo and copy regions from the first frame. Never place the copy field over the photograph.

## photography

- Use soft natural or diffused side light. Keep food texture and true color.
- Prefer 35-50mm environmental frames and macro details over wide distorted close-ups.
- Photograph the same action in vertical, square, and horizontal orientation while the setup is real.
- Keep plates, bakery boxes, counters, and tables recognizable as yum!, not generic studio props.
- Show steam, crumbs, frosting texture, labels, hands, and imperfect real service details when they support the story.
- Record the location, date, item, consent status, and campaign window with every capture.

## video and motion

- Open on visible motion in frame one: a box opening, tray arriving, knife cutting, handoff, pan, steam, or frosting pass.
- Use 8-20 seconds for direct-response concepts and 20-40 seconds for guides or creator stories.
- Use straight cuts, restrained push-ins, and explicit frame-based easing. Avoid template-heavy transitions.
- Burn in the core hook and CTA. Captions must remain readable without sound.
- Keep photography unobstructed. Move copy through a dedicated baby-blue field with logo-red type and a restrained logo rail.
- Keep the final CTA visible for at least two seconds above the platform UI.

## composition

- Reserve the center-left vertical zone for copy: x 88-892 and y 250-1460 on a 1080x1920 master.
- Keep key food and faces outside the right-side action rail.
- Frame location exteriors so the sign remains readable after 4:5 and 9:16 crops.
- For Patticake, show full cake, detail, then slice. Do not rely on a single frosting macro.
- For catering, show the whole room or spread before relying on isolated tray close-ups.

## surface-specific direction

| Surface | Direction |
| --- | --- |
| yum! social | Busy-but-clear everyday food, neighborhood utility, real counters, warm room light, direct ordering action. |
| Patticake social | Gift box, note, cake layers, human occasion, a little more white space, and stronger sequence from gift to table. |
| Catering | Planner utility, labels, room setup, multiple components, and clear inquiry step. |
| Paid ads | Product or occasion in frame one, one proof line, one CTA, placement-native crop, no decorative copy. |
| UGC and creators | Phone-native movement, real voice, real reason for ordering or gifting, subtitles in Archivo Narrow. |
| Stories | One idea per frame, link sticker space, same-day location and availability discipline. |
| Reels and TikTok | Hook immediately, process proof by second three, action by the final third. |

## avoid

- Stock-photo celebrations, fake kitchens, artificial food composites, or generated products presented as real.
- Black caption boxes, black CTA panels, pink wash behind copy, neon gradients, luxury black-and-gold styling, or one-color red overload.
- Unsupported prices, availability, hours, deadlines, capacity, delivery coverage, dietary claims, or customization.
- Fake reviews, unattributed quotes, staged reactions presented as customers, or private shipping and order data.
- Tiny logo corners as the only brand signal. The product, type, color, and voice should all feel like yum!.
"""


def build_asset_templates() -> str:
    rows = []
    for item in TEMPLATES:
        (
            template_id,
            name,
            purpose,
            dimensions,
            layout,
            required_asset,
            headline,
            caption,
            cta,
            variations,
            channels,
            dest_key,
            file_name,
        ) = item
        rows.append((name, purpose, dimensions, layout, required_asset, headline, caption, cta, variations, channels, f"{destination(dest_key)} + standard UTM", file_name))
    return "# asset template system\n\nEach template must preserve editable copy, replaceable media, a locked logo zone, and one tracked destination.\n\n" + table(
        ["Template", "Purpose", "Dimensions", "Layout", "Required asset", "Headline style", "Caption style", "CTA", "Variations", "Best channels", "Tracking", "File name"],
        rows,
    )


def build_channel_specs() -> str:
    notes = """

## source notes

- Instagram currently preserves photo uploads up to 1080 px wide within supported ratios from 1.91:1 through 3:4. Reels support ratios through 9:16, with at least 720 px resolution and 30 fps.
- Meta recommends 9:16 Reels creative with audio and key messages in the safe zone for stronger placement performance.
- TikTok's current ad policy requires dynamic, legible, high-resolution video with audio and supports 9:16, 1:1, and 16:9. The Yum production master remains 9:16.
- YouTube classifies square or vertical uploads up to three minutes as Shorts for standard channels under its current rule. Yum should keep direct-response Shorts much shorter.
- Pinterest recommends 2:3 for regular image/video Pins and 9:16 for full-bleed video, with published safe-zone offsets for 1080x1920 video.
- Google recommends 720x720 photos for Business Profiles and accepts video up to 30 seconds, 75 MB, and 720p or higher.

Source URLs and verification date are saved in `data/platform-sources.json`.
"""
    return "# channel-specific specs\n\n" + table(
        ["Channel", "Recommended dimensions", "Safe zones", "Caption guidance", "Hashtags", "CTA", "Frequency", "Best assets", "Paid notes"],
        CHANNELS,
    ) + notes


def calendar_rows() -> list[list[Any]]:
    rows: list[list[Any]] = []
    for item in CALENDAR:
        day, brand, channel, pillar, concept, asset_type, hook, caption, cta, dest_key, paid, notes = item
        rows.append([day, brand, channel, pillar, concept, asset_type, hook, caption, cta, destination(dest_key), paid, notes])
    return rows


def build_calendar() -> str:
    return "# 30-day content calendar\n\nThe calendar is a launch sequence, not a requirement to publish only once per day. Story follow-ups can run around the anchor post.\n\n" + table(
        ["Day", "Brand", "Channel", "Content pillar", "Post concept", "Asset type", "Hook or headline", "Caption direction", "CTA", "Landing page", "Paid boost?", "Designer/editor notes"],
        calendar_rows(),
    )


def caption_rows() -> list[list[Any]]:
    rows: list[list[Any]] = []
    index = 1
    for category, captions in CAPTION_GROUPS.items():
        for caption, cta, channel, funnel, visual in captions:
            rows.append([f"CAP-{index:03d}", category, caption, cta, channel, funnel, visual])
            index += 1
    return rows


def build_captions() -> str:
    sections = ["# caption bank", "", "Operational placeholders in braces must be replaced and approved before publication.", ""]
    index = 1
    for category, captions in CAPTION_GROUPS.items():
        sections.append(f"## {category}")
        sections.append("")
        rows = []
        for caption, cta, channel, funnel, visual in captions:
            rows.append((f"CAP-{index:03d}", caption, cta, channel, funnel, visual))
            index += 1
        sections.append(table(["ID", "Caption", "CTA", "Best channel", "Funnel", "Suggested visual"], rows))
        sections.append("")
    return "\n".join(sections)


def hook_rows() -> list[list[Any]]:
    rows: list[list[Any]] = []
    index = 1
    for category, hooks in HOOK_GROUPS.items():
        for hook in hooks:
            rows.append([f"HOOK-{index:03d}", category, hook, "caption opener, on-screen text, spoken hook, or paid headline"])
            index += 1
    return rows


def build_hooks() -> str:
    sections = ["# short-form hook bank", "", "Each hook is designed for caption line one, on-screen text, spoken open, or a paid headline.", ""]
    index = 1
    for category, hooks in HOOK_GROUPS.items():
        sections.append(f"## {category}")
        sections.append("")
        for hook in hooks:
            sections.append(f"- `HOOK-{index:03d}` {hook}")
            index += 1
        sections.append("")
    return "\n".join(sections)


def build_video_scripts() -> str:
    sections = [
        "# short-form video script pack",
        "",
        "All scripts assume a 1080x1920 master, burned-in captions, unobstructed photography, a dedicated baby-blue copy field with logo-red type, and one verified destination. Braced operational fields require replacement before release.",
        "",
    ]
    for index, script in enumerate(VIDEO_SCRIPTS, start=1):
        sections.extend(
            [
                f"## {index}. {script['title']}",
                "",
                table(
                    ["Brand", "Goal", "Target audience", "Length", "Paid potential", "Best channels"],
                    [[script["brand"], script["goal"], script["audience"], script["length"], script["rating"], script["channels"]]],
                ),
                "",
                f"**Hook:** {script['hook']}",
                "",
                "**Shot list:**",
                "",
            ]
        )
        sections.extend(f"{shot_index}. {shot}" for shot_index, shot in enumerate(script["shots"], start=1))
        sections.extend(
            [
                "",
                "**On-screen text:** " + " -> ".join(script["onscreen"]),
                "",
                f"**Voiceover or caption:** {script['voiceover']}",
                "",
                f"**CTA:** {script['cta']}",
                "",
                f"**Editing notes:** {script['editing']}",
                "",
            ]
        )
    return "\n".join(sections)


def build_paid_kit() -> str:
    sections = [
        "# paid social ad kit",
        "",
        "Build separate campaigns for local food, catering, gifting, and event intent. Do not collapse yum! and Patticake into one audience or one landing page.",
        "",
    ]
    for index, campaign in enumerate(PAID_CAMPAIGNS, start=1):
        sections.extend(
            [
                f"## {index}. {campaign['name']}",
                "",
                table(
                    ["Objective", "Audience", "Funnel", "Offer", "Landing page", "CTA", "Success metric"],
                    [[campaign["objective"], campaign["audience"], campaign["funnel"], campaign["offer"], destination(campaign["landing"]), campaign["cta"], campaign["metric"]]],
                ),
                "",
                f"**Creative concept:** {campaign['concept']}",
                "",
                f"**Visual direction:** {campaign['visual']}",
                "",
                f"**Video concept:** {campaign['video']}",
                "",
                "**Primary text variations:**",
                "",
            ]
        )
        sections.extend(f"{text_index}. {copy}" for text_index, copy in enumerate(campaign["texts"], start=1))
        sections.extend(["", "**Headline variations:**", ""])
        sections.extend(f"{headline_index}. {copy}" for headline_index, copy in enumerate(campaign["headlines"], start=1))
        sections.extend(["", f"**Testing notes:** {campaign['testing']}", ""])

    sections.extend(
        [
            "## retargeting copy by action",
            "",
            table(
                ["Audience", "Copy", "Destination"],
                [
                    ("Order starter", "Still choosing lunch? Return to the current menu and finish with the kitchen nearest you.", DESTINATIONS["order"]),
                    ("Catering form starter", "The meeting date did not move. Finish the catering note with the group and pickup details.", DESTINATIONS["catering"]),
                    ("Cake form starter", "The birthday is still coming. Return to the date, message, and cake details.", DESTINATIONS["cake_request"]),
                    ("Patticake product viewer", "You picked the gift idea. Now add the note and check current pickup or delivery options.", DESTINATIONS["patticake"]),
                    ("Past yum! customer", "Ready for another yum! order? Start with today's route and the current menu.", DESTINATIONS["order"]),
                    ("Past Patticake customer", "Another birthday, thank-you, or just-because date coming up? Put the cake reminder back on the calendar.", DESTINATIONS["patticake"]),
                ],
            ),
            "",
            "## location-specific ad copy",
            "",
        ]
    )
    for loc in LOCATIONS:
        sections.append(f"- **{loc['name']}:** Order from {loc['context']}. Check the current menu and send pickup to the {loc['name']} kitchen.")
    sections.extend(
        [
            "",
            "## deadline copy rule",
            "",
            "Use a holiday or social deadline only after the owner confirms the exact date, time zone, product route, and inventory or delivery constraint. Store the approval in the campaign folder and set an asset expiry date.",
            "",
            "## measurement setup",
            "",
            "- One primary conversion event per campaign.",
            "- UTMs on every destination.",
            "- Creative ID must identify brand, audience, concept, hook, format, date, and version.",
            "- Report qualified leads separately from raw form starts.",
            "- Compare 4:5 feed and 9:16 vertical by placement, not as one blended creative result.",
            "- Review frequency, comments, landing-page conversion, and downstream order quality every week.",
        ]
    )
    return "\n".join(sections)


def build_creator_kit() -> str:
    sections = ["# creator and UGC toolkit", ""]
    for brief in CREATOR_BRIEFS:
        sections.extend(
            [
                f"## {brief['name']}",
                "",
                f"**Campaign goal:** {brief['goal']}",
                "",
                f"**Target audience:** {brief['audience']}",
                "",
                "**Required talking points:**",
                "",
            ]
        )
        sections.extend(f"- {item}" for item in brief["talking"])
        sections.extend(["", "**Do not say or show:**", ""])
        sections.extend(f"- {item}" for item in brief["avoid"])
        sections.extend(
            [
                "",
                "**Shot list:** " + "; ".join(brief["shots"]),
                "",
                f"**Deliverables:** {brief['deliverables']}",
                "",
                f"**CTA:** {brief['cta']}",
                "",
                "**Usage-rights placeholder:** Creator grants yum! Kitchen and Bakery and Patticake the paid and organic usage rights, term, territory, platforms, editing permissions, whitelisting permissions, and exclusivity period stated in the signed campaign agreement. Legal owner must replace this placeholder.",
                "",
                "**Disclosure reminder:** Use the legally required partnership or sponsored disclosure clearly and early. Do not hide it after a caption break.",
                "",
                "**Tracking:** Use `{CREATOR_CODE}` and a destination URL with creator, campaign, and asset UTMs.",
                "",
                "**Submission:** Upload original vertical files, raw clips, clean cover, caption draft, music source, consent records, and disclosure screenshot to the assigned creator folder.",
                "",
                "**Approval:** Brand owner checks claims and brand fit. Operations checks availability and fulfillment. Paid owner checks rights and placement safety. Publish only after all required approvals.",
                "",
            ]
        )
    sections.extend(
        [
            "## outreach and follow-up scripts",
            "",
            table(
                ["Use", "Message"],
                [
                    ("Initial DM", "Hi {NAME}. We are planning a {CAMPAIGN} story for yum! Kitchen and Bakery or Patticake in the Twin Cities. Your {SPECIFIC_CONTENT} feels like a strong fit. Are you open to a paid brief with clear deliverables and usage terms?"),
                    ("Brief follow-up", "Thanks, {NAME}. The concept centers on {REAL_OCCASION}, real food or cake, and a direct {CTA}. We would need {DELIVERABLES} by {DATE}. I can send the full scope and rights terms if that timing works."),
                    ("No-response follow-up", "Hi {NAME}. One quick follow-up on the yum! or Patticake {CAMPAIGN} brief. If the timing is not right, no problem. Please let us know by {DATE} so we can close the planning loop."),
                    ("Revision request", "Thanks for the first cut. Please keep the real footage and make these specific changes: {TIMECODE_CHANGE_LIST}. We are correcting {CLAIM|CTA|SAFE_ZONE|PRIVACY} before approval."),
                    ("Comment reply", "Thanks for sharing this with us. We love seeing {SPECIFIC_REAL_DETAIL}. Please keep the original file and send us a DM if you are open to discussing repost or paid usage rights."),
                ],
            ),
            "",
            "## creator scorecard",
            "",
            table(
                ["Criterion", "Weight", "Pass standard"],
                [
                    ("Audience and market fit", "20%", "Meaningful Twin Cities, gifting, office-planning, or event audience fit."),
                    ("Real-food credibility", "20%", "Work looks lived-in and specific, not stock or generic lifestyle content."),
                    ("Hook and retention", "15%", "Motion and point of view land in the first second; core proof appears by second three."),
                    ("Brand and claim accuracy", "15%", "No unsupported prices, hours, availability, delivery, dietary, or customization claims."),
                    ("Production usefulness", "10%", "Clean raw vertical footage, usable audio, safe composition, and multiple edit points."),
                    ("Conversion clarity", "10%", "One accurate CTA and destination."),
                    ("Professional reliability", "10%", "Meets timing, rights, disclosure, revision, and file-delivery requirements."),
                ],
            ),
        ]
    )
    return "\n".join(sections)


def build_story_kit() -> str:
    rows = []
    for item in STORY_SEQUENCES:
        title, frame1, frame2, frame3, cta, sticker, use_case = item
        rows.append((title, frame1, frame2, frame3, "Optional proof, deadline, or location frame", sticker, cta, use_case))
    return "# Instagram and Facebook Story toolkit\n\nUse one idea per frame. Keep link stickers inside the safe zone and remove native sticker guides from paid exports.\n\n" + table(
        ["Sequence", "Frame 1", "Frame 2", "Frame 3", "Optional Frame 4", "Sticker or poll", "CTA", "Best use case"],
        rows,
    )


def pinterest_rows() -> list[list[Any]]:
    rows = []
    for index, item in enumerate(PINS, start=1):
        title, pin_title, description, board, keywords, visual, dest_key, funnel = item
        rows.append([f"PIN-{index:02d}", title, pin_title, description, board, keywords, visual, destination(dest_key), funnel])
    return rows


def build_pinterest_kit() -> str:
    return "# Pinterest toolkit\n\nPrioritize original 2:3 imagery and one destination per Pin. Do not repeatedly upload the same creative with only minor copy changes.\n\n" + table(
        ["ID", "Concept", "Pin title", "Pin description", "Board", "Search keywords", "Visual direction", "Destination", "Funnel"],
        pinterest_rows(),
    )


def gbp_rows() -> list[list[Any]]:
    rows = []
    index = 1
    for loc in LOCATIONS:
        for post_type, headline, body, cta, image, dest_key in GBP_THEMES:
            rows.append(
                [
                    f"GBP-{index:03d}",
                    post_type,
                    headline.format(location=loc["name"], context=loc["context"]),
                    body.format(location=loc["name"], context=loc["context"]),
                    cta,
                    image,
                    f"Specific to {loc['name']}: {loc['context']}.",
                    destination(loc["id"] if dest_key == "location" else dest_key),
                ]
            )
            index += 1
    return rows


def build_gbp_kit() -> str:
    return "# Google Business Profile post kit\n\nCreate each post inside the matching location profile. Do not include a phone number in the post body. Use valid offer or event dates, and remember that undated posts may archive after six months.\n\n" + table(
        ["ID", "Post type", "Headline", "Body", "CTA", "Recommended image", "Location relevance", "Destination"],
        gbp_rows(),
    )


def build_profile_kit() -> str:
    return f"""# social bio and profile toolkit

## Instagram bio: yum!

made-from-scratch breakfast, lunch, dinner + bakery
4 Twin Cities kitchens
catering, cakes + gift cards below

Primary link destination: {DESTINATIONS['yum_home']}

## Instagram bio: Patticake, if separate

yum!'s chocolate layer cake with vanilla buttercream
send a cake or pick up locally
birthdays, thank-yous + events below

Primary link destination: {DESTINATIONS['patticake']}

## Facebook About: yum!

yum! Kitchen and Bakery serves made-from-scratch breakfast, lunch, dinner, bakery, takeout, and catering from four Twin Cities restaurants: St. Louis Park, Shady Oak in Minnetonka, St. Paul, and Woodbury. Use the current menu, choose a location, order pickup, or start a catering or cake inquiry online.

## Facebook About: Patticake

Patticake is yum!'s chocolate layer cake with vanilla buttercream, built for birthdays, thank-yous, gifting, and celebration tables. Check the current order page for delivery options, choose local pickup, or start a cake or event inquiry.

## TikTok bio

real food, real bakery, four Twin Cities kitchens
Patticake gifting + cake moments

## Pinterest profile description

Made-from-scratch Twin Cities food, bakery, office catering, Patticake birthday cakes, thank-you gifts, corporate gifting, and event cake ideas from yum! Kitchen and Bakery.

## link-in-bio order

1. Order yum! online: {DESTINATIONS['order']}
2. Find a yum! location: {DESTINATIONS['locations']}
3. Plan catering: {DESTINATIONS['catering']}
4. Send a Patticake: {DESTINATIONS['patticake']}
5. Pick up or request a cake: {DESTINATIONS['cake_request']}
6. Buy a gift card: {DESTINATIONS['gift_cards']}
7. Contact yum!: {DESTINATIONS['contact']}

## Highlight categories

| Highlight | Contents |
| --- | --- |
| Order | Menu guide, pickup flow, order link |
| Locations | One set per location, directions, room, pickup |
| Catering | Boxes, trays, bakery add-ons, inquiry link |
| Cakes | Patticake product, first slice, pickup, delivery options |
| Gift Cards | Purchase path and occasion examples |
| Weddings | Real event cakes, details, inquiry path |
| Reviews | Verified and attributed reviews only |
| FAQs | Shipping, pickup, catering, ordering, allergy routing |
| Seasonal | Owner-approved current campaigns with expiry dates |

## pinned posts

- **yum!:** first-time order guide, four-location guide, and catering explainer.
- **Patticake:** why Patticake, send vs local pickup, and birthday or gifting explainer.

## auto-reply recommendations

- Keep the first auto-reply to one sentence and a short route menu: Order, Location, Catering, Cake, or Gift Card.
- Do not claim the message has been read by a person until it has.
- Route online-order problems to the pickup restaurant by phone.
- Route general issues to the contact form. Route catering and cake needs to their dedicated forms.
- Do not collect payment, medical, allergy, or private shipping information in social DMs.
"""


def build_dm_bank() -> str:
    rows = [
        ("Where are you located?", f"We have four Twin Cities kitchens: St. Louis Park, Shady Oak in Minnetonka, St. Paul, and Woodbury. Choose yours here: {DESTINATIONS['locations']}"),
        ("Do you ship?", f"Patticake has a delivery path on the current order page. Available dates and destinations are confirmed there: {DESTINATIONS['patticake']}"),
        ("Can I pick up?", f"Yes, local cake pickup starts with the cake request and location details here: {DESTINATIONS['cake_request']}"),
        ("How do I order?", f"Start with the current yum! menu and choose your pickup kitchen here: {DESTINATIONS['order']}"),
        ("Do you do catering?", f"Yes. Share the date, group size, pickup location, and what you need through the catering form: {DESTINATIONS['catering']}"),
        ("How much notice do you need?", f"The current catering page asks for 24 hours of notice for most pickup orders. Bigger or special-timing plans should start with a note or a call to the pickup restaurant: {DESTINATIONS['catering']}"),
        ("Do you do weddings?", f"Start an event cake inquiry with the date, occasion, and details. The bakery team can follow up about what is possible: {DESTINATIONS['cake_request']}"),
        ("Can I customize the message?", f"Add the requested cake message and gift-note details in the Patticake or cake request flow. The bakery team will follow up if anything needs clarification: {DESTINATIONS['cake_request']}"),
        ("What flavors do you have?", f"Patticake is the chocolate layer cake with vanilla buttercream shown on the current site. Other cake options and current details are listed here: {DESTINATIONS['cake_request']}"),
        ("Do you have gluten-free options?", "Please review the current gluten and allergy information on the menu and call the location before ordering. The restaurant team can help you choose carefully: https://yumkitchen.com/menu#gluten-allergy"),
        ("Can I send this as a gift?", f"Yes. Use the current Patticake page to check delivery or gifting options and add the message details: {DESTINATIONS['patticake']}"),
        ("Can I order for my office?", f"Yes. Start a catering note with the date, group size, pickup kitchen, and any bakery questions: {DESTINATIONS['catering']}"),
        ("Positive review or comment", "Thank you for sharing the specific part you loved. We will pass this along to the kitchen and bakery team."),
        ("Negative comment", f"I am sorry this happened. Please DM the order date and pickup location, without payment details, or send the note here so the right team can follow up: {DESTINATIONS['contact']}"),
        ("Delayed order concern", "Please call the pickup restaurant directly so the team can check the live order. The location page has the current phone number: " + DESTINATIONS["locations"]),
        ("Sold-out item", "I am sorry that item was gone. Bakery and seasonal availability can change during the day. Please check the current menu or call the location before your next trip."),
        ("Holiday deadline question", f"Use the current Patticake order page for live dates and options. We do not want to promise a deadline that has changed: {DESTINATIONS['patticake']}"),
    ]
    return "# comment and DM response bank\n\nKeep replies short, public-safe, and tied to the correct operational route. Move order details into a private or owned channel without collecting payment or sensitive information in social DMs.\n\n" + table(["Question or situation", "Response"], rows)


def build_hashtag_system() -> str:
    groups = [
        ("yum! local", "#yumKitchen #TwinCitiesEats #MinnesotaFood #LocalRestaurant #MadeFromScratch"),
        ("Twin Cities restaurant", "#TwinCitiesRestaurants #MinneapolisFood #SaintPaulEats #MinnetonkaMN #WoodburyMN"),
        ("bakery", "#TwinCitiesBakery #BakeryCase #ScratchBakery #LocalBakery #BakeryTreats"),
        ("catering", "#TwinCitiesCatering #OfficeCatering #BoxLunches #MeetingFood #CorporateLunch"),
        ("Patticake", "#Patticake #ChocolateLayerCake #VanillaButtercream #CakeGift #SendACake"),
        ("birthday cake", "#BirthdayCake #BirthdayCakeIdeas #TwinCitiesCakes #FirstSlice #CelebrationCake"),
        ("gifts", "#ThankYouGift #FoodGift #GiftDelivery #ClientGift #MinnesotaGift"),
        ("corporate gifting", "#CorporateGifting #ClientGifts #EmployeeAppreciation #BusinessGifts #TeamCelebration"),
        ("wedding cake", "#TwinCitiesWedding #WeddingCakeIdeas #EventCake #CakeTable #MinnesotaWedding"),
        ("seasonal", "Use the campaign, verified item, location, and occasion. Do not invent a branded seasonal hashtag without an owner."),
    ]
    return """# hashtag and keyword system

## practical hashtag rule

Use 3-5 relevant hashtags on Instagram and TikTok only when they improve classification or search. Put the most specific brand, product, occasion, and market terms first. Facebook and GBP do not need hashtag blocks. Pinterest needs keywords in titles and descriptions more than hashtag strings.

""" + table(["Group", "Bank"], groups) + """

## Instagram SEO keywords

- yum! Kitchen and Bakery
- Twin Cities breakfast, lunch, dinner, bakery, takeout, and catering
- St. Louis Park restaurant and bakery
- Minnetonka and Shady Oak lunch
- St. Paul restaurant on Snelling Avenue
- Woodbury restaurant and bakery
- Patticake chocolate layer cake with vanilla buttercream
- birthday cake pickup, thank-you cake, corporate gifting, event cake inquiry

## TikTok search phrases

- what to order at yum! Kitchen
- Twin Cities lunch and bakery
- pack a Patticake with us
- birthday cake pickup Twin Cities
- office catering Twin Cities
- send a thank-you cake
- Twin Cities bakery case
- Minnesota food gift

## Pinterest keywords

- birthday cake planning
- chocolate layer cake gift
- thank-you cake delivery
- client and corporate food gifts
- Twin Cities wedding cake
- office lunch catering ideas
- meeting bakery tray
- Twin Cities bakery and restaurant
- Minnesota nostalgia gift

## Google Business Profile keywords

Use natural location and service phrases in the body: `{LOCATION} restaurant`, `{LOCATION} bakery`, `pickup`, `breakfast`, `lunch`, `dinner`, `catering`, `cake pickup`, and `gift cards`. Do not repeat keywords unnaturally.
"""


def shot_rows() -> list[list[Any]]:
    rows = []
    index = 1
    for category, shots in SHOT_GROUPS.items():
        for description, orientation, use_case, priority, notes, props, channels in shots:
            rows.append([f"SHOT-{index:03d}", category, description, orientation, use_case, priority, notes, props, channels])
            index += 1
    return rows


def build_shot_list() -> str:
    return "# asset production shot list\n\nEvery capture should log date, location, product, consent, creator, orientation, usage rights, and operational expiry. Shoot the P0 list first.\n\n" + table(
        ["ID", "Category", "Description", "Orientation", "Use case", "Priority", "Notes", "Props", "Channels"],
        shot_rows(),
    )


def build_file_organization() -> str:
    return """# file organization system

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
"""


def build_editable_template_brief() -> str:
    template_names = "\n".join(f"{index}. {item[1]}" for index, item in enumerate(TEMPLATES, start=1))
    return f"""# Canva, Figma, and Adobe Express template brief

## template list

{template_names}

## page sizes

- Feed master: 1080x1440 3:4.
- Feed ad master: 1080x1350 4:5.
- Square fallback: 1080x1080.
- Vertical video and Story: 1080x1920.
- Pinterest image Pin: 1000x1500.
- Facebook link fallback: 1200x628.
- Google Business Profile: 720x720.

## editable fields

- Headline, support line, CTA, location, date, occasion, verified item, source, and approval expiry.
- Replaceable photo or video frames with crop controls.
- Optional caption strip and burned-in subtitle lines.
- UTM-ready destination and asset ID in export notes.

## locked elements

- Current yum! logo proportions and colors.
- Trocchi 400 headline style and lowercase rule.
- Archivo Narrow body, label, caption, and CTA styles.
- Core red, bright red, white, ink, light blue, and soft blue swatches.
- Safe-zone guides, logo clear space, CTA position, and minimum contrast.
- No black text-panel style and no pink-tinted copy background.

## replacement areas

- Full-bleed food, cake, location, catering, staff, or packaging media.
- One optional proof inset for a detail or process step.
- Creator-video placeholder that preserves the 9:16 safe zone.

## export settings

| Output | Setting |
| --- | --- |
| Static social | PNG, sRGB, exact pixel dimensions, no unintended transparency |
| Photo-heavy static | High-quality JPG when size matters, sRGB |
| Motion | MP4, H.264, 1080x1920, 30 fps, AAC audio when used |
| Paid master | Clean export with no organic sticker baked in |
| Review | Low-weight JPG preview plus source link and manifest entry |

## naming and approval

Use `{{brand}}_{{campaign}}_{{concept}}_{{location-or-audience}}_{{channel}}_{{ratio}}_{{date}}_v##_{{status}}`. Non-designers may replace approved media and fields, but they may not unlock brand styles, safe zones, logo geometry, the dedicated baby-blue copy field, or logo-red type. An owner approves claims and brand. Operations approves timing, availability, fulfillment, and location details. Paid media approves rights, crop, CTA, and destination.

## notes for non-designers

1. Duplicate the template before editing.
2. Replace the media first, then the copy.
3. Keep the headline under eight words.
4. Use one CTA only.
5. Check every platform crop at 100% and on a phone-sized preview.
6. Export to `draft` until all placeholders and confirmations are resolved.

## never change

- Logo artwork, logo colors, or aspect ratio.
- Headline family, lowercase rule, or body family without brand-owner approval.
- Safe-zone guides or minimum text size.
- The rule against floating text cards, badges, glow, black or pink panels, and copy over photography.
- An approved quote, review, menu fact, price, hour, deadline, or operational statement.
"""


def build_qa_checklist() -> str:
    checks = [
        "Brand is correctly identified as yum!, Patticake, or an intentional split asset.",
        "Current logo and approved wordmark treatment are used without distortion or effects.",
        "Trocchi 400 is used for lowercase display copy and Archivo Narrow for support copy.",
        "Baby-blue copy fields and logo-red type lead. White, cream, and ink support only. No text cards, stickers, glow, black panels, or copy over photography.",
        "Food, cake, location, staff, packaging, and event imagery is real and rights-cleared.",
        "CTA matches the business goal and destination.",
        "URL resolves on mobile and the correct UTM is present.",
        "Copy has no typo, em dash, unresolved placeholder, or accidental extra exclamation mark.",
        "No unsupported menu item, price, hour, deadline, stock, capacity, delivery, dietary, or customization claim.",
        "No fake review, rewritten quote, anonymous proof, or private customer information.",
        "Seasonal and deadline assets have owner approval and an internal expiry date.",
        "Location is accurate and uses the correct slug and order route.",
        "9:16 text and CTA sit inside the safe zone; 4:5, 3:4, square, and cover crops are checked.",
        "Paid creative is not text-crowded and has a clean version without organic stickers.",
        "Captions are burned in for motion and remain legible without audio.",
        "Music, voice, talent, creator, venue, guest, and customer rights cover the intended organic and paid use.",
        "Alt text or an accessibility description is prepared for the post.",
        "File name includes brand, campaign, concept, audience or location, channel, ratio, date, version, and status.",
        "Manifest entry points to the correct source, export, destination, owner, and approval state.",
        "Brand owner, operations owner, and paid owner have approved where required.",
    ]
    return "# social asset QA checklist\n\n" + "\n".join(f"- [ ] {item}" for item in checks)


def build_next_tasks() -> str:
    tasks = [
        (1, "Confirm Patticake delivery URL, available destinations, and current date-selection behavior.", "Operations + web", "P0"),
        (2, "Confirm local cake pickup flow, lead owner, and expected response language.", "Bakery operations", "P0"),
        (3, "Confirm catering notice language, pickup scope, lead owner, and qualified-lead fields.", "Catering operations", "P0"),
        (4, "Approve the link-in-bio order and final social profile copy.", "Brand owner", "P0"),
        (5, "Pick the first six existing motion masters for organic launch and assign destinations.", "Creative + social", "P0"),
        (6, "Capture P0 Patticake footage: full cake, message, pack, first slice, pickup, and unboxing.", "Photo/video", "P0"),
        (7, "Capture P0 yum! footage at all four locations: exterior, pickup, food, bakery case, and one staff voice.", "Photo/video + locations", "P0"),
        (8, "Capture P0 catering footage: boxes, trays, labels, bakery add-on, pickup, and room setup.", "Photo/video + catering", "P0"),
        (9, "Build the 20 editable layouts in the chosen tool with locked brand layers and safe zones.", "Design", "P0"),
        (10, "Load the 30 scripts into the Remotion content data model and create editable prop sets.", "Motion", "P1"),
        (11, "Replace fallback motion fonts with approved Trocchi and Archivo Narrow delivery for final renders.", "Motion + brand", "P1"),
        (12, "Produce the first three campaign families: local lunch, catering, and birthday Patticake.", "Creative", "P0"),
        (13, "Create 4:5, 9:16, 3:4, square, cover, and Pinterest crops for each approved campaign master.", "Design + motion", "P0"),
        (14, "Implement UTM templates and verify analytics capture for order, catering, cake, gifting, and gift-card routes.", "Web + analytics", "P0"),
        (15, "Create retargeting audiences and suppress recent converters after consent and analytics review.", "Paid media", "P1"),
        (16, "Run a two-week organic hook test using three yum! and three Patticake concepts.", "Social", "P1"),
        (17, "Launch one controlled paid test per objective with placement-native creative and no unapproved discount.", "Paid media", "P1"),
        (18, "Recruit three Twin Cities creators using the brief and signed rights language.", "Creator lead", "P1"),
        (19, "Publish one GBP post per location and verify the action buttons and location destinations.", "Local marketing", "P1"),
        (20, "Review results weekly and record winning hook, proof, CTA, audience, placement, and landing page in the creative log.", "Social + paid + analytics", "P1"),
    ]
    return "# immediate next 20 production tasks\n\n" + table(["#", "Task", "Owner", "Priority"], tasks)


def build_confirmations() -> str:
    rows = [
        ("Patticake national order route", "The code defaults to `/patticake#national-order` unless `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL` is set.", "Web and bakery operations must confirm the production URL and live behavior.", "P0"),
        ("Shipping coverage and dates", "Owner-approved launch truth is that Patticake is available nationwide; exact dates and address eligibility remain checkout-dependent.", "Confirm blackout dates, cutoff logic, and customer-service owner before campaigns.", "P0"),
        ("Local cake pickup", "The site routes pickup and cake questions through `/order-a-cake`.", "Confirm which locations, lead routing, response time, and whether every campaign should say request or order.", "P0"),
        ("Catering notice", "The current site says 24 hours for most pickup catering orders.", "Operations should confirm this for paid and evergreen social use and define exceptions.", "P0"),
        ("Corporate gifting", "The toolkit uses inquiry language only.", "Confirm minimums, address handling, delivery scope, timing, owner, and supported package before lead generation.", "P0"),
        ("Weddings and events", "The toolkit routes to an inquiry without promising customization.", "Confirm service scope, lead owner, geography, notice, tasting or consultation behavior, and image rights.", "P0"),
        ("Seasonal items and deadlines", "All seasonal copy uses approval placeholders.", "Set product, locations, start, end, deadline, publish-by, and asset expiry for each campaign.", "P0"),
        ("Reviews", "No unverified review is used in the toolkit.", "Provide official review links, exact quote, source, date, permission standard, and response owner.", "P1"),
        ("Creator rights", "Usage-rights language remains a legal placeholder.", "Approve contract language for organic use, paid use, whitelisting, term, territory, editing, music, and exclusivity.", "P0"),
        ("Analytics", "UTM format is defined, but downstream events are not confirmed here.", "Verify order purchase, gift-card sale, cake request, catering inquiry, and Patticake purchase events before paid launch.", "P0"),
        ("Link in bio", "The recommended hierarchy is provided.", "Confirm whether one account or separate yum!/Patticake accounts will use it and which tool owns the page.", "P1"),
        ("GBP access", "Forty location-specific drafts are ready.", "Confirm profile ownership, posting owner, current buttons, and any location-specific restrictions.", "P1"),
    ]
    return "# business details requiring confirmation\n\nThese items are intentionally not guessed. Resolve them before the affected content moves from draft to approved.\n\n" + table(["Detail", "Current evidence", "Confirmation needed", "Priority"], rows)


PLATFORM_SOURCES = [
    {
        "platform": "Instagram photos",
        "url": "https://www.facebook.com/help/1631821640426723/",
        "used_for": "1080 px width and supported photo ratios through 3:4",
        "verified_at": "2026-07-09",
    },
    {
        "platform": "Instagram Reels",
        "url": "https://www.facebook.com/help/1038071743007909",
        "used_for": "supported Reel ratios, minimum 720 px, and 30 fps",
        "verified_at": "2026-07-09",
    },
    {
        "platform": "Meta Reels ads",
        "url": "https://www.facebook.com/business/ads/facebook-instagram-reels-ads",
        "used_for": "9:16, audio, safe-zone, and placement-native creative guidance",
        "verified_at": "2026-07-09",
    },
    {
        "platform": "TikTok ad format policy",
        "url": "https://ads.tiktok.com/help/article/tiktok-ads-policy-ad-format-and-functionality?lang=en",
        "used_for": "dynamic video, audio, legibility, 5-60 seconds, and supported aspect ratios",
        "verified_at": "2026-07-09",
    },
    {
        "platform": "TikTok in-feed specifications",
        "url": "https://ads.tiktok.com/help/article/tiktok-reservation-in-feed-ads-reach-frequency",
        "used_for": "9:16 recommended and 9-15 second creative recommendation",
        "verified_at": "2026-07-09",
    },
    {
        "platform": "YouTube Shorts",
        "url": "https://support.google.com/youtube/answer/15424877?hl=en",
        "used_for": "square or vertical uploads up to three minutes classified as Shorts",
        "verified_at": "2026-07-09",
    },
    {
        "platform": "Pinterest Pin specs",
        "url": "https://help.pinterest.com/en-gb/article/review-pin-specs",
        "used_for": "Pin formats, text limits, video dimensions, and safe zones",
        "verified_at": "2026-07-09",
    },
    {
        "platform": "Pinterest distribution",
        "url": "https://help.pinterest.com/en-gb/business/article/pin-performance-and-distribution",
        "used_for": "2:3 recommendation and original weekly publishing guidance",
        "verified_at": "2026-07-09",
    },
    {
        "platform": "Google Business Profile posts",
        "url": "https://support.google.com/business/answer/7342169?hl=en",
        "used_for": "post types, buttons, recurring posts, and six-month archive behavior",
        "verified_at": "2026-07-09",
    },
    {
        "platform": "Google Business Profile media",
        "url": "https://support.google.com/business/answer/6103862?hl=en-GB",
        "used_for": "720x720 photo recommendation and 30-second video limit",
        "verified_at": "2026-07-09",
    },
]


def build_asset_catalog() -> str:
    static_assets = sorted((POST_PACK / "exports").glob("*.png"))
    legacy_motion = sorted((POST_PACK / "motion").glob("*.mp4"))
    motion_masters = sorted((MOTION_PACK / "exports" / "video").glob("*.mp4"))
    motion_variants = sorted((MOTION_PACK / "exports").glob("*/*.png"))
    active_static = [
        path
        for folder in ["story-9x16", "feed-4x5", "square-1x1", "wide-16x9", "link-1.91x1", "pin-2x3"]
        for path in sorted((ACTIVE_PACK / "exports" / folder).glob("*.png"))
    ]
    active_motion = sorted((ACTIVE_PACK / "exports").glob("motion-*/*.mp4"))
    active_carousel_motion = sorted((ACTIVE_PACK / "exports").glob("carousel-motion-*/*.mp4"))
    active_brand_motion = sorted((ACTIVE_PACK / "exports" / "brand-motion").glob("*"))
    active_carousels = sorted((ACTIVE_PACK / "exports" / "carousel-4x5").glob("*/*.png"))
    return f"""# asset catalog

## current reviewable assets

| Family | Count | Source |
| --- | ---: | --- |
| Active placement stills | {len(active_static)} | `../yum-patticake-creative-launch-2026-07-14/exports/{{story-9x16,feed-4x5,square-1x1,wide-16x9,link-1.91x1,pin-2x3}}/` |
| Active motion masters | {len(active_motion)} | `../yum-patticake-creative-launch-2026-07-14/exports/motion-*/` |
| Active carousel motion cuts | {len(active_carousel_motion)} | `../yum-patticake-creative-launch-2026-07-14/exports/carousel-motion-*/` |
| Active brand motion deliverables | {len(active_brand_motion)} | `../yum-patticake-creative-launch-2026-07-14/exports/brand-motion/` |
| Active carousel cards | {len(active_carousels)} | `../yum-patticake-creative-launch-2026-07-14/exports/carousel-4x5/` |

Review current work on the site `/asset-gallery`. The local board in this July 9 toolkit is preserved as a historical visual reference only.

## editable sources

- Current Remotion source: `../yum-patticake-creative-launch-2026-07-14/src/`
- Current render pipeline: `../yum-patticake-creative-launch-2026-07-14/scripts/`

## historical source inventory

| Family | Count | Source |
| --- | ---: | --- |
| July 9 static exports | {len(static_assets)} | `../yum-patticake-social-motion-pack/exports/` |
| July 9 motion exports | {len(legacy_motion)} | `../yum-patticake-social-motion-pack/motion/` |
| Earlier vertical masters | {len(motion_masters)} | `../yum-social-motion-template-2026/exports/video/` |
| Earlier crop variants | {len(motion_variants)} | `../yum-social-motion-template-2026/exports/` |

## visual constraints carried forward

- Real yum! and Patticake photography only.
- Baby blue and logo red lead every creative. White, cream, and ink are supporting colors only. No floating cards, black panels, glow, or pink-tinted copy surfaces.
- Current yum! circle mark and lowercase Trocchi-style brand voice.
- Captions and CTA kept inside vertical safe zones.
- No prices, fake reviews, or unsupported operational claims.
"""


def build_review_assets() -> Path:
    REVIEW_ASSETS.mkdir(parents=True, exist_ok=True)
    review: list[dict[str, Any]] = []
    index = 1

    for source in sorted((POST_PACK / "exports").glob("*.png")):
        target = REVIEW_ASSETS / f"static-{source.name}"
        shutil.copy2(source, target)
        review.append(
            {
                "id": f"static-{source.stem}",
                "index": index,
                "title": source.stem.replace("-", " "),
                "label": source.stem,
                "src": str(target.relative_to(OUT)),
                "href": f"../{source.relative_to(OUT.parent)}",
                "caption": "static social export",
                "family": "static",
                "bestFor": "Instagram, Facebook, Pinterest, GBP, paid crops",
            }
        )
        index += 1

    for source in sorted((POST_PACK / "posters").glob("*.png")):
        motion_id = source.stem.removesuffix("-poster")
        target = REVIEW_ASSETS / f"post-motion-{source.name}"
        shutil.copy2(source, target)
        review.append(
            {
                "id": f"post-motion-{motion_id}",
                "index": index,
                "title": motion_id.replace("-", " "),
                "label": motion_id,
                "src": str(target.relative_to(OUT)),
                "href": f"../yum-patticake-social-motion-pack/motion/{motion_id}.mp4",
                "caption": "post-worthy motion master",
                "family": "motion",
                "bestFor": "Reels, TikTok, Shorts, Stories",
            }
        )
        index += 1

    for source in sorted((MOTION_PACK / "exports" / "posters-4x5").glob("*.png")):
        motion_id = source.stem.removesuffix("-4x5")
        target = REVIEW_ASSETS / f"motion-2026-{source.name}"
        shutil.copy2(source, target)
        review.append(
            {
                "id": f"motion-2026-{motion_id}",
                "index": index,
                "title": motion_id.replace("-", " "),
                "label": motion_id,
                "src": str(target.relative_to(OUT)),
                "href": f"../yum-social-motion-template-2026/exports/video/{motion_id}.mp4",
                "caption": "2026 vertical motion master with feed poster",
                "family": "motion-2026",
                "bestFor": "Reels, TikTok, Shorts, Stories, 4:5 feed",
            }
        )
        index += 1

    review_path = write_json("data/review-manifest.json", review)
    write_json(
        "data/review-options.json",
        {
            "title": "yum! and Patticake social toolkit 2026",
            "summary": "Static social exports and motion poster frames built from real Yum and Patticake photography.",
            "preset": "image-wall",
            "showCaptions": True,
            "contactSheetOutput": "contact-sheet.png",
        },
    )
    renderer = resolve_review_renderer()
    if renderer:
        subprocess.run(
            [
                "python3",
                str(renderer),
                "--out-dir",
                str(OUT),
                "--manifest",
                str(review_path),
                "--review-options",
                str(DATA / "review-options.json"),
                "--contact-sheet",
            ],
            check=True,
        )
    else:
        cards = "".join(
            f'<a class="card" href="{html.escape(item["href"])}"><img src="{html.escape(item["src"])}" alt="{html.escape(item["title"])}"><strong>{html.escape(item["title"])}</strong><span>{html.escape(item["family"])}</span></a>'
            for item in review
        )
        (OUT / "review-board.html").write_text(
            "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>yum! and Patticake toolkit review</title><style>body{margin:0;background:#cae4fd;color:#8f1c24;font-family:Arial,sans-serif}header{padding:32px 4vw;border-bottom:8px solid #dc3439}h1{font-family:Georgia,serif;font-weight:400}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px;padding:24px 4vw}.card{display:grid;gap:8px;color:inherit;text-decoration:none}.card img{width:100%;aspect-ratio:4/5;object-fit:cover}.card strong{font-family:Georgia,serif;font-size:20px;font-weight:400}.card span{font-size:14px;font-weight:700;text-transform:uppercase}</style></head><body><header><h1>yum! and Patticake toolkit review</h1><p>Historical July 9 visual references. Review current work at /asset-gallery.</p></header><main class=\"grid\">" + cards + "</main></body></html>\n",
            encoding="utf-8",
        )
        subprocess.run(
            [
                "ffmpeg", "-y", "-pattern_type", "glob", "-i", str(REVIEW_ASSETS / "*.png"),
                "-vf", "scale=320:320:force_original_aspect_ratio=decrease,pad=320:320:(ow-iw)/2:(oh-ih)/2:color=cae4fd,tile=6x6",
                "-frames:v", "1", str(OUT / "contact-sheet.png"),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    return review_path


def required_counts() -> dict[str, int]:
    return {
        "contentPillars": len(PILLARS),
        "assetTemplates": len(TEMPLATES),
        "channels": len(CHANNELS),
        "calendarDays": len(CALENDAR),
        "captions": len(caption_rows()),
        "hooks": len(hook_rows()),
        "videoScripts": len(VIDEO_SCRIPTS),
        "paidCampaigns": len(PAID_CAMPAIGNS),
        "creatorBriefs": len(CREATOR_BRIEFS),
        "storySequences": len(STORY_SEQUENCES),
        "pinterestConcepts": len(PINS),
        "gbpPosts": len(gbp_rows()),
        "productionShots": len(shot_rows()),
    }


def validate_source_data() -> None:
    counts = required_counts()
    minimums = {
        "contentPillars": 10,
        "assetTemplates": 20,
        "channels": 10,
        "calendarDays": 30,
        "captions": 80,
        "hooks": 100,
        "videoScripts": 30,
        "paidCampaigns": 8,
        "creatorBriefs": 5,
        "storySequences": 15,
        "pinterestConcepts": 20,
        "gbpPosts": 40,
    }
    for key, minimum in minimums.items():
        if counts[key] < minimum:
            raise ValueError(f"{key} requires {minimum}, found {counts[key]}")

    calendar_pillars = [item[3] for item in CALENDAR]
    checks = {
        "catering posts": sum("catering" in value for value in calendar_pillars),
        "Patticake gifting posts": sum(item[1] == "Patticake" and "gifting" in item[3] for item in CALENDAR),
        "location posts": sum("four neighborhoods" in value for value in calendar_pillars),
        "bakery posts": sum("bakery case" in value for value in calendar_pillars),
        "staff posts": sum("staff favorites" in value for value in calendar_pillars),
        "paid-ready posts": sum(item[10] == "yes" for item in CALENDAR),
    }
    required_calendar = {
        "catering posts": 5,
        "Patticake gifting posts": 5,
        "location posts": 4,
        "bakery posts": 4,
        "staff posts": 3,
        "paid-ready posts": 3,
    }
    for key, minimum in required_calendar.items():
        if checks[key] < minimum:
            raise ValueError(f"calendar {key} requires {minimum}, found {checks[key]}")


def build_readme() -> str:
    counts = required_counts()
    return f"""# yum! and Patticake complete social toolkit

> Status: strategy and copy reference only. The July 9 visual examples and review board are superseded by `../yum-patticake-creative-launch-2026-07-14/` and the site `/asset-gallery`. Do not publish the older white-card assets or use them as current art direction.

Built {TODAY.isoformat()} for practical organic, paid, creator, location, catering, gifting, and motion production.

## executive summary

- yum! is the everyday Twin Cities food habit. Social should move people to a current menu, a nearby kitchen, pickup, catering, bakery, or gift cards.
- Patticake is the occasion brand. Social should make birthdays, thank-yous, client gifts, local pickup, nationwide shipping, and events feel specific and actionable.
- The system uses real food, real cake, real hands, real staff, real locations, and real operational steps.
- Baby blue and logo red lead motion and type. White, cream, and ink stay supporting. Floating cards, black panels, glow, and pink-tinted copy backgrounds are excluded.

## toolkit counts

| Deliverable | Count |
| --- | ---: |
| Content pillars | {counts['contentPillars']} |
| Reusable asset templates | {counts['assetTemplates']} |
| Channel spec rows | {counts['channels']} |
| Launch calendar days | {counts['calendarDays']} |
| Captions | {counts['captions']} |
| Short-form hooks | {counts['hooks']} |
| Short-form video scripts | {counts['videoScripts']} |
| Paid campaign systems | {counts['paidCampaigns']} |
| Creator briefs | {counts['creatorBriefs']} |
| Story sequences | {counts['storySequences']} |
| Pinterest concepts | {counts['pinterestConcepts']} |
| GBP posts | {counts['gbpPosts']} |
| Production shots | {counts['productionShots']} |

## start here

1. Read `SOCIAL_TOOLKIT_MASTER.md` for the complete system in one file.
2. Open the checked-in `/asset-gallery` route to review current assets.
3. Use `calendar/30-day-content-calendar.csv`, `copy/caption-bank.csv`, and `copy/hook-bank.csv` for production planning.
4. Use `motion/short-form-video-scripts.md` with the editable Remotion source in `../yum-patticake-creative-launch-2026-07-14/`.
5. Resolve every P0 item in `production/operational-confirmations.md` before paid launch.
6. Run every asset through `production/qa-checklist.md` before moving it to approved.

## section index

1. Executive summary: this README
2. Social strategy overview: `strategy/social-strategy-overview.md`
3. Content pillars: `strategy/content-pillars.md`
4. Visual identity toolkit: `strategy/visual-identity-toolkit.md`
5. Asset template system: `templates/asset-template-system.md`
6. Channel specs: `specs/channel-specific-specs.md`
7. 30-day content calendar: `calendar/30-day-content-calendar.md`
8. Caption bank: `copy/caption-bank.md`
9. Hook bank: `copy/hook-bank.md`
10. Short-form video script pack: `motion/short-form-video-scripts.md`
11. Paid social ad kit: `paid/paid-social-ad-kit.md`
12. Creator and UGC toolkit: `creators/creator-ugc-toolkit.md`
13. Story toolkit: `stories/story-toolkit.md`
14. Pinterest toolkit: `pinterest/pinterest-toolkit.md`
15. GBP post kit: `gbp/google-business-profile-post-kit.md`
16. Social bio and profile toolkit: `profile/social-bio-profile-toolkit.md`
17. Comment and DM response bank: `community/comment-dm-response-bank.md`
18. Hashtag and keyword system: `search/hashtag-keyword-system.md`
19. Asset production shot list: `production/asset-production-shot-list.md`
20. File organization: `production/file-organization-system.md`
21. Editable template brief: `templates/editable-template-brief.md`
22. QA checklist: `production/qa-checklist.md`
23. Immediate next 20 tasks: `production/immediate-next-20-tasks.md`

## source asset packs

- `../yum-patticake-creative-launch-2026-07-14/`: current production stills, carousels, motion masters, Patticake logo motion, and publishing guidance.
- `../yum-patticake-social-motion-pack/` and `../yum-social-motion-template-2026/`: historical references only. Preserve for provenance, not publishing.
"""


def write_toolkit_files() -> list[Path]:
    written = [
        write_text("README.md", build_readme()),
        write_text("strategy/social-strategy-overview.md", build_strategy_overview()),
        write_text("strategy/content-pillars.md", build_content_pillars()),
        write_text("strategy/visual-identity-toolkit.md", build_visual_identity()),
        write_text("templates/asset-template-system.md", build_asset_templates()),
        write_text("specs/channel-specific-specs.md", build_channel_specs()),
        write_text("calendar/30-day-content-calendar.md", build_calendar()),
        write_text("copy/caption-bank.md", build_captions()),
        write_text("copy/hook-bank.md", build_hooks()),
        write_text("motion/short-form-video-scripts.md", build_video_scripts()),
        write_text("paid/paid-social-ad-kit.md", build_paid_kit()),
        write_text("creators/creator-ugc-toolkit.md", build_creator_kit()),
        write_text("stories/story-toolkit.md", build_story_kit()),
        write_text("pinterest/pinterest-toolkit.md", build_pinterest_kit()),
        write_text("gbp/google-business-profile-post-kit.md", build_gbp_kit()),
        write_text("profile/social-bio-profile-toolkit.md", build_profile_kit()),
        write_text("community/comment-dm-response-bank.md", build_dm_bank()),
        write_text("search/hashtag-keyword-system.md", build_hashtag_system()),
        write_text("production/asset-production-shot-list.md", build_shot_list()),
        write_text("production/file-organization-system.md", build_file_organization()),
        write_text("templates/editable-template-brief.md", build_editable_template_brief()),
        write_text("production/qa-checklist.md", build_qa_checklist()),
        write_text("production/immediate-next-20-tasks.md", build_next_tasks()),
        write_text("production/operational-confirmations.md", build_confirmations()),
        write_text("production/asset-catalog.md", build_asset_catalog()),
    ]

    write_csv(
        "calendar/30-day-content-calendar.csv",
        ["day", "brand", "channel", "content_pillar", "post_concept", "asset_type", "hook_headline", "caption_direction", "cta", "landing_page", "paid_boost", "designer_editor_notes"],
        calendar_rows(),
    )
    write_csv(
        "copy/caption-bank.csv",
        ["id", "category", "caption", "cta", "best_channel", "funnel_stage", "suggested_visual"],
        caption_rows(),
    )
    write_csv("copy/hook-bank.csv", ["id", "category", "hook", "uses"], hook_rows())
    write_csv(
        "pinterest/pinterest-toolkit.csv",
        ["id", "concept", "pin_title", "pin_description", "board", "search_keywords", "visual_direction", "destination", "funnel"],
        pinterest_rows(),
    )
    write_csv(
        "gbp/google-business-profile-post-kit.csv",
        ["id", "post_type", "headline", "body", "cta", "recommended_image", "location_relevance", "destination"],
        gbp_rows(),
    )
    write_csv(
        "production/asset-production-shot-list.csv",
        ["id", "category", "description", "orientation", "use_case", "priority", "notes", "props", "channels"],
        shot_rows(),
    )

    write_json("data/destinations.json", DESTINATIONS)
    write_json("data/platform-sources.json", PLATFORM_SOURCES)
    write_json("data/content-pillars.json", PILLARS)
    write_json("data/video-scripts.json", VIDEO_SCRIPTS)
    write_json("data/paid-campaigns.json", PAID_CAMPAIGNS)
    write_json("data/creator-briefs.json", CREATOR_BRIEFS)
    write_json("data/toolkit-counts.json", required_counts())
    return written


def build_master() -> Path:
    section_files = [
        "README.md",
        "strategy/social-strategy-overview.md",
        "strategy/content-pillars.md",
        "strategy/visual-identity-toolkit.md",
        "templates/asset-template-system.md",
        "specs/channel-specific-specs.md",
        "calendar/30-day-content-calendar.md",
        "copy/caption-bank.md",
        "copy/hook-bank.md",
        "motion/short-form-video-scripts.md",
        "paid/paid-social-ad-kit.md",
        "creators/creator-ugc-toolkit.md",
        "stories/story-toolkit.md",
        "pinterest/pinterest-toolkit.md",
        "gbp/google-business-profile-post-kit.md",
        "profile/social-bio-profile-toolkit.md",
        "community/comment-dm-response-bank.md",
        "search/hashtag-keyword-system.md",
        "production/asset-production-shot-list.md",
        "production/file-organization-system.md",
        "templates/editable-template-brief.md",
        "production/qa-checklist.md",
        "production/immediate-next-20-tasks.md",
        "production/operational-confirmations.md",
    ]
    chunks = ["# yum! and Patticake complete social media toolkit", ""]
    for rel in section_files:
        chunks.append((OUT / rel).read_text(encoding="utf-8").rstrip())
        chunks.append("")
    return write_text("SOCIAL_TOOLKIT_MASTER.md", "\n".join(chunks))


def validate_generated_files() -> None:
    text_files = list(OUT.rglob("*.md")) + list(OUT.rglob("*.csv")) + list(OUT.rglob("*.json"))
    for path in text_files:
        content = path.read_text(encoding="utf-8")
        if "\u2014" in content:
            raise ValueError(f"em dash found in {path}")

    if not (OUT / "review-board.html").exists():
        raise FileNotFoundError(OUT / "review-board.html")
    if not (OUT / "contact-sheet.png").exists():
        raise FileNotFoundError(OUT / "contact-sheet.png")


def write_manifest() -> Path:
    files = sorted(str(path.relative_to(OUT)) for path in OUT.rglob("*") if path.is_file())
    payload = {
        "name": "yum! and Patticake complete social media toolkit",
        "created": datetime.now(timezone.utc).isoformat(),
        "sourceRepo": str(ROOT),
        "output": str(OUT),
        "counts": required_counts(),
        "destinations": DESTINATIONS,
        "sourceAssetPacks": {
            "current": "../yum-patticake-creative-launch-2026-07-14",
            "historical": ["../yum-patticake-social-motion-pack", "../yum-social-motion-template-2026"],
        },
        "primaryArtifacts": {
            "master": "SOCIAL_TOOLKIT_MASTER.md",
            "review": "/asset-gallery",
            "historicalReview": "review-board.html",
            "historicalContactSheet": "contact-sheet.png",
            "calendar": "calendar/30-day-content-calendar.csv",
            "captions": "copy/caption-bank.csv",
            "hooks": "copy/hook-bank.csv",
            "videoScripts": "motion/short-form-video-scripts.md",
            "qa": "production/qa-checklist.md",
        },
        "constraints": [
            "real food, cake, people, locations, and operational moments",
            "baby blue and logo red lead every creative; white, cream, and ink support only",
            "no black text panels",
            "no pink-tinted copy backgrounds",
            "no unsupported claims or fake reviews",
            "one business goal and one matched CTA per asset",
        ],
        "files": files,
    }
    return write_json("manifest.json", payload)


def main() -> None:
    validate_source_data()
    with tempfile.TemporaryDirectory(prefix="yum-social-toolkit-") as temporary:
        preserved_root = Path(temporary)
        for relative_path in HISTORICAL_REVIEW_STATE:
            source = OUT / relative_path
            target = preserved_root / relative_path
            if source.is_dir():
                shutil.copytree(source, target)
            elif source.is_file():
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, target)

        preserved_review = (preserved_root / "review-board.html").is_file()

        if OUT.exists():
            shutil.rmtree(OUT)
        OUT.mkdir(parents=True, exist_ok=True)
        DATA.mkdir(parents=True, exist_ok=True)
        write_toolkit_files()
        build_master()
        if not preserved_review:
            build_review_assets()

        for relative_path in HISTORICAL_REVIEW_STATE:
            source = preserved_root / relative_path
            target = OUT / relative_path
            if source.is_dir():
                if target.exists():
                    shutil.rmtree(target)
                shutil.copytree(source, target)
            elif source.is_file():
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, target)

        validate_generated_files()
        manifest = write_manifest()
    print(json.dumps({"output": str(OUT), "manifest": str(manifest), "counts": required_counts()}, indent=2))


if __name__ == "__main__":
    main()
