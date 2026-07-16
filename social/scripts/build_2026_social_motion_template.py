#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import shutil
import subprocess
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "yumkitchen-web" / "public"
IMAGES = PUBLIC / "images"
LOGO = PUBLIC / "logo.png"
OUT = ROOT / "social" / "yum-social-motion-template-2026"
DATA = OUT / "data"
GUIDES = OUT / "guides"
DERIVED = OUT / "source-assets"
VIDEO = OUT / "exports" / "video"
COVERS = OUT / "exports" / "covers"
POSTERS_4X5 = OUT / "exports" / "posters-4x5"
POSTERS_3X4 = OUT / "exports" / "profile-grid-3x4"
SQUARE = OUT / "exports" / "square-safe"
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

W, H = 1080, 1920
FPS = 30
DURATION_SECONDS = 8.0
TOTAL_FRAMES = int(FPS * DURATION_SECONDS)

BRAND = {
    "red": "#E03A3E",
    "red_deep": "#B4212B",
    "ink": "#2D2D2D",
    "paper": "#FFFFFF",
    "caption": "#2D2D2D",
    "body": "#5F5A5A",
    "blue": "#CAE4FD",
    "soft_blue": "#AED2EF",
}

SAFE_ZONE = {
    "canvas": {"width": W, "height": H},
    "primary": {"x": 88, "y": 250, "width": 804, "height": 1210},
    "rightRail": {"x": 920, "y": 0, "width": 160, "height": H},
    "topUi": {"x": 0, "y": 0, "width": W, "height": 230},
    "bottomUi": {"x": 0, "y": 1460, "width": W, "height": 460},
    "centerSquare": {"x": 0, "y": 420, "width": 1080, "height": 1080},
}

SOURCES = {
    "tiktok": "https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads?redirected=2",
    "youtube_shorts": "https://support.google.com/youtube/answer/15424877?hl=en",
    "instagram_reels": "https://help.instagram.com/1038071743007909",
    "meta_text_overlay_safe_zone": "https://www.facebook.com/business/help/980593475366490",
}


def font_path(candidates: list[str]) -> str | None:
    for candidate in candidates:
        if Path(candidate).exists():
            return candidate
    return None


SERIF = font_path(
    [
        "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/Library/Fonts/Georgia.ttf",
    ]
)
SANS = font_path(
    [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
)
BOLD = font_path(
    [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
)


def font(size: int, family: str = "sans") -> ImageFont.ImageFont:
    path = SERIF if family == "serif" else BOLD if family == "bold" else SANS
    if path:
        return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def rgba(value: str, alpha: int) -> tuple[int, int, int, int]:
    return rgb(value) + (alpha,)


def source_image_path(rel: str) -> Path:
    if rel.startswith("@derived/"):
        return DERIVED / rel.removeprefix("@derived/")
    return IMAGES / rel


def load_image(rel: str) -> Image.Image:
    return ImageOps.exif_transpose(Image.open(source_image_path(rel)).convert("RGB"))


def cover(
    rel: str,
    size: tuple[int, int],
    *,
    anchor: tuple[float, float] = (0.5, 0.5),
    zoom: float = 1.0,
    pan: tuple[float, float] = (0.0, 0.0),
) -> Image.Image:
    source = load_image(rel)
    tw, th = size
    scale = max(tw / source.width, th / source.height) * zoom
    resized = source.resize(
        (math.ceil(source.width * scale), math.ceil(source.height * scale)),
        Image.Resampling.LANCZOS,
    )
    max_x = max(0, resized.width - tw)
    max_y = max(0, resized.height - th)
    cx = anchor[0] * resized.width + pan[0] * tw
    cy = anchor[1] * resized.height + pan[1] * th
    left = int(min(max(0, cx - tw / 2), max_x))
    top = int(min(max(0, cy - th / 2), max_y))
    return resized.crop((left, top, left + tw, top + th))


def text_box(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.ImageFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.ImageFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    line = ""
    for word in words:
        trial = word if not line else f"{line} {word}"
        if text_box(draw, trial, fnt)[0] <= width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def fit_lines(
    draw: ImageDraw.ImageDraw,
    text: str,
    family: str,
    start: int,
    min_size: int,
    width: int,
    max_lines: int,
) -> tuple[ImageFont.ImageFont, list[str]]:
    for size in range(start, min_size - 1, -2):
        fnt = font(size, family)
        lines = wrap(draw, text, fnt, width)
        if len(lines) <= max_lines:
            return fnt, lines
    fnt = font(min_size, family)
    lines = wrap(draw, text, fnt, width)[:max_lines]
    return fnt, lines


def eased(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return 1 - pow(1 - t, 3)


def clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def alpha_composite_rect(base: Image.Image, box: tuple[int, int, int, int], fill: tuple[int, int, int, int]) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).rectangle(box, fill=fill)
    base.alpha_composite(layer)


def paste_logo(canvas: Image.Image, xy: tuple[int, int], size: int) -> None:
    logo = Image.open(LOGO).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    canvas.alpha_composite(logo, xy)


def draw_multiline(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    lines: list[str],
    fnt: ImageFont.ImageFont,
    fill: str,
    line_height: int,
) -> int:
    x, y = xy
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += line_height
    return y


@dataclass(frozen=True)
class TemplateSpec:
    id: str
    family: str
    brand: str
    hook: str
    offer: str
    proof: str
    cta: str
    caption_beats: tuple[str, str, str]
    images: tuple[str, str, str]
    anchors: tuple[tuple[float, float], tuple[float, float], tuple[float, float]]
    palette: str = "red"


TEMPLATES: list[TemplateSpec] = [
    TemplateSpec(
        id="patticake-gift-drop",
        family="hook-drop",
        brand="patticake",
        hook="send cake, not a card",
        offer="ship a cake with a personal note",
        proof="real bakery layers from yum!",
        cta="Order patticake",
        caption_beats=("pick the message", "choose the date", "share the love"),
        images=("patticake/gift_box_vertical.jpg", "patticake/10_layers_slice.jpg", "patticake/03_top_view.jpg"),
        anchors=((0.48, 0.42), (0.5, 0.48), (0.5, 0.5)),
    ),
    TemplateSpec(
        id="patticake-layer-proof",
        family="macro-proof",
        brand="patticake",
        hook="real layers. real note.",
        offer="chocolate cake, vanilla buttercream",
        proof="made by the yum! bakery team",
        cta="Ship a cake",
        caption_beats=("slice close", "message added", "ready to share"),
        images=("patticake/layers_slice_vertical.jpg", "patticake/09_slices.jpg", "patticake/slices_plates_vertical.jpg"),
        anchors=((0.5, 0.42), (0.46, 0.5), (0.52, 0.5)),
    ),
    TemplateSpec(
        id="patticake-birthday-first-slice",
        family="birthday-proof",
        brand="patticake",
        hook="birthday cake, handled",
        offer="chocolate layers + vanilla buttercream",
        proof="add the date and message",
        cta="Plan the cake",
        caption_beats=("pick the date", "add the message", "cut the first slice"),
        images=("patticake/layers_slice_vertical.jpg", "patticake/09_slices.jpg", "patticake/03_top_view.jpg"),
        anchors=((0.5, 0.42), (0.46, 0.5), (0.5, 0.5)),
    ),
    TemplateSpec(
        id="patticake-event-inquiry",
        family="event-inquiry",
        brand="patticake",
        hook="cake for the table",
        offer="weddings, showers, event days",
        proof="start with the date and details",
        cta="Start an inquiry",
        caption_beats=("set the scene", "share the date", "inquiry starts here"),
        images=("patticake/02_tier_wedding_a.jpg", "patticake/05_tier_wedding_c.jpg", "patticake/08_tier_wedding_d.jpg"),
        anchors=((0.5, 0.48), (0.5, 0.47), (0.5, 0.46)),
    ),
    TemplateSpec(
        id="yum-lunch-decision",
        family="question-hook",
        brand="yum",
        hook="what should we eat?",
        offer="breakfast, lunch, dinner, bakery",
        proof="four Twin Cities kitchens",
        cta="Order online",
        caption_beats=("start with cravings", "pick your kitchen", "take yum! home"),
        images=("yum-hero-0131.jpg", "yum-soup-and-sandwich.jpg", "yum-shake-and-sandwich.jpg"),
        anchors=((0.52, 0.48), (0.5, 0.5), (0.52, 0.5)),
    ),
    TemplateSpec(
        id="yum-catering-room",
        family="occasion-proof",
        brand="yum",
        hook="feed the room",
        offer="boxed lunches, trays, bakery",
        proof="group orders made simple",
        cta="Plan catering",
        caption_beats=("meeting ready", "fresh trays", "dessert handled"),
        images=("yum-catering-boxed-lunch.jpg", "yum-catering-sandwiches-live.jpg", "yum-catering-tray.jpg"),
        anchors=((0.5, 0.48), (0.5, 0.5), (0.5, 0.44)),
    ),
    TemplateSpec(
        id="yum-four-kitchens",
        family="local-proof",
        brand="yum",
        hook="nearby yum! is the move",
        offer="St. Louis Park, Shady Oak, St. Paul, Woodbury",
        proof="four neighborhood kitchens",
        cta="Find a kitchen",
        caption_beats=("four neighborhoods", "one scratch kitchen feel", "order where you are"),
        images=("@derived/yum-four-kitchens-grid.jpg", "yum-location-slp.jpg", "yum-location-woodbury.jpg"),
        anchors=((0.5, 0.45), (0.5, 0.5), (0.52, 0.5)),
    ),
    TemplateSpec(
        id="yum-bakery-case",
        family="saveable-menu",
        brand="yum",
        hook="bring dessert",
        offer="cookies, bars, cupcakes, pies, cakes",
        proof="bakery favorites made fresh",
        cta="Visit yum!",
        caption_beats=("bakery case", "sweet finish", "bring enough to share"),
        images=("yum-bakery-counter-cake.jpg", "yum-bakery-cupcakes.jpg", "yum-bakery-bars.jpeg"),
        anchors=((0.5, 0.5), (0.5, 0.45), (0.5, 0.5)),
    ),
]


def scene_index(progress: float) -> int:
    if progress < 0.35:
        return 0
    if progress < 0.68:
        return 1
    return 2


def draw_progress(draw: ImageDraw.ImageDraw, frame: int, spec: TemplateSpec) -> None:
    x = 88
    y = 350
    gap = 16
    width = 260
    for idx in range(3):
        start = idx / 3
        end = (idx + 1) / 3
        t = clamp((frame / TOTAL_FRAMES - start) / (end - start), 0, 1)
        draw.rounded_rectangle((x, y, x + width, y + 8), radius=4, fill=(255, 255, 255, 112))
        draw.rounded_rectangle((x, y, x + int(width * t), y + 8), radius=4, fill=BRAND["red"])
        x += width + gap


def draw_hook(canvas: Image.Image, spec: TemplateSpec, frame: int) -> None:
    draw = ImageDraw.Draw(canvas)
    enter = eased(frame / (FPS * 0.55))
    x = 88
    y = int(410 + (1 - enter) * 42)
    max_w = 780
    fnt, lines = fit_lines(draw, spec.hook, "bold", 92, 62, max_w, 3)
    line_h = int(fnt.size * 0.98) if hasattr(fnt, "size") else 78
    h = line_h * len(lines) + 58
    panel = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    panel_draw = ImageDraw.Draw(panel)
    panel_draw.rounded_rectangle(
        (x - 42, y - 12, x + max_w + 44, y + h + 16),
        radius=24,
        fill=rgba(BRAND["soft_blue"], int(210 * enter)),
    )
    panel_draw.rounded_rectangle(
        (x - 28, y - 28, x + max_w + 32, y + h),
        radius=22,
        fill=rgba(BRAND["paper"], int(242 * enter)),
        outline=rgba(BRAND["red"], int(255 * enter)),
        width=4,
    )
    panel_draw.rectangle((x - 28, y - 28, x - 16, y + h), fill=rgba(BRAND["red"], int(255 * enter)))
    canvas.alpha_composite(panel)
    draw = ImageDraw.Draw(canvas)
    draw_multiline(draw, (x, y), lines, fnt, BRAND["ink"], line_h)


def draw_caption_band(canvas: Image.Image, spec: TemplateSpec, frame: int) -> None:
    progress = frame / TOTAL_FRAMES
    idx = scene_index(progress)
    caption = spec.caption_beats[idx]
    draw = ImageDraw.Draw(canvas)
    y = 1068
    x = 88
    w = 780
    fnt = font(42, "bold")
    tw, _ = text_box(draw, caption, fnt)
    band_w = min(w, tw + 64)
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.rounded_rectangle(
        (x, y, x + band_w, y + 72),
        radius=36,
        fill=rgba(BRAND["soft_blue"], 238),
        outline=rgba(BRAND["paper"], 220),
        width=3,
    )
    ld.rectangle((x, y + 10, x + 12, y + 62), fill=rgba(BRAND["red"], 255))
    ld.text((x + 32, y + 16), caption, font=fnt, fill=BRAND["ink"])
    canvas.alpha_composite(layer)


def draw_offer_and_cta(canvas: Image.Image, spec: TemplateSpec, frame: int) -> None:
    progress = frame / TOTAL_FRAMES
    show = eased((progress - 0.46) / 0.18)
    if show <= 0:
        return
    draw = ImageDraw.Draw(canvas)
    x = 88
    y = int(1190 + (1 - show) * 52)
    width = 794
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.rounded_rectangle((x, y, x + width, y + 170), radius=20, fill=(255, 255, 255, int(240 * show)))
    ld.rectangle((x, y, x + width, y + 8), fill=rgb(BRAND["red"]) + (int(255 * show),))
    canvas.alpha_composite(layer)
    draw = ImageDraw.Draw(canvas)
    offer_font, offer_lines = fit_lines(draw, spec.offer, "bold", 40, 30, width - 56, 2)
    draw_multiline(draw, (x + 28, y + 28), offer_lines, offer_font, BRAND["ink"], int(offer_font.size * 1.05))
    proof_font = font(28, "sans")
    draw.text((x + 28, y + 112), spec.proof, font=proof_font, fill=BRAND["body"])
    cta_font = font(30, "bold")
    tw, _ = text_box(draw, spec.cta, cta_font)
    draw.rounded_rectangle((x, y + 202, x + tw + 70, y + 264), radius=31, fill=BRAND["red"])
    draw.text((x + 35, y + 218), spec.cta, font=cta_font, fill=BRAND["paper"])


def draw_logo_style_card(canvas: Image.Image, spec: TemplateSpec, frame: int) -> None:
    progress = frame / TOTAL_FRAMES
    show = eased((progress - 0.62) / 0.16)
    if show <= 0:
        return
    x = 88
    y = int(904 + (1 - show) * 34)
    width = 794
    height = 138
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.rounded_rectangle((x, y, x + width, y + height), radius=20, fill=(255, 255, 255, int(236 * show)))
    ld.rectangle((x, y, x + width, y + 8), fill=rgb(BRAND["red"]) + (int(255 * show),))
    canvas.alpha_composite(layer)
    draw = ImageDraw.Draw(canvas)
    draw.text((x + 28, y + 24), "yum! logo cue", font=font(26, "bold"), fill=BRAND["red"])
    draw.text((x + 28, y + 60), "red circle + white lowercase mark", font=font(30, "bold"), fill=BRAND["ink"])
    draw.text((x + 28, y + 98), "Trocchi-style serif + narrow sans support", font=font(25, "sans"), fill=BRAND["body"])


def render_frame(spec: TemplateSpec, frame: int) -> Image.Image:
    progress = frame / TOTAL_FRAMES
    idx = scene_index(progress)
    local = progress * 3 - idx
    zoom = 1.04 + progress * 0.055
    pan = (math.sin(progress * math.pi * 2.1) * 0.026, math.cos(progress * math.pi * 1.4) * 0.018)
    bg = cover(spec.images[idx], (W, H), anchor=spec.anchors[idx], zoom=zoom, pan=pan).convert("RGBA")
    if local > 0.82 and idx < 2:
        next_img = cover(
            spec.images[idx + 1],
            (W, H),
            anchor=spec.anchors[idx + 1],
            zoom=1.03 + progress * 0.04,
            pan=(-pan[0], -pan[1]),
        ).convert("RGBA")
        bg = Image.blend(bg, next_img, eased((local - 0.82) / 0.18))

    top = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td = ImageDraw.Draw(top)
    td.rectangle((0, 0, W, 760), fill=rgba(BRAND["blue"], 62))
    bg.alpha_composite(top)

    draw = ImageDraw.Draw(bg)
    paste_logo(bg, (88, 252), 74)
    brand_label = "patticake" if spec.brand == "patticake" else "yum! Kitchen and Bakery"
    draw.text((178, 276), brand_label, font=font(27, "bold"), fill=BRAND["paper"])
    draw_progress(draw, frame, spec)
    draw_hook(bg, spec, frame)
    draw_logo_style_card(bg, spec, frame)
    draw_caption_band(bg, spec, frame)
    draw_offer_and_cta(bg, spec, frame)
    url = "patticake.com" if spec.brand == "patticake" else "yumkitchen.com"
    url_font = font(24, "bold")
    tw, _ = text_box(draw, url, url_font)
    url_x = W - tw - 96
    draw.rounded_rectangle((url_x - 18, 1398, W - 76, 1452), radius=27, fill=BRAND["soft_blue"])
    draw.text((url_x, 1412), url, font=url_font, fill=BRAND["ink"])
    return bg.convert("RGB")


def write_video(spec: TemplateSpec) -> dict[str, Any]:
    VIDEO.mkdir(parents=True, exist_ok=True)
    COVERS.mkdir(parents=True, exist_ok=True)
    POSTERS_4X5.mkdir(parents=True, exist_ok=True)
    POSTERS_3X4.mkdir(parents=True, exist_ok=True)
    SQUARE.mkdir(parents=True, exist_ok=True)
    video_path = VIDEO / f"{spec.id}.mp4"
    cover_path = COVERS / f"{spec.id}-cover.png"
    poster_4x5 = POSTERS_4X5 / f"{spec.id}-4x5.png"
    poster_3x4 = POSTERS_3X4 / f"{spec.id}-3x4.png"
    square_path = SQUARE / f"{spec.id}-square.png"

    cmd = [
        "ffmpeg",
        "-y",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{W}x{H}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "19",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(video_path),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    assert proc.stdin is not None
    poster_frame = render_frame(spec, int(FPS * 0.55))
    poster_frame.save(cover_path, quality=96)
    poster_frame.crop((0, 285, W, 1635)).resize((1080, 1350), Image.Resampling.LANCZOS).save(poster_4x5, quality=96)
    poster_frame.crop((0, 240, W, 1680)).resize((1080, 1440), Image.Resampling.LANCZOS).save(poster_3x4, quality=96)
    poster_frame.crop((0, 420, W, 1500)).resize((1080, 1080), Image.Resampling.LANCZOS).save(square_path, quality=96)
    for frame_no in range(TOTAL_FRAMES):
        proc.stdin.write(render_frame(spec, frame_no).tobytes())
    proc.stdin.close()
    stderr = proc.stderr.read().decode("utf-8", errors="ignore") if proc.stderr else ""
    code = proc.wait()
    if code != 0:
        raise RuntimeError(f"ffmpeg failed for {spec.id}: {stderr[-2000:]}")
    return {
        "id": spec.id,
        "family": spec.family,
        "brand": spec.brand,
        "hook": spec.hook,
        "video": str(video_path),
        "cover": str(cover_path),
        "poster4x5": str(poster_4x5),
        "profileGrid3x4": str(poster_3x4),
        "squareSafe": str(square_path),
        "width": W,
        "height": H,
        "fps": FPS,
        "durationSeconds": DURATION_SECONDS,
        "safeZone": SAFE_ZONE["primary"],
        "cta": spec.cta,
        "logoStyleCard": {
            "copy": [
                "yum! logo cue",
                "red circle + white lowercase mark",
                "Trocchi-style serif + narrow sans support",
            ],
            "colors": {
                "yumRed": BRAND["red"],
                "logoMark": BRAND["paper"],
                "headlineInk": BRAND["ink"],
            },
        },
    }


def write_guides() -> None:
    GUIDES.mkdir(parents=True, exist_ok=True)
    guide = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(guide)
    top = SAFE_ZONE["topUi"]
    bottom = SAFE_ZONE["bottomUi"]
    rail = SAFE_ZONE["rightRail"]
    primary = SAFE_ZONE["primary"]
    square = SAFE_ZONE["centerSquare"]
    d.rectangle((0, top["y"], W, top["y"] + top["height"]), fill=(0, 0, 0, 72))
    d.rectangle((0, bottom["y"], W, H), fill=(0, 0, 0, 72))
    d.rectangle((rail["x"], 0, W, H), fill=(0, 0, 0, 48))
    d.rectangle((square["x"], square["y"], square["x"] + square["width"], square["y"] + square["height"]), outline=rgb(BRAND["soft_blue"]) + (230,), width=5)
    d.rectangle((primary["x"], primary["y"], primary["x"] + primary["width"], primary["y"] + primary["height"]), outline=rgb(BRAND["red"]) + (255,), width=6)
    d.text((88, 64), "unsafe top UI", font=font(26, "bold"), fill=(255, 255, 255, 220))
    d.text((88, 1518), "unsafe caption and CTA UI", font=font(26, "bold"), fill=(255, 255, 255, 220))
    d.text((108, 274), "primary copy zone", font=font(26, "bold"), fill=BRAND["red"])
    guide.save(GUIDES / "vertical-safe-zone-overlay.png")

    plain = Image.new("RGBA", (W, H), rgb(BRAND["paper"]) + (255,))
    plain.alpha_composite(guide)
    plain.convert("RGB").save(GUIDES / "vertical-safe-zone-reference.png", quality=95)


def write_derived_assets() -> None:
    DERIVED.mkdir(parents=True, exist_ok=True)
    grid = Image.new("RGB", (W, H), rgb(BRAND["paper"]))
    locations = [
        "yum-location-slp.jpg",
        "yum-location-shady-oak.jpg",
        "yum-location-saint-paul.jpg",
        "yum-location-woodbury.jpg",
    ]
    positions = [(0, 0), (W // 2, 0), (0, H // 2), (W // 2, H // 2)]
    for rel, position in zip(locations, positions, strict=True):
        source = load_image(rel)
        tile = ImageOps.fit(source, (W // 2, H // 2), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
        grid.paste(tile, position)
    draw = ImageDraw.Draw(grid)
    draw.rectangle((W // 2 - 5, 0, W // 2 + 5, H), fill=rgb(BRAND["paper"]))
    draw.rectangle((0, H // 2 - 5, W, H // 2 + 5), fill=rgb(BRAND["paper"]))
    grid.save(DERIVED / "yum-four-kitchens-grid.jpg", quality=94)


def write_docs(results: list[dict[str, Any]]) -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    now = datetime.now(timezone.utc).isoformat()
    manifest = {
        "name": "yum! social motion template 2026",
        "createdAt": now,
        "purpose": "Reusable vertical-first social motion template with safe-zone-aware posters and Remotion source.",
        "platformGuidance": {
            "lastVerified": "2026-07-09",
            "sources": SOURCES,
            "decisions": [
                "Use 1080x1920 as the master canvas for Reels, Stories, TikTok, and Shorts.",
                "Render at 30 fps to satisfy modern short-form expectations and Instagram Reels minimums.",
                "Keep primary text inside a conservative center-left safe zone and out of the right action rail.",
                "Export 4:5, 3:4, and 1:1 posters from the vertical master for feed and profile reuse.",
                "Use burned-in caption beats because platform captions and app UI can vary by placement.",
            ],
        },
        "safeZone": SAFE_ZONE,
        "templates": results,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    (DATA / "template-spec.json").write_text(
        json.dumps(
            {
                "canvas": {"width": W, "height": H, "fps": FPS, "durationSeconds": DURATION_SECONDS},
                "safeZone": SAFE_ZONE,
                "templates": [spec.__dict__ for spec in TEMPLATES],
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    brief = f"""# 2026 social motion template brief

This template is a new vertical-first system for yum! and patticake social content.

## Built for

- Instagram Reels and Stories
- TikTok In-Feed and Spark-style creative
- YouTube Shorts
- Feed poster reuse in 4:5, 3:4, and 1:1 crops

## Creative rules

- First beat lands immediately, no slow intro.
- Headline stays under eight words when possible.
- Caption beats are burned in and sit inside the primary safe zone.
- CTA appears before the final hold and stays above the bottom platform UI.
- Motion text cards mention the Yum logo cue: red circle, white lowercase mark, Trocchi-style serif, and narrow sans support.
- Product photography stays full-bleed, with text on Yum paper, red, and blue contrast layers only.
- Text cards should never use black panel styling.
- No pink-tinted or black text backgrounds, no prices, no unsupported claims, no fake reviews.

## Source notes

- TikTok official auction in-feed specs were last updated in June 2026 and recommend vertical 9:16 for Non-Spark ads, with safe-zone files varying by format.
- YouTube classifies square or vertical uploads up to three minutes as Shorts for standard channels after October 15, 2024.
- Instagram Reels guidance is treated as vertical-first with 30 fps and a 9:16 master. The public help page is login-gated in this environment, so the manifest keeps the source URL for review.
- Meta text overlay guidance is login-gated in this environment, so the template uses a conservative center-left safe zone and keeps copy away from expected app UI.

Generated: {now}
"""
    (OUT / "best-practice-brief.md").write_text(brief, encoding="utf-8")

    readme = f"""# yum! social motion template 2026

This is the new reusable 2026 social motion template system. It is intentionally separate from the older Instagram and post-worthy packs.

## Output

- `exports/video`: 1080x1920 MP4 masters at {FPS} fps
- `exports/covers`: 1080x1920 cover frames
- `exports/posters-4x5`: 1080x1350 feed posters
- `exports/profile-grid-3x4`: 1080x1440 profile grid crops
- `exports/square-safe`: 1080x1080 square center crops
- `guides`: safe-zone reference overlays
- `remotion`: editable Remotion source
- `review-board.html` and `contact-sheet.png`: Creative Production review surfaces

## Rebuild

```bash
cd {ROOT}
python3 social/scripts/build_2026_social_motion_template.py
```
"""
    (OUT / "README.md").write_text(readme, encoding="utf-8")

    storyboard = ["# Template storyboards", ""]
    for spec in TEMPLATES:
        storyboard.extend(
            [
                f"## {spec.id}",
                "",
                f"0.0s to 1.1s: immediate hook, `{spec.hook}`.",
                f"1.1s to 3.0s: macro or product proof, `{spec.caption_beats[0]}`.",
                f"3.0s to 5.5s: second product beat, `{spec.caption_beats[1]}`.",
                f"5.5s to 8.0s: offer, proof, and CTA, `{spec.cta}`.",
                "",
            ]
        )
    (OUT / "storyboards.md").write_text("\n".join(storyboard), encoding="utf-8")


def write_review(results: list[dict[str, Any]]) -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    review = []
    for idx, item in enumerate(results, start=1):
        cover_path = Path(item["cover"])
        video_path = Path(item["video"])
        review.append(
            {
                "id": item["id"],
                "index": idx,
                "title": item["hook"],
                "label": item["id"],
                "src": f"exports/covers/{cover_path.name}",
                "href": f"exports/video/{video_path.name}",
                "caption": f"{item['family']} / {item['brand']} / 1080x1920 / 30 fps",
                "family": item["family"],
                "bestFor": "Reels, TikTok, Shorts",
            }
        )
    review_path = DATA / "review-manifest.json"
    review_path.write_text(json.dumps(review, indent=2) + "\n", encoding="utf-8")
    options = {
        "title": "yum! social motion template 2026",
        "summary": "Vertical-first 2026 motion templates with platform-safe poster crops.",
        "preset": "image-wall",
        "showCaptions": True,
        "contactSheetOutput": "contact-sheet.png",
    }
    options_path = DATA / "review-options.json"
    options_path.write_text(json.dumps(options, indent=2) + "\n", encoding="utf-8")
    subprocess.run(
        [
            "python3",
            str(REVIEW_RENDERER),
            "--out-dir",
            str(OUT),
            "--manifest",
            str(review_path),
            "--review-options",
            str(options_path),
            "--contact-sheet",
            "--moodboard-widget-payload",
        ],
        check=True,
    )


def write_final_hold_sheet() -> None:
    cols = len(TEMPLATES)
    thumb_w = 220
    thumb_h = 390
    pad = 24
    gap = 18
    label_h = 38
    sheet = Image.new("RGB", (pad * 2 + cols * thumb_w + (cols - 1) * gap, pad * 2 + thumb_h + label_h), "white")
    draw = ImageDraw.Draw(sheet)
    label_font = font(14, "sans")
    for idx, spec in enumerate(TEMPLATES):
        frame = render_frame(spec, int(FPS * 6.4))
        frame.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        x = pad + idx * (thumb_w + gap) + (thumb_w - frame.width) // 2
        y = pad + (thumb_h - frame.height) // 2
        sheet.paste(frame, (x, y))
        draw.text((pad + idx * (thumb_w + gap), pad + thumb_h + 6), spec.id, fill=(30, 30, 30), font=label_font)
    sheet.save(OUT / "contact-sheet-final-hold.png", quality=95)


def write_remotion_source() -> None:
    public_images = REMOTION / "public" / "images"
    src = REMOTION / "src"
    public_images.mkdir(parents=True, exist_ok=True)
    src.mkdir(parents=True, exist_ok=True)
    copied: set[str] = set()
    for spec in TEMPLATES:
        for rel in spec.images:
            target = public_images / Path(rel).name
            if str(target) not in copied:
                shutil.copy2(source_image_path(rel), target)
                copied.add(str(target))
    shutil.copy2(LOGO, REMOTION / "public" / "logo.png")
    compositions = []
    for spec in TEMPLATES:
        compositions.append(
            {
                "id": spec.id,
                "family": spec.family,
                "brand": spec.brand,
                "hook": spec.hook,
                "offer": spec.offer,
                "proof": spec.proof,
                "cta": spec.cta,
                "captionBeats": list(spec.caption_beats),
                "images": [Path(rel).name for rel in spec.images],
                "width": W,
                "height": H,
                "fps": FPS,
                "durationInFrames": TOTAL_FRAMES,
            }
        )
    (src / "templates.json").write_text(json.dumps(compositions, indent=2) + "\n", encoding="utf-8")
    (src / "Root.tsx").write_text(
        """import { Composition, Folder } from "remotion";
import data from "./templates.json";
import { SocialTemplate2026, type SocialTemplate2026Props } from "./SocialTemplate2026";

export const RemotionRoot = () => {
  const templates = data as SocialTemplate2026Props[];

  return (
    <Folder name="Yum-Social-2026">
      {templates.map((template) => (
        <Composition
          key={template.id}
          id={template.id}
          component={SocialTemplate2026}
          durationInFrames={template.durationInFrames}
          fps={template.fps}
          width={template.width}
          height={template.height}
          defaultProps={template}
        />
      ))}
    </Folder>
  );
};
""",
        encoding="utf-8",
    )
    (src / "SocialTemplate2026.tsx").write_text(
        """import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type SocialTemplate2026Props = {
  id: string;
  family: string;
  brand: "yum" | "patticake";
  hook: string;
  offer: string;
  proof: string;
  cta: string;
  captionBeats: string[];
  images: string[];
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
};

const red = "#E03A3E";
const ink = "#2D2D2D";
const body = "#5F5A5A";
const blue = "#CAE4FD";
const softBlue = "#AED2EF";

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const SocialTemplate2026 = (props: SocialTemplate2026Props) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const progress = frame / Math.max(1, durationInFrames - 1);
  const sceneIndex = progress < 0.35 ? 0 : progress < 0.68 ? 1 : 2;
  const hookIn = ease(frame, 0, 0.55 * fps);
  const offerIn = ease(frame, 3.6 * fps, 5.0 * fps);
  const logoCueIn = ease(frame, 4.95 * fps, 6.0 * fps);
  const imageScale = 1.04 + progress * 0.055;

  return (
    <AbsoluteFill style={{ backgroundColor: "white", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      <Img
        src={staticFile(`images/${props.images[sceneIndex]}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${imageScale}) translateX(${Math.sin(progress * Math.PI * 2) * 18}px)`,
        }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${blue}52, rgba(255,255,255,.05) 45%, rgba(180,33,43,.28))` }} />
      <Img src={staticFile("logo.png")} style={{ position: "absolute", left: 88, top: 252, width: 74, height: 74 }} />
      <div style={{ position: "absolute", left: 178, top: 276, color: "white", fontWeight: 700, fontSize: 27 }}>
        {props.brand === "patticake" ? "patticake" : "yum! Kitchen and Bakery"}
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 410 + (1 - hookIn) * 42,
          maxWidth: 840,
          background: "rgba(255,255,255,.94)",
          border: `4px solid ${red}`,
          borderLeft: `12px solid ${red}`,
          borderRadius: 22,
          boxShadow: `-14px 14px 0 ${softBlue}d6`,
          padding: "28px 32px",
          opacity: hookIn,
          color: ink,
          fontSize: 86,
          lineHeight: .98,
          fontWeight: 800,
          letterSpacing: 0,
        }}
      >
        {props.hook}
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 1068,
          background: `${softBlue}f0`,
          color: ink,
          border: "3px solid rgba(255,255,255,.86)",
          borderLeft: `12px solid ${red}`,
          borderRadius: 36,
          padding: "16px 32px",
          fontSize: 42,
          fontWeight: 800,
        }}
      >
        {props.captionBeats[sceneIndex]}
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 1190 + (1 - offerIn) * 52,
          width: 794,
          minHeight: 170,
          background: "rgba(255,255,255,.94)",
          borderRadius: 20,
          borderTop: `8px solid ${red}`,
          opacity: offerIn,
          padding: 28,
          boxSizing: "border-box",
        }}
      >
        <div style={{ color: ink, fontWeight: 800, fontSize: 40, lineHeight: 1.05 }}>{props.offer}</div>
        <div style={{ color: body, fontSize: 28, marginTop: 12 }}>{props.proof}</div>
        <div style={{ display: "inline-block", background: red, color: "white", borderRadius: 31, padding: "14px 35px", fontSize: 30, fontWeight: 800, marginTop: 30 }}>
          {props.cta}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 904 + (1 - logoCueIn) * 34,
          width: 794,
          minHeight: 138,
          background: "rgba(255,255,255,.93)",
          borderRadius: 20,
          borderTop: `8px solid ${red}`,
          opacity: logoCueIn,
          padding: "24px 28px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ color: red, fontWeight: 800, fontSize: 26 }}>yum! logo cue</div>
        <div style={{ color: ink, fontWeight: 800, fontSize: 30, marginTop: 7 }}>red circle + white lowercase mark</div>
        <div style={{ color: body, fontSize: 25, marginTop: 7 }}>Trocchi-style serif + narrow sans support</div>
      </div>
    </AbsoluteFill>
  );
};
""",
        encoding="utf-8",
    )
    (REMOTION / "package.json").write_text(
        json.dumps(
            {
                "scripts": {
                    "studio": "remotion studio src/Root.tsx",
                    "render:first": "remotion render src/Root.tsx patticake-gift-drop ../exports/video/remotion-patticake-gift-drop.mp4",
                },
                "dependencies": {
                    "@remotion/cli": "latest",
                    "remotion": "latest",
                    "typescript": "latest",
                },
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    (REMOTION / "README.md").write_text(
        """# Remotion source

Editable source for the 2026 social motion templates.

Run:

```bash
npm install
npm run studio
```

The source uses frame-driven motion, `staticFile()` assets, and a 1080x1920 vertical master.
""",
        encoding="utf-8",
    )


def clean() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    for folder in [OUT, DATA, GUIDES, VIDEO, COVERS, POSTERS_4X5, POSTERS_3X4, SQUARE]:
        folder.mkdir(parents=True, exist_ok=True)


def main() -> None:
    clean()
    write_derived_assets()
    write_guides()
    results = [write_video(spec) for spec in TEMPLATES]
    write_docs(results)
    write_remotion_source()
    write_review(results)
    write_final_hold_sheet()
    print(
        json.dumps(
            {
                "output": str(OUT),
                "templates": len(results),
                "fps": FPS,
                "durationSeconds": DURATION_SECONDS,
                "review": str(OUT / "review-board.html"),
                "contactSheet": str(OUT / "contact-sheet.png"),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
