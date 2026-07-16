#!/usr/bin/env python3
from __future__ import annotations

import csv
import hashlib
import json
import shutil
import subprocess
import sys
from dataclasses import replace
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit


ROOT = Path(__file__).resolve().parents[2]
SOCIAL = ROOT / "social"
SOURCE = SOCIAL / "yum-social-motion-template-2026"
OUT = SOCIAL / "yum-social-launch-batch-2026-07"
DATA = OUT / "data"
VIDEO = OUT / "exports" / "9x16-video"
FEED = OUT / "exports" / "4x5-feed"
STORY = OUT / "exports" / "story"
COPY = OUT / "copy"
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

sys.path.insert(0, str(SOCIAL / "scripts"))
import build_2026_social_motion_template as motion  # noqa: E402


CAMPAIGN = "yum_social_launch_2026_07"
VERSION = "v01"

ASSETS: list[dict[str, Any]] = [
    {
        "id": "yum-lunch-decision",
        "brand": "yum!",
        "lane": "local order",
        "objective": "Drive completed local order sessions.",
        "destination": "https://yumkitchen.com/order",
        "cta": "Order Online",
        "caption": "First yum! lunch? Start with what sounds good, then choose the Twin Cities kitchen on today's route. Breakfast, lunch, dinner, and bakery are all on the current menu.",
        "hashtags": "#yumKitchen #TwinCitiesEats #MadeFromScratch",
        "bestChannels": "Instagram Reels, TikTok, YouTube Shorts, Meta paid",
        "primaryMetric": "completed order sessions",
        "publishDay": 1,
        "paidHeadline": "Lunch is handled",
        "storyLinkLabel": "Order Online",
        "approvalGate": "Confirm the destination and use only current menu footage.",
    },
    {
        "id": "yum-four-kitchens",
        "brand": "yum!",
        "lane": "four locations",
        "objective": "Drive location discovery and nearby order starts.",
        "destination": "https://yumkitchen.com/yum-kitchen#locations",
        "cta": "Find Your yum!",
        "caption": "Four Twin Cities kitchens: St. Louis Park, Shady Oak, St. Paul, and Woodbury. Pick the location that works for today's order.",
        "hashtags": "#yumKitchen #TwinCitiesRestaurants #MinnesotaFood",
        "bestChannels": "Instagram Reels, Facebook, Stories, local Meta paid",
        "primaryMetric": "location page clicks",
        "publishDay": 5,
        "paidHeadline": "Pick your kitchen",
        "storyLinkLabel": "Find a Location",
        "approvalGate": "Confirm all four location pages and order routes are live.",
    },
    {
        "id": "yum-catering-room",
        "brand": "yum!",
        "lane": "catering leads",
        "objective": "Drive qualified catering inquiries.",
        "destination": "https://yumkitchen.com/catering#inquiry",
        "cta": "Start a Catering Note",
        "caption": "The meeting is booked. Lunch should be too. Start a catering note with the date, group size, pickup kitchen, and what the room needs.",
        "hashtags": "#yumKitchen #TwinCitiesCatering #OfficeCatering",
        "bestChannels": "Instagram Reels, LinkedIn, Facebook, Meta lead ads",
        "primaryMetric": "qualified catering inquiries",
        "publishDay": 9,
        "paidHeadline": "Feed the room",
        "storyLinkLabel": "Plan Catering",
        "approvalGate": "Confirm catering notice language, pickup scope, and lead owner.",
    },
    {
        "id": "patticake-gift-drop",
        "brand": "Patticake",
        "lane": "gifting",
        "objective": "Drive Patticake order starts and gift demand.",
        "destination": "https://patticake.com/patticake",
        "cta": "Send a Patticake",
        "caption": "Send cake, not a card. Add the note, choose the current pickup or delivery path, and give them something meant to be shared.",
        "hashtags": "#Patticake #SendACake #ThankYouGift",
        "bestChannels": "Instagram Reels, TikTok, YouTube Shorts, Meta paid",
        "primaryMetric": "Patticake order starts",
        "publishDay": 3,
        "paidHeadline": "Send cake, not a card",
        "storyLinkLabel": "Send a Cake",
        "approvalGate": "Confirm the live Patticake destination and current delivery options.",
    },
    {
        "id": "patticake-birthday-first-slice",
        "brand": "Patticake",
        "lane": "birthday cake",
        "objective": "Drive birthday cake orders or requests.",
        "destination": "https://patticake.com/order-a-cake",
        "cta": "Plan the Cake",
        "caption": "A birthday cake that does not feel like a backup plan. Share the date, message, and pickup or delivery details to start.",
        "hashtags": "#Patticake #BirthdayCake #TwinCitiesCakes",
        "bestChannels": "Instagram Reels, TikTok, Stories, Meta paid",
        "primaryMetric": "birthday cake request completions",
        "publishDay": 7,
        "paidHeadline": "Birthday cake, handled",
        "storyLinkLabel": "Plan the Cake",
        "approvalGate": "Confirm whether the production flow should say order or request for each route.",
    },
    {
        "id": "patticake-event-inquiry",
        "brand": "Patticake",
        "lane": "weddings and events",
        "objective": "Drive qualified event cake inquiries.",
        "destination": "https://patticake.com/order-a-cake",
        "cta": "Start an Event Inquiry",
        "caption": "Cake for the table you planned. Start the inquiry with the date, occasion, and details the bakery team should see.",
        "hashtags": "#Patticake #TwinCitiesWedding #EventCake",
        "bestChannels": "Instagram Reels, Pinterest video, Stories, Meta paid",
        "primaryMetric": "qualified event cake inquiries",
        "publishDay": 11,
        "paidHeadline": "Cake for the table",
        "storyLinkLabel": "Start an Inquiry",
        "approvalGate": "Confirm event scope, service area, lead owner, and approved inquiry language.",
    },
]


def tracked_url(base: str, source: str, medium: str, asset_id: str) -> str:
    parts = urlsplit(base)
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    query.update(
        {
            "utm_source": source,
            "utm_medium": medium,
            "utm_campaign": CAMPAIGN,
            "utm_content": f"{asset_id}_{VERSION}",
        }
    )
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def write_text(rel: str, value: str) -> Path:
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value.rstrip() + "\n", encoding="utf-8")
    return path


def write_json(rel: str, value: Any) -> Path:
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    return path


def table(headers: list[str], rows: list[list[Any] | tuple[Any, ...]]) -> str:
    def cell(value: Any) -> str:
        return str(value).replace("|", "\\|").replace("\n", "<br>")

    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join("---" for _ in headers) + " |",
    ]
    lines.extend("| " + " | ".join(cell(value) for value in row) + " |" for row in rows)
    return "\n".join(lines)


def probe_video(path: Path) -> dict[str, Any]:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height,r_frame_rate",
            "-show_entries",
            "format=duration",
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    payload = json.loads(result.stdout)
    stream = payload["streams"][0]
    return {
        "width": stream["width"],
        "height": stream["height"],
        "fps": stream["r_frame_rate"],
        "durationSeconds": float(payload["format"]["duration"]),
    }


def clean() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    for folder in [OUT, DATA, VIDEO, FEED, STORY, COPY]:
        folder.mkdir(parents=True, exist_ok=True)


def build_exports() -> list[dict[str, Any]]:
    specs = {spec.id: spec for spec in motion.TEMPLATES}
    results: list[dict[str, Any]] = []

    for index, asset in enumerate(ASSETS, start=1):
        asset_id = asset["id"]
        if asset_id not in specs:
            raise KeyError(f"missing motion template: {asset_id}")
        spec = specs[asset_id]
        source_video = SOURCE / "exports" / "video" / f"{asset_id}.mp4"
        if not source_video.exists():
            raise FileNotFoundError(source_video)

        stem = f"{index:02d}-{asset_id}-{VERSION}"
        video_path = VIDEO / f"{stem}-9x16.mp4"
        feed_path = FEED / f"{stem}-4x5.png"
        story_path = STORY / f"{stem}-story.png"
        shutil.copy2(source_video, video_path)

        display_spec = spec
        if asset_id == "yum-four-kitchens":
            display_spec = replace(
                spec,
                images=("@derived/yum-four-kitchens-grid.jpg",) * 3,
                anchors=((0.5, 0.5),) * 3,
            )

        final_frame = motion.render_frame(display_spec, int(motion.FPS * 6.4))
        final_frame.save(story_path, quality=96)
        final_frame.crop((0, 210, 1080, 1560)).save(feed_path, quality=96)

        organic_url = tracked_url(asset["destination"], "instagram", "organic_social", asset_id)
        paid_url = tracked_url(asset["destination"], "meta", "paid_social", asset_id)
        final_caption = f"{asset['caption']}\n\n{asset['cta']}: {organic_url}\n\n{asset['hashtags']}"
        video_probe = probe_video(video_path)
        if video_probe != {"width": 1080, "height": 1920, "fps": "30/1", "durationSeconds": 8.0}:
            raise ValueError(f"unexpected video probe for {asset_id}: {video_probe}")

        for image_path, expected in [(feed_path, (1080, 1350)), (story_path, (1080, 1920))]:
            with motion.Image.open(image_path) as image:
                if image.size != expected:
                    raise ValueError(f"unexpected image size for {image_path}: {image.size}")

        results.append(
            {
                **asset,
                "index": index,
                "hook": spec.hook,
                "organicUrl": organic_url,
                "paidUrl": paid_url,
                "finalCaption": final_caption,
                "outputs": {
                    "video9x16": str(video_path.relative_to(OUT)),
                    "feed4x5": str(feed_path.relative_to(OUT)),
                    "story": str(story_path.relative_to(OUT)),
                },
                "videoProbe": video_probe,
                "sourceTemplate": f"../yum-social-motion-template-2026/remotion/src/templates.json#{asset_id}",
            }
        )
    return results


def write_copy(results: list[dict[str, Any]]) -> None:
    caption_fields = [
        "asset_id",
        "brand",
        "lane",
        "hook",
        "caption",
        "cta",
        "organic_url",
        "paid_url",
        "paid_headline",
        "best_channels",
        "primary_metric",
        "approval_gate",
        "status",
    ]
    with (COPY / "launch-captions.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=caption_fields)
        writer.writeheader()
        for item in results:
            writer.writerow(
                {
                    "asset_id": item["id"],
                    "brand": item["brand"],
                    "lane": item["lane"],
                    "hook": item["hook"],
                    "caption": item["finalCaption"],
                    "cta": item["cta"],
                    "organic_url": item["organicUrl"],
                    "paid_url": item["paidUrl"],
                    "paid_headline": item["paidHeadline"],
                    "best_channels": item["bestChannels"],
                    "primary_metric": item["primaryMetric"],
                    "approval_gate": item["approvalGate"],
                    "status": "production-ready, operational gate pending where noted",
                }
            )

    caption_doc = ["# launch captions", ""]
    for item in results:
        caption_doc.extend(
            [
                f"## {item['index']}. {item['hook']}",
                "",
                item["finalCaption"],
                "",
                f"Paid headline: {item['paidHeadline']}",
                f"Paid URL: {item['paidUrl']}",
                f"Primary metric: {item['primaryMetric']}",
                f"Approval gate: {item['approvalGate']}",
                "",
            ]
        )
    write_text("copy/launch-captions.md", "\n".join(caption_doc))


def write_plan(results: list[dict[str, Any]]) -> None:
    by_day = {item["publishDay"]: item for item in results}
    rows = [
        (1, "yum!", by_day[1]["hook"], "Instagram Reel + TikTok", by_day[1]["cta"], by_day[1]["primaryMetric"], "Publish anchor video and add the Story link frame."),
        (2, "yum!", "local order follow-up", "Stories", "Order Online", "story link taps", "Use the 9:16 Story export and current menu reminder."),
        (3, "Patticake", by_day[3]["hook"], "Instagram Reel + TikTok", by_day[3]["cta"], by_day[3]["primaryMetric"], "Confirm current delivery options before posting."),
        (4, "Patticake", "gift note follow-up", "Stories", "Send a Cake", "story link taps", "Use note and date language from the approved caption."),
        (5, "yum!", by_day[5]["hook"], "Instagram Reel + Facebook", by_day[5]["cta"], by_day[5]["primaryMetric"], "Tag the four-location guide, not one location order link."),
        (6, "yum!", "which yum! is on your route?", "Stories", "Find a Location", "poll votes and link taps", "Use a location poll, then the tracked link frame."),
        (7, "Patticake", by_day[7]["hook"], "Instagram Reel + TikTok", by_day[7]["cta"], by_day[7]["primaryMetric"], "Confirm order versus request language."),
        (8, "Patticake", "date + message reminder", "Stories", "Plan the Cake", "story link taps", "Use the birthday Story export with a native link sticker."),
        (9, "yum!", by_day[9]["hook"], "Instagram Reel + LinkedIn", by_day[9]["cta"], by_day[9]["primaryMetric"], "Post only after catering scope and lead owner are confirmed."),
        (10, "yum!", "meeting lunch checklist", "Stories + LinkedIn follow-up", "Start a Catering Note", "qualified inquiry starts", "Use date, group size, pickup kitchen, and room needs."),
        (11, "Patticake", by_day[11]["hook"], "Instagram Reel + Pinterest video", by_day[11]["cta"], by_day[11]["primaryMetric"], "Post only after event scope and inquiry language are confirmed."),
        (12, "Patticake", "event date follow-up", "Stories", "Start an Inquiry", "story link taps", "Use date, occasion, and details as the three-frame sequence."),
        (13, "both", "creative review", "Internal", "Select winners", "3-second hold, saves, qualified clicks", "Choose the strongest hook in each business lane. Do not compare raw views alone."),
        (14, "both", "controlled paid launch", "Meta paid", "Objective-matched CTA", "cost per completed order or qualified lead", "Launch only operationally approved winners with paid URLs and converter exclusions."),
    ]
    write_text(
        "two-week-launch-plan.md",
        "# two-week launch plan\n\n" + table(["Day", "Brand", "Concept", "Channel", "CTA", "Measure", "Production note"], rows),
    )


def write_support_docs(results: list[dict[str, Any]]) -> None:
    approval_rows = [(item["id"], item["lane"], item["approvalGate"], item["cta"], item["destination"]) for item in results]
    write_text(
        "publishing-checklist.md",
        """# publishing checklist

- [ ] Correct brand, hook, CTA, destination, and UTM.
- [ ] Operational gate in the table below is confirmed by the owner.
- [ ] Video is 1080x1920, 30 fps, 8 seconds, with text inside the safe zone.
- [ ] Feed export is 1080x1350 and Story export is 1080x1920.
- [ ] Text cards use Yum white, red, and blue, not black or pink-tinted panels.
- [ ] Caption contains no placeholder, unsupported date, price, hour, capacity, delivery, dietary, or customization claim.
- [ ] Music and talent rights cover the intended organic or paid use.
- [ ] Alt text is prepared from the real image content.
- [ ] Native Story link sticker is placed without covering the in-image CTA.
- [ ] Paid launch excludes recent converters and uses the paid URL.

## asset gates

"""
        + table(["Asset", "Lane", "Required confirmation", "CTA", "Destination"], approval_rows),
    )
    write_text(
        "provenance.md",
        """# source and media provenance

- All visual media comes from the approved local website photography in `yumkitchen-web/public/images`.
- Exact copy, CTA, logo placement, dimensions, safe zones, crops, and filenames are deterministic.
- No ImageGen layer was used. Food, cake, locations, packaging, staff, and event imagery remain real source photography.
- Video masters are generated by `social/scripts/build_2026_social_motion_template.py` with editable Remotion source in `social/yum-social-motion-template-2026/remotion`.
- This launch pack is assembled by `social/scripts/build_social_launch_batch.py`.
""",
    )


def write_review(results: list[dict[str, Any]]) -> None:
    review = []
    for item in results:
        review.append(
            {
                "id": item["id"],
                "index": item["index"],
                "title": item["hook"],
                "label": item["lane"],
                "src": item["outputs"]["story"],
                "href": item["outputs"]["video9x16"],
                "caption": f"{item['brand']} / {item['cta']} / day {item['publishDay']}",
                "family": item["lane"],
                "bestFor": item["bestChannels"],
            }
        )
    review_path = write_json("data/review-manifest.json", review)
    options_path = write_json(
        "data/review-options.json",
        {
            "title": "yum! and Patticake six-asset launch batch",
            "summary": "Six conversion-ready campaign lanes with 9:16 video, 4:5 feed, Story, final copy, and tracked destinations.",
            "preset": "image-wall",
            "showCaptions": True,
            "contactSheetOutput": "contact-sheet.png",
        },
    )
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


def write_readme(results: list[dict[str, Any]]) -> None:
    rows = [
        (item["index"], item["brand"], item["lane"], item["hook"], item["cta"], item["primaryMetric"], item["publishDay"])
        for item in results
    ]
    write_text(
        "README.md",
        """# yum! and Patticake six-asset launch batch

Six conversion-ready campaign lanes built from approved real photography and the 2026 motion system.

## output

- 6 MP4 masters in `exports/9x16-video`.
- 6 feed cards in `exports/4x5-feed`.
- 6 Story cards in `exports/story`.
- Final organic captions, paid headlines, organic URLs, and paid URLs in `copy`.
- A 14-day launch sequence in `two-week-launch-plan.md`.
- Approval gates in `publishing-checklist.md`.
- Review surface, contact sheet, manifest, and checksums.

## launch assets

"""
        + table(["#", "Brand", "Lane", "Hook", "CTA", "Primary metric", "Publish day"], rows)
        + """

## production rule

The files are visually finished. Assets with an operational gate remain production-ready but must not be published or promoted until that specific fact is confirmed.
""",
    )


def write_manifest(results: list[dict[str, Any]]) -> Path:
    exports = []
    for path in sorted((OUT / "exports").rglob("*")):
        if path.is_file():
            exports.append(
                {
                    "path": str(path.relative_to(OUT)),
                    "bytes": path.stat().st_size,
                    "sha256": sha256(path),
                }
            )
    manifest = {
        "name": "yum! and Patticake six-asset launch batch",
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "campaign": CAMPAIGN,
        "version": VERSION,
        "status": "production-ready, operational gates pending where noted",
        "counts": {"campaignLanes": len(results), "video9x16": 6, "feed4x5": 6, "story": 6, "totalExports": len(exports)},
        "utmTemplate": "utm_source={platform}&utm_medium={organic_social|paid_social}&utm_campaign=yum_social_launch_2026_07&utm_content={asset_id}_v01",
        "assets": results,
        "exports": exports,
        "source": {
            "motionPack": "../yum-social-motion-template-2026",
            "builder": "../scripts/build_social_launch_batch.py",
            "approvedMedia": "../../yumkitchen-web/public/images",
            "imageGenerationUsed": False,
        },
        "primaryReview": "data/stream.json",
    }
    return write_json("manifest.json", manifest)


def validate_text() -> None:
    for path in list(OUT.rglob("*.md")) + list(OUT.rglob("*.csv")) + list(OUT.rglob("*.json")):
        if "\u2014" in path.read_text(encoding="utf-8"):
            raise ValueError(f"em dash found in {path}")
    if len(list(VIDEO.glob("*.mp4"))) != 6:
        raise ValueError("expected six 9:16 videos")
    if len(list(FEED.glob("*.png"))) != 6:
        raise ValueError("expected six 4:5 feed exports")
    if len(list(STORY.glob("*.png"))) != 6:
        raise ValueError("expected six Story exports")


def main() -> None:
    clean()
    results = build_exports()
    write_copy(results)
    write_plan(results)
    write_support_docs(results)
    write_readme(results)
    write_json("data/launch-spec.json", results)
    write_review(results)
    validate_text()
    manifest = write_manifest(results)
    print(
        json.dumps(
            {
                "output": str(OUT),
                "manifest": str(manifest),
                "campaignLanes": len(results),
                "totalExports": 18,
                "review": str(OUT / "review-board.html"),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
