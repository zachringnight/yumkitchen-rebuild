#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
import math
import os
import shutil
import subprocess
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[2]
PUBLIC_IMAGES = ROOT / "yumkitchen-web" / "public" / "images"
LOGO = ROOT / "yumkitchen-web" / "public" / "logo.png"
OUT = ROOT / "social" / "yum-patticake-social-motion-pack"
EXPORTS = OUT / "exports"
MOTION = OUT / "motion"
POSTERS = OUT / "posters"
DATA = OUT / "data"
REMOTION = OUT / "remotion"
REVIEW_RENDERER = (
    Path.home()
    / ".codex"
    / "plugins"
    / "cache"
    / "openai-curated-remote"
    / "creative-production"
    / "0.1.24"
    / "scripts"
    / "review_renderer.py"
)

BRAND = {
    "red": "#E03A3E",
    "red_deep": "#B4212B",
    "ink": "#2D2D2D",
    "body": "#5F5A5A",
    "page": "#F3F3F3",
    "white": "#FFFFFF",
    "blue": "#CAE4FD",
    "soft_blue": "#AED2EF",
    "cream": "#FFF8F2",
}

SERIF_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Georgia.ttf",
    "/System/Library/Fonts/Georgia.ttf",
    "/Library/Fonts/Georgia.ttf",
]
SANS_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Narrow.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
]


def font_path(candidates: list[str]) -> str | None:
    for candidate in candidates:
        if Path(candidate).exists():
            return candidate
    return None


SERIF = font_path(SERIF_CANDIDATES)
SANS = font_path(SANS_CANDIDATES)


def font(size: int, family: str = "sans") -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    path = SERIF if family == "serif" else SANS
    if path:
        return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def load_image(rel: str) -> Image.Image:
    return Image.open(PUBLIC_IMAGES / rel).convert("RGB")


def cover_image(
    rel: str,
    size: tuple[int, int],
    *,
    anchor: tuple[float, float] = (0.5, 0.5),
    zoom: float = 1.0,
    pan: tuple[float, float] = (0.0, 0.0),
) -> Image.Image:
    source = ImageOps.exif_transpose(load_image(rel))
    target_w, target_h = size
    scale = max(target_w / source.width, target_h / source.height) * zoom
    resized = source.resize(
        (math.ceil(source.width * scale), math.ceil(source.height * scale)),
        Image.Resampling.LANCZOS,
    )
    max_x = max(0, resized.width - target_w)
    max_y = max(0, resized.height - target_h)
    cx = anchor[0] * resized.width + pan[0] * target_w
    cy = anchor[1] * resized.height + pan[1] * target_h
    left = int(min(max(0, cx - target_w / 2), max_x))
    top = int(min(max(0, cy - target_h / 2), max_y))
    return resized.crop((left, top, left + target_w, top + target_h))


def text_size(draw: ImageDraw.ImageDraw, value: str, fnt: ImageFont.ImageFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), value, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def wrap_lines(
    draw: ImageDraw.ImageDraw,
    value: str,
    fnt: ImageFont.ImageFont,
    max_width: int,
    *,
    max_lines: int | None = None,
) -> list[str]:
    words = value.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if text_size(draw, candidate, fnt)[0] <= max_width:
            current = candidate
            continue
        if current:
            lines.append(current)
        current = word
    if current:
        lines.append(current)
    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        while lines and text_size(draw, lines[-1] + "...", fnt)[0] > max_width:
            lines[-1] = lines[-1].rsplit(" ", 1)[0] if " " in lines[-1] else lines[-1][:-1]
        if lines:
            lines[-1] += "..."
    return lines


def fitted_font(
    draw: ImageDraw.ImageDraw,
    value: str,
    family: str,
    start: int,
    min_size: int,
    max_width: int,
    max_lines: int,
) -> tuple[ImageFont.ImageFont, list[str], int]:
    for size in range(start, min_size - 1, -2):
        fnt = font(size, family)
        lines = wrap_lines(draw, value, fnt, max_width, max_lines=max_lines)
        if len(lines) <= max_lines and all(text_size(draw, line, fnt)[0] <= max_width for line in lines):
            return fnt, lines, size
    fnt = font(min_size, family)
    return fnt, wrap_lines(draw, value, fnt, max_width, max_lines=max_lines), min_size


def draw_wrapped(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    lines: Iterable[str],
    fnt: ImageFont.ImageFont,
    fill: str,
    *,
    leading: float = 1.12,
) -> int:
    x, y = xy
    line_h = int(fnt.size * leading) if hasattr(fnt, "size") else 24
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += line_h
    return y


def shadow_layer(size: tuple[int, int], panel: tuple[int, int, int, int]) -> Image.Image:
    x, y, w, h = panel
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rectangle((x, y, x + w, y + h), fill=(0, 0, 0, 54))
    return layer.filter(ImageFilter.GaussianBlur(18))


def paste_logo(canvas: Image.Image, xy: tuple[int, int], size: int) -> None:
    logo = Image.open(LOGO).convert("RGBA")
    logo = logo.resize((size, size), Image.Resampling.LANCZOS)
    canvas.alpha_composite(logo, xy)


def draw_panel_card(
    *,
    size: tuple[int, int],
    image: str,
    output: Path,
    title: str,
    deck: str,
    cta: str,
    kicker: str,
    placement: str,
    brand: str,
    anchor: tuple[float, float] = (0.5, 0.5),
    layout: str = "bottom",
    chips: list[str] | None = None,
    accent: str = "red",
) -> None:
    w, h = size
    bg = cover_image(image, size, anchor=anchor)
    canvas = bg.convert("RGBA")
    overlay = Image.new("RGBA", size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    if layout == "dark-bottom":
        od.rectangle((0, int(h * 0.38), w, h), fill=(0, 0, 0, 86))
    elif layout == "blue-band":
        od.rectangle((0, 0, w, h), fill=hex_to_rgb(BRAND["blue"]) + (216,))
    else:
        od.rectangle((0, 0, w, h), fill=(0, 0, 0, 22))
    canvas.alpha_composite(overlay)

    if layout == "landscape":
        panel = (64, 78, int(w * 0.43), h - 156)
    elif layout == "top":
        panel = (58, 70, w - 116, int(h * 0.34))
    elif layout == "center":
        panel = (68, int(h * 0.28), w - 136, int(h * 0.38))
    elif layout == "story-top":
        panel = (56, 160, w - 112, 610)
    elif layout == "story-bottom":
        panel = (56, h - 760, w - 112, 520)
    elif layout == "dark-bottom":
        panel = (56, h - 560, w - 112, 432)
    else:
        bottom_h = 360
        if brand == "yum":
            bottom_h = 440 if h <= 1350 else 500
        panel = (56, h - bottom_h - 70, w - 112, bottom_h)

    canvas.alpha_composite(shadow_layer(size, panel))
    x, y, pw, ph = panel
    pd = ImageDraw.Draw(canvas)
    pd.rectangle((x, y, x + pw, y + ph), fill=BRAND["white"])
    red = BRAND["red"] if accent == "red" else BRAND["red_deep"]
    pd.rectangle((x, y, x + pw, y + 12), fill=red)

    copy_x = x + 48
    copy_w = pw - 96
    copy_y = y + 48
    if brand == "yum":
        paste_logo(canvas, (copy_x, copy_y), 72 if w < 1400 else 70)
        copy_y += 94 if w < 1400 else 90

    kicker_fill = BRAND["red"]
    title_fill = BRAND["ink"]
    body_fill = BRAND["body"]
    pd.text((copy_x, copy_y), kicker.upper(), font=font(21 if brand == "yum" else 24 if w < 1400 else 22, "sans"), fill=kicker_fill)
    copy_y += 36 if brand == "yum" else 42
    title_start = 76 if h <= 1350 else 84
    if brand == "yum" and h <= 1350:
        title_start = 58
    if layout == "landscape":
        title_start = 60
    title_font, title_lines, title_size = fitted_font(
        pd, title, "serif", title_start, 46, copy_w, 3 if h >= 1350 else 2
    )
    copy_y = draw_wrapped(pd, (copy_x, copy_y), title_lines, title_font, title_fill, leading=1.02)
    copy_y += 22
    deck_start = 30 if brand == "yum" and h <= 1350 else 36 if h <= 1350 else 40
    deck_font, deck_lines, _ = fitted_font(pd, deck, "sans", deck_start, 24, copy_w, 3)
    copy_y = draw_wrapped(pd, (copy_x, copy_y), deck_lines, deck_font, body_fill, leading=1.18)
    if chips:
        copy_y += 24
        chip_x = copy_x
        chip_y = copy_y
        chip_font = font(22, "sans")
        for chip in chips:
            tw, th = text_size(pd, chip, chip_font)
            if chip_x + tw + 34 > x + pw - 42:
                chip_x = copy_x
                chip_y += 48
            pd.rectangle((chip_x, chip_y, chip_x + tw + 30, chip_y + 36), outline=red, width=2)
            pd.text((chip_x + 15, chip_y + 7), chip, font=chip_font, fill=red)
            chip_x += tw + 44
        copy_y = chip_y + 44

    cta_y = min(y + ph - 78, copy_y + 28)
    cta_font = font(26 if w < 1400 else 22, "sans")
    cta_w, _ = text_size(pd, cta, cta_font)
    pd.rectangle((copy_x, cta_y, copy_x + cta_w + 42, cta_y + 54), fill=red)
    pd.text((copy_x + 21, cta_y + 14), cta, font=cta_font, fill=BRAND["white"])

    tag = "yumkitchen.com"
    if brand == "patticake":
        tag = "yumkitchen.com/patticake"
    tag_font = font(22 if w < 1400 else 19, "sans")
    tag_fill = BRAND["ink"]
    tw, _ = text_size(pd, tag, tag_font)
    pd.text((w - tw - 48, h - 54), tag, font=tag_font, fill=tag_fill)

    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(output, quality=96)


@dataclass(frozen=True)
class AssetSpec:
    id: str
    size: tuple[int, int]
    image: str
    title: str
    deck: str
    cta: str
    kicker: str
    placement: str
    topic: str
    brand: str
    layout: str = "bottom"
    anchor: tuple[float, float] = (0.5, 0.5)
    chips: tuple[str, ...] = ()
    alt: str = ""


STATIC_ASSETS = [
    AssetSpec(
        "patticake-ship-a-cake-square",
        (1080, 1080),
        "patticake/gift_box_vertical.jpg",
        "ship a cake",
        "Fresh cake, a personal note, and an easy way to share it.",
        "Order patticake",
        "patticake",
        "instagram_feed_square",
        "cake_shipping",
        "patticake",
        anchor=(0.5, 0.38),
    ),
    AssetSpec(
        "patticake-just-because-portrait",
        (1080, 1350),
        "patticake/layers_slice_vertical.jpg",
        "just because deserves cake",
        "Pick a date. Add a note. Send cake.",
        "Ship a cake",
        "patticake",
        "instagram_feed_portrait",
        "cake_gifting",
        "patticake",
        anchor=(0.5, 0.42),
    ),
    AssetSpec(
        "patticake-slice-story",
        (1080, 1920),
        "patticake/10_layers_slice.jpg",
        "cake, delivered with love",
        "Fresh bakery cake is now available nationwide.",
        "Send a patticake",
        "patticake",
        "instagram_story",
        "cake_options",
        "patticake",
        layout="story-bottom",
        anchor=(0.48, 0.45),
    ),
    AssetSpec(
        "patticake-gift-box-reel-cover",
        (1080, 1920),
        "patticake/gift_box_vertical.jpg",
        "send a cake worth remembering",
        "A real bakery cake with a note that feels personal.",
        "Order patticake",
        "patticake",
        "instagram_reel_cover",
        "cake_gifting",
        "patticake",
        layout="story-top",
        anchor=(0.5, 0.5),
    ),
    AssetSpec(
        "patticake-message-carousel-square",
        (1080, 1080),
        "patticake/03_top_view.jpg",
        "pick the message",
        "Birthday, thank you, just because, miss you, or your own note.",
        "Make it personal",
        "patticake",
        "instagram_carousel_square",
        "message_options",
        "patticake",
        layout="center",
        chips=("birthday", "thank you", "just because", "miss you"),
    ),
    AssetSpec(
        "patticake-og-share-card",
        (1200, 630),
        "patticake/09_slices.jpg",
        "patticake",
        "A real scratch bakery cake, shipped to your door.",
        "Send cake",
        "yum! Kitchen and Bakery",
        "open_graph",
        "brand_share",
        "patticake",
        layout="landscape",
        anchor=(0.47, 0.44),
    ),
    AssetSpec(
        "yum-made-from-scratch-square",
        (1080, 1080),
        "yum-hero-0131.jpg",
        "made from scratch with love",
        "Breakfast, lunch, dinner, bakery, and four neighborhood kitchens.",
        "Order online",
        "yum! Kitchen and Bakery",
        "instagram_feed_square",
        "brand",
        "yum",
        layout="bottom",
        anchor=(0.55, 0.48),
    ),
    AssetSpec(
        "yum-breakfast-portrait",
        (1080, 1350),
        "yum-breakfast.jpg",
        "start with breakfast",
        "Open daily 8am to 8pm at all four restaurants.",
        "Find a kitchen",
        "yum! Kitchen and Bakery",
        "instagram_feed_portrait",
        "breakfast",
        "yum",
        anchor=(0.5, 0.42),
    ),
    AssetSpec(
        "yum-catering-portrait",
        (1080, 1350),
        "yum-catering-boxed-lunch.jpg",
        "feed the room",
        "Boxed lunches, trays, bakery, and easy group ordering.",
        "Plan catering",
        "yum! catering",
        "instagram_feed_portrait",
        "catering",
        "yum",
        anchor=(0.5, 0.48),
    ),
    AssetSpec(
        "yum-soup-sandwich-square",
        (1080, 1080),
        "yum-soup-and-sandwich.jpg",
        "soup and sandwich season",
        "Come in, order ahead, or take it home.",
        "Order online",
        "yum! Kitchen and Bakery",
        "instagram_feed_square",
        "menu",
        "yum",
        layout="dark-bottom",
        anchor=(0.5, 0.48),
    ),
    AssetSpec(
        "yum-four-locations-story",
        (1080, 1920),
        "yum-location-slp.jpg",
        "four Twin Cities restaurants",
        "St. Louis Park. Shady Oak. St. Paul. Woodbury.",
        "Find us",
        "yum! locations",
        "instagram_story",
        "locations",
        "yum",
        layout="story-bottom",
        anchor=(0.5, 0.46),
    ),
    AssetSpec(
        "yum-bakery-case-square",
        (1080, 1080),
        "yum-bakery-counter-cake.jpg",
        "bakery case favorites",
        "Cookies, bars, cupcakes, pies, and cakes made fresh.",
        "Visit yum!",
        "yum! bakery",
        "instagram_feed_square",
        "bakery",
        "yum",
        anchor=(0.5, 0.48),
    ),
    AssetSpec(
        "yum-restaurant-behind-patticake-portrait",
        (1080, 1350),
        "yum-patti-kelli.jpeg",
        "the restaurant behind patticake",
        "Made by the yum! Kitchen and Bakery team.",
        "Meet yum!",
        "made by yum!",
        "instagram_feed_portrait",
        "brand_story",
        "yum",
        anchor=(0.5, 0.42),
    ),
    AssetSpec(
        "yum-catering-og-share-card",
        (1200, 630),
        "yum-catering-sandwiches-live.jpg",
        "catering made easy",
        "Fresh and friendly food for your next group order.",
        "Plan catering",
        "yum! catering",
        "open_graph",
        "catering",
        "yum",
        layout="landscape",
        anchor=(0.48, 0.5),
    ),
    AssetSpec(
        "yum-since-2005-square",
        (1080, 1080),
        "yum-chef-kitchen.jpg",
        "made from scratch since 2005",
        "Food, bakery, and hospitality from the Twin Cities.",
        "Visit yum!",
        "yum! Kitchen and Bakery",
        "instagram_feed_square",
        "brand_proof",
        "yum",
        anchor=(0.5, 0.43),
    ),
    AssetSpec(
        "patticake-wedding-portrait",
        (1080, 1350),
        "patticake/08_tier_wedding_d.jpg",
        "cake for the table",
        "Custom notes, easy gifts, and real bakery layers.",
        "Start a cake",
        "patticake",
        "instagram_feed_portrait",
        "wedding_cake",
        "patticake",
        anchor=(0.5, 0.46),
    ),
    AssetSpec(
        "patticake-thank-you-square",
        (1080, 1080),
        "patticake/slices_plates_vertical.jpg",
        "thank you needs cake",
        "A small note, a big slice, and something sweet to share.",
        "Send thanks",
        "patticake",
        "instagram_feed_square",
        "thank_you",
        "patticake",
        anchor=(0.5, 0.52),
    ),
    AssetSpec(
        "yum-order-story",
        (1080, 1920),
        "yum-shake-and-sandwich.jpg",
        "order online",
        "Pick your kitchen. Choose your favorites. Keep dinner easy.",
        "Order now",
        "yum! Kitchen and Bakery",
        "instagram_story",
        "order_online",
        "yum",
        layout="story-bottom",
        anchor=(0.52, 0.46),
    ),
]


MOTION_SPECS = [
    {
        "id": "patticake-send-cake-reel",
        "size": (1080, 1920),
        "images": ["patticake/gift_box_vertical.jpg", "patticake/10_layers_slice.jpg"],
        "title": "send a cake worth remembering",
        "deck": "Pick a date. Add a note. Share the love.",
        "cta": "Order patticake",
        "brand": "patticake",
        "topic": "cake_gifting",
    },
    {
        "id": "patticake-layers-reel",
        "size": (1080, 1920),
        "images": ["patticake/layers_slice_vertical.jpg", "patticake/09_slices.jpg", "patticake/03_top_view.jpg"],
        "title": "real bakery layers",
        "deck": "Chocolate cake, vanilla buttercream, and a message made for the table.",
        "cta": "Ship a cake",
        "brand": "patticake",
        "topic": "cake_layers",
    },
    {
        "id": "yum-made-scratch-reel",
        "size": (1080, 1920),
        "images": ["yum-hero-0131.jpg", "yum-breakfast.jpg", "yum-bakery-counter-cake.jpg"],
        "title": "made from scratch with love",
        "deck": "Breakfast, lunch, dinner, and bakery every day.",
        "cta": "Order online",
        "brand": "yum",
        "topic": "brand",
    },
    {
        "id": "yum-catering-reel",
        "size": (1080, 1920),
        "images": ["yum-catering-boxed-lunch.jpg", "yum-catering-tray.jpg", "yum-catering-sandwiches-live.jpg"],
        "title": "feed the room",
        "deck": "Catering for meetings, teams, celebrations, and everyday groups.",
        "cta": "Plan catering",
        "brand": "yum",
        "topic": "catering",
    },
    {
        "id": "yum-patticake-feed-motion",
        "size": (1080, 1080),
        "images": ["yum-bakery-counter-cake.jpg", "patticake/10_layers_slice.jpg", "patticake/gift_box_vertical.jpg"],
        "title": "bakery case to cake box",
        "deck": "Visit yum! or send patticake.",
        "cta": "Share the love",
        "brand": "yum",
        "topic": "bakery_patticake",
    },
    {
        "id": "yum-four-locations-motion",
        "size": (1080, 1920),
        "images": ["yum-location-slp.jpg", "yum-location-shady-oak.jpg", "yum-location-saint-paul.jpg", "yum-location-woodbury.jpg"],
        "title": "four Twin Cities kitchens",
        "deck": "St. Louis Park, Shady Oak, St. Paul, and Woodbury.",
        "cta": "Find us",
        "brand": "yum",
        "topic": "locations",
    },
    {
        "id": "yum-patticake-horizontal-motion",
        "size": (1920, 1080),
        "images": ["yum-hero-1698.jpg", "patticake/09_slices.jpg"],
        "title": "fresh food. real cake. one yum! family.",
        "deck": "Breakfast, lunch, dinner, bakery, catering, and patticake.",
        "cta": "Visit yum!",
        "brand": "yum",
        "topic": "brand_campaign",
    },
]


def ease_out(t: float) -> float:
    return 1 - pow(1 - max(0.0, min(1.0, t)), 3)


def blend_sequence(images: list[str], size: tuple[int, int], frame: int, total: int) -> Image.Image:
    if len(images) == 1:
        return cover_image(images[0], size, zoom=1.04, pan=(0, 0))
    progress = frame / max(1, total - 1)
    scaled = progress * len(images)
    idx = min(len(images) - 1, int(scaled))
    local = scaled - idx
    pan_x = math.sin(progress * math.pi * 2) * 0.035
    pan_y = math.cos(progress * math.pi * 1.3) * 0.025
    base = cover_image(images[idx], size, zoom=1.04 + 0.045 * progress, pan=(pan_x, pan_y))
    if local > 0.72 and idx < len(images) - 1:
        nxt = cover_image(images[idx + 1], size, zoom=1.02 + 0.035 * local, pan=(-pan_x, -pan_y))
        alpha = ease_out((local - 0.72) / 0.28)
        base = Image.blend(base, nxt, alpha)
    return base


def render_motion_frame(spec: dict[str, object], frame: int, total: int) -> Image.Image:
    size = spec["size"]
    assert isinstance(size, tuple)
    images = spec["images"]
    assert isinstance(images, list)
    canvas = blend_sequence(images, size, frame, total).convert("RGBA")
    w, h = size
    shade = Image.new("RGBA", size, (0, 0, 0, 0))
    shade_draw = ImageDraw.Draw(shade)
    shade_draw.rectangle((0, 0, w, h), fill=hex_to_rgb(BRAND["blue"]) + (26,))
    shade_draw.rectangle((0, int(h * 0.52), w, h), fill=hex_to_rgb(BRAND["red_deep"]) + (48,))
    canvas.alpha_composite(shade)
    draw = ImageDraw.Draw(canvas)

    enter = ease_out(frame / max(1, int(total * 0.2)))
    pulse = 0.5 + 0.5 * math.sin((frame / total) * math.pi * 2)
    is_vertical = h / w >= 1.4
    if is_vertical:
        panel = (56, int(h * 0.32), w - 112, 760)
    elif w > h:
        panel = (56, 56, 840, h - 112)
    else:
        panel = (56, h - 596, w - 112, 560)
    x, y, pw, ph = panel
    y_offset = int((1 - enter) * 74)
    panel_layer = Image.new("RGBA", size, (0, 0, 0, 0))
    pd = ImageDraw.Draw(panel_layer)
    pd.rectangle((x, y + y_offset, x + pw, y + y_offset + ph), fill=(255, 255, 255, int(246 * enter)))
    pd.rectangle((x, y + y_offset, x + int(pw * (0.35 + 0.65 * enter)), y + y_offset + 12), fill=hex_to_rgb(BRAND["red"]) + (255,))
    panel_layer = panel_layer.filter(ImageFilter.GaussianBlur(0))
    canvas.alpha_composite(panel_layer)

    copy_x = x + 48
    copy_y = y + y_offset + 48
    brand = str(spec["brand"])
    if brand == "yum":
        paste_logo(canvas, (copy_x, copy_y), 92 if w <= 1080 else 80)
        copy_y += 118 if w <= 1080 else 98

    alpha_fill = lambda color: hex_to_rgb(color) + (int(255 * enter),)
    title = str(spec["title"])
    deck = str(spec["deck"])
    cta = str(spec["cta"])
    title_start = 72 if is_vertical else 56
    title_font, title_lines, _ = fitted_font(draw, title, "serif", title_start, 44, pw - 96, 3)
    td = ImageDraw.Draw(canvas)
    td.text((copy_x, copy_y), "patticake" if brand == "patticake" else "yum! Kitchen and Bakery", font=font(24, "sans"), fill=alpha_fill(BRAND["red"]))
    copy_y += 42
    copy_y = draw_wrapped(td, (copy_x, copy_y), title_lines, title_font, BRAND["ink"], leading=1.03)
    copy_y += 24
    deck_font, deck_lines, _ = fitted_font(td, deck, "sans", 34 if is_vertical else 28, 24, pw - 96, 3)
    copy_y = draw_wrapped(td, (copy_x, copy_y), deck_lines, deck_font, BRAND["body"], leading=1.18)
    copy_y += 32
    cta_font = font(27 if is_vertical else 24, "sans")
    tw, _ = text_size(td, cta, cta_font)
    button_scale = 1 + 0.018 * pulse
    bx = copy_x
    by = copy_y
    bw = int((tw + 46) * button_scale)
    td.rectangle((bx, by, bx + bw, by + 56), fill=BRAND["red"])
    td.text((bx + 23, by + 15), cta, font=cta_font, fill=BRAND["white"])

    tag = "yumkitchen.com/patticake" if brand == "patticake" else "yumkitchen.com"
    tag_font = font(23 if w <= 1080 else 21, "sans")
    tw, _ = text_size(td, tag, tag_font)
    td.text((w - tw - 46, h - 58), tag, font=tag_font, fill=BRAND["white"])
    return canvas.convert("RGB")


def write_video(spec: dict[str, object], *, fps: int = 24, duration: float = 6.0) -> tuple[Path, Path]:
    size = spec["size"]
    assert isinstance(size, tuple)
    w, h = size
    total = int(fps * duration)
    out = MOTION / f"{spec['id']}.mp4"
    poster = POSTERS / f"{spec['id']}-poster.png"
    MOTION.mkdir(parents=True, exist_ok=True)
    POSTERS.mkdir(parents=True, exist_ok=True)
    cmd = [
        "ffmpeg",
        "-y",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{w}x{h}",
        "-r",
        str(fps),
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "20",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(out),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    assert proc.stdin is not None
    for frame_no in range(total):
        frame = render_motion_frame(spec, frame_no, total)
        if frame_no == int(total * 0.42):
            frame.save(poster, quality=96)
        proc.stdin.write(frame.tobytes())
    proc.stdin.close()
    stderr = proc.stderr.read().decode("utf-8", errors="ignore") if proc.stderr else ""
    return_code = proc.wait()
    if return_code != 0:
        raise RuntimeError(f"ffmpeg failed for {spec['id']}: {stderr[-2000:]}")
    return out, poster


def write_remotion_source() -> None:
    src_dir = REMOTION / "src"
    public_dir = REMOTION / "public" / "images"
    src_dir.mkdir(parents=True, exist_ok=True)
    public_dir.mkdir(parents=True, exist_ok=True)

    copied: set[str] = set()
    for spec in MOTION_SPECS:
        for rel in spec["images"]:
            assert isinstance(rel, str)
            target = public_dir / Path(rel).name
            if str(target) not in copied:
                shutil.copy2(PUBLIC_IMAGES / rel, target)
                copied.add(str(target))
    shutil.copy2(LOGO, REMOTION / "public" / "logo.png")

    compositions = []
    for spec in MOTION_SPECS:
        images = [Path(str(rel)).name for rel in spec["images"]]
        size = spec["size"]
        assert isinstance(size, tuple)
        compositions.append(
            {
                "id": spec["id"],
                "width": size[0],
                "height": size[1],
                "fps": 24,
                "durationInFrames": 144,
                "title": spec["title"],
                "deck": spec["deck"],
                "cta": spec["cta"],
                "brand": spec["brand"],
                "images": images,
            }
        )

    (src_dir / "Root.tsx").write_text(
        """import { Composition, Folder } from "remotion";
import { SocialMotion, type SocialMotionProps } from "./SocialMotion";
import data from "./compositions.json";

export const RemotionRoot = () => {
  const compositions = data as SocialMotionProps[];

  return (
    <Folder name="Yum-Patticake-Social">
      {compositions.map((item) => (
        <Composition
          key={item.id}
          id={item.id}
          component={SocialMotion}
          durationInFrames={item.durationInFrames}
          fps={item.fps}
          width={item.width}
          height={item.height}
          defaultProps={item}
        />
      ))}
    </Folder>
  );
};
""",
        encoding="utf-8",
    )
    (src_dir / "SocialMotion.tsx").write_text(
        """import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type SocialMotionProps = {
  id: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  title: string;
  deck: string;
  cta: string;
  brand: "yum" | "patticake";
  images: string[];
};

const red = "#E03A3E";
const ink = "#2D2D2D";
const body = "#5F5A5A";

export const SocialMotion = (props: SocialMotionProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const progress = frame / Math.max(1, durationInFrames - 1);
  const enter = interpolate(frame, [0, 0.7 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const imageIndex = Math.min(props.images.length - 1, Math.floor(progress * props.images.length));
  const isVertical = height / width >= 1.4;
  const isHorizontal = width > height;
  const panelTop = isVertical ? height * 0.32 : isHorizontal ? 56 : height - 596;
  const panelLeft = 56;
  const panelWidth = isVertical ? width - 112 : isHorizontal ? 840 : width - 112;
  const panelHeight = isVertical ? 760 : isHorizontal ? height - 112 : 560;
  const imageScale = 1.05 + progress * 0.045;

  return (
    <AbsoluteFill style={{ backgroundColor: "white", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      <Img
        src={staticFile(`images/${props.images[imageIndex]}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${imageScale}) translateX(${Math.sin(progress * Math.PI * 2) * 18}px)`,
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(202,228,253,.15), rgba(180,33,43,.24))" }} />
      <div
        style={{
          position: "absolute",
          left: panelLeft,
          top: panelTop + (1 - enter) * 74,
          width: panelWidth,
          minHeight: panelHeight,
          background: "white",
          opacity: enter,
          padding: 48,
          boxSizing: "border-box",
        }}
      >
        <div style={{ height: 12, background: red, margin: "-48px -48px 36px" }} />
        {props.brand === "yum" ? (
          <Img src={staticFile("logo.png")} style={{ width: 92, height: 92, marginBottom: 20 }} />
        ) : null}
        <div style={{ color: red, fontSize: 24, marginBottom: 18 }}>
          {props.brand === "patticake" ? "patticake" : "yum! Kitchen and Bakery"}
        </div>
        <div style={{ color: ink, fontFamily: "Georgia, serif", fontSize: isVertical ? 70 : 54, lineHeight: 1.03 }}>
          {props.title}
        </div>
        <div style={{ color: body, fontSize: isVertical ? 34 : 28, lineHeight: 1.18, marginTop: 22 }}>
          {props.deck}
        </div>
        <div style={{ display: "inline-block", background: red, color: "white", fontSize: 26, marginTop: 30, padding: "15px 23px" }}>
          {props.cta}
        </div>
      </div>
    </AbsoluteFill>
  );
};
""",
        encoding="utf-8",
    )
    (src_dir / "compositions.json").write_text(json.dumps(compositions, indent=2) + "\n", encoding="utf-8")
    (REMOTION / "package.json").write_text(
        json.dumps(
            {
                "scripts": {
                    "studio": "remotion studio src/Root.tsx",
                    "render:patticake": "remotion render src/Root.tsx patticake-send-cake-reel ../motion/remotion-patticake-send-cake-reel.mp4",
                    "render:yum": "remotion render src/Root.tsx yum-made-scratch-reel ../motion/remotion-yum-made-scratch-reel.mp4",
                },
                "dependencies": {
                    "@remotion/cli": "latest",
                    "remotion": "latest",
                    "typescript": "latest",
                },
                "devDependencies": {},
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    (REMOTION / "README.md").write_text(
        """# Remotion source

This folder contains editable Remotion compositions for the motion exports.

Run:

```bash
npm install
npm run studio
```

The compositions use frame-driven animation, `staticFile()` assets, and fixed social dimensions.
""",
        encoding="utf-8",
    )


def write_docs(static_manifest: list[dict[str, object]], motion_manifest: list[dict[str, object]]) -> None:
    now = datetime.now(timezone.utc).isoformat()
    full_manifest = {
        "name": "yum! and patticake social motion pack",
        "createdAt": now,
        "source": {
            "workspace": str(ROOT),
            "approvedImageSource": str(PUBLIC_IMAGES),
            "builder": str(Path(__file__).resolve()),
        },
        "brandRules": {
            "textPanels": "solid white only",
            "avoid": ["tinted text backgrounds", "prices", "unsupported claims", "fake reviews"],
            "motion": "slow editorial photo moves, deterministic copy overlays",
        },
        "staticAssets": static_manifest,
        "motionAssets": motion_manifest,
    }
    DATA.mkdir(parents=True, exist_ok=True)
    (OUT / "manifest.json").write_text(json.dumps(full_manifest, indent=2) + "\n", encoding="utf-8")

    with (OUT / "captions.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["id", "platform", "caption", "cta"])
        writer.writeheader()
        for item in static_manifest:
            writer.writerow(
                {
                    "id": item["id"],
                    "platform": item["placement"],
                    "caption": item["caption"],
                    "cta": item["cta"],
                }
            )
        for item in motion_manifest:
            writer.writerow(
                {
                    "id": item["id"],
                    "platform": item["placement"],
                    "caption": item["caption"],
                    "cta": item["cta"],
                }
            )

    caption_lines = ["# Captions", ""]
    for item in static_manifest + motion_manifest:
        caption_lines.append(f"## {item['id']}")
        caption_lines.append("")
        caption_lines.append(str(item["caption"]))
        caption_lines.append("")
        caption_lines.append(f"CTA: {item['cta']}")
        caption_lines.append("")
    (OUT / "captions.md").write_text("\n".join(caption_lines), encoding="utf-8")

    storyboard_lines = ["# Motion storyboards", ""]
    for item in motion_manifest:
        storyboard_lines.extend(
            [
                f"## {item['id']}",
                "",
                "0.0s to 1.2s: photo opens with a slow push and the brand line fades in.",
                "1.2s to 3.8s: headline panel slides in over solid white.",
                "3.8s to 5.2s: supporting copy and CTA settle.",
                "5.2s to 6.0s: final hold for screenshot or loop transition.",
                "",
            ]
        )
    (OUT / "motion-storyboards.md").write_text("\n".join(storyboard_lines), encoding="utf-8")

    readme = f"""# yum! and patticake social motion pack

Built on {now} from the approved local website photography in `yumkitchen-web/public/images`.

## What is included

- {len(static_manifest)} static PNG assets in `exports/`
- {len(motion_manifest)} MP4 motion assets in `motion/`
- Poster frames in `posters/`
- Captions in `captions.md` and `captions.csv`
- Creative Production review files in `review-board.html`, `contact-sheet.png`, and `moodboard-widget-payload.json`
- Editable Remotion source in `remotion/`

## Production rules

- Text panels are solid white, not tinted.
- Copy avoids prices, unsupported claims, and fake customer reviews.
- Motion uses slow editorial photo movement, simple panel entrances, and readable safe zones.
- Source imagery comes from the current Yum/Patticake website asset folder.

## Rebuild

```bash
cd {ROOT}
python3 social/scripts/build_social_motion_pack.py
```
"""
    (OUT / "README.md").write_text(readme, encoding="utf-8")


def render_static_assets() -> list[dict[str, object]]:
    manifest: list[dict[str, object]] = []
    EXPORTS.mkdir(parents=True, exist_ok=True)
    for spec in STATIC_ASSETS:
        output = EXPORTS / f"{spec.id}.png"
        draw_panel_card(
            size=spec.size,
            image=spec.image,
            output=output,
            title=spec.title,
            deck=spec.deck,
            cta=spec.cta,
            kicker=spec.kicker,
            placement=spec.placement,
            brand=spec.brand,
            anchor=spec.anchor,
            layout=spec.layout,
            chips=list(spec.chips),
        )
        manifest.append(
            {
                "id": spec.id,
                "title": spec.title,
                "label": spec.title,
                "filename": output.name,
                "path": str(output),
                "src": f"exports/{output.name}",
                "href": f"exports/{output.name}",
                "format": "png",
                "width": spec.size[0],
                "height": spec.size[1],
                "aspectRatio": f"{spec.size[0]}:{spec.size[1]}",
                "placement": spec.placement,
                "topic": spec.topic,
                "brand": spec.brand,
                "cta": spec.cta,
                "caption": caption_for(spec.title, spec.deck, spec.cta, spec.brand),
                "alt": spec.alt or f"{spec.brand} social asset for {spec.topic}.",
            }
        )
    return manifest


def caption_for(title: str, deck: str, cta: str, brand: str) -> str:
    if brand == "patticake":
        return f"{title}. {deck} {cta} at yumkitchen.com/patticake."
    return f"{title}. {deck} {cta} at yumkitchen.com."


def render_motion_assets() -> list[dict[str, object]]:
    manifest: list[dict[str, object]] = []
    for spec in MOTION_SPECS:
        video, poster = write_video(spec)
        size = spec["size"]
        assert isinstance(size, tuple)
        brand = str(spec["brand"])
        title = str(spec["title"])
        deck = str(spec["deck"])
        cta = str(spec["cta"])
        placement = "reel_or_story" if size[1] > size[0] else "feed_motion" if size[0] == size[1] else "landscape_motion"
        manifest.append(
            {
                "id": spec["id"],
                "title": title,
                "label": title,
                "filename": video.name,
                "path": str(video),
                "poster": str(poster),
                "format": "mp4",
                "width": size[0],
                "height": size[1],
                "durationSeconds": 6,
                "fps": 24,
                "placement": placement,
                "topic": spec["topic"],
                "brand": brand,
                "cta": cta,
                "caption": caption_for(title, deck, cta, brand),
            }
        )
    return manifest


def write_review_manifest(static_manifest: list[dict[str, object]], motion_manifest: list[dict[str, object]]) -> Path:
    review_manifest: list[dict[str, object]] = []
    index = 1
    for item in static_manifest:
        review_manifest.append(
            {
                "id": item["id"],
                "index": index,
                "title": item["title"],
                "label": item["label"],
                "src": item["src"],
                "href": item["href"],
                "caption": f"{item['placement']} / {item['topic']}",
                "family": item["brand"],
                "bestFor": item["placement"],
            }
        )
        index += 1
    for item in motion_manifest:
        poster = Path(str(item["poster"]))
        rel = f"posters/{poster.name}"
        review_manifest.append(
            {
                "id": item["id"],
                "index": index,
                "title": item["title"],
                "label": item["label"],
                "src": rel,
                "href": f"motion/{item['filename']}",
                "caption": f"{item['placement']} / motion",
                "family": item["brand"],
                "bestFor": item["placement"],
            }
        )
        index += 1
    review_path = DATA / "review-manifest.json"
    review_path.write_text(json.dumps(review_manifest, indent=2) + "\n", encoding="utf-8")
    options = {
        "title": "yum! and patticake social motion pack",
        "summary": "Static social assets, motion poster frames, and reviewable creative exports.",
        "preset": "image-wall",
        "showCaptions": True,
        "contactSheetOutput": "contact-sheet.png",
    }
    (DATA / "review-options.json").write_text(json.dumps(options, indent=2) + "\n", encoding="utf-8")
    return review_path


def run_review_renderer(review_manifest: Path) -> None:
    if not REVIEW_RENDERER.exists():
        raise FileNotFoundError(REVIEW_RENDERER)
    cmd = [
        "python3",
        str(REVIEW_RENDERER),
        "--out-dir",
        str(OUT),
        "--manifest",
        str(review_manifest),
        "--review-options",
        str(DATA / "review-options.json"),
        "--contact-sheet",
        "--moodboard-widget-payload",
    ]
    subprocess.run(cmd, check=True)


def clean_output() -> None:
    for folder in [EXPORTS, MOTION, POSTERS, DATA, OUT / "generated", REMOTION]:
        if folder.exists():
            shutil.rmtree(folder)
    for file in [
        OUT / "manifest.json",
        OUT / "captions.md",
        OUT / "captions.csv",
        OUT / "motion-storyboards.md",
        OUT / "README.md",
        OUT / "review-board.html",
        OUT / "contact-sheet.png",
        OUT / "moodboard-widget-payload.json",
        OUT / "run-state.json",
        OUT / "latest-action.json",
    ]:
        if file.exists():
            file.unlink()


def main() -> None:
    if os.environ.get("ALLOW_RETIRED_YUM_MOTION_PACK_REBUILD") != "1":
        raise SystemExit(
            "Retired builder blocked. Use social/yum-patticake-creative-launch-2026-07-14 and /asset-gallery. "
            "Set ALLOW_RETIRED_YUM_MOTION_PACK_REBUILD=1 only for an explicit provenance rebuild."
        )
    OUT.mkdir(parents=True, exist_ok=True)
    clean_output()
    static_manifest = render_static_assets()
    motion_manifest = render_motion_assets()
    write_remotion_source()
    write_docs(static_manifest, motion_manifest)
    review_manifest = write_review_manifest(static_manifest, motion_manifest)
    run_review_renderer(review_manifest)
    print(
        json.dumps(
            {
                "output": str(OUT),
                "staticAssets": len(static_manifest),
                "motionAssets": len(motion_manifest),
                "review": str(OUT / "review-board.html"),
                "contactSheet": str(OUT / "contact-sheet.png"),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
