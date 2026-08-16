"""Visual regression helpers: deterministic element snapshots + pixel diffing.

Baselines live in tests/e2e/snapshots/<theme>/<name>.png and are committed.
Re-record them with:  E2E_UPDATE_SNAPSHOTS=1 python3 tests/e2e/test_visual_regression.py
Diff artifacts land in /tmp/browser/visual-diffs.
"""

import os

from PIL import Image, ImageChops

from harness import check, slug

SNAPSHOT_DIR = os.environ.get(
    "E2E_SNAPSHOT_DIR", os.path.join(os.path.dirname(__file__), "snapshots")
)
DIFF_DIR = os.environ.get("E2E_DIFF_DIR", "/tmp/browser/visual-diffs")
UPDATE = os.environ.get("E2E_UPDATE_SNAPSHOTS") in {"1", "true", "yes"}

# Allowed share of pixels that may differ (anti-aliasing, font hinting).
MAX_DIFF_RATIO = float(os.environ.get("E2E_MAX_DIFF_RATIO", "0.01"))
# Per-channel delta below this is treated as identical.
CHANNEL_TOLERANCE = 12

THEMES = ("dark", "light")

# Kill every animation/transition so skeleton shimmer and the orbiting loader
# ring cannot make snapshots flaky.
FREEZE_CSS = """
*, *::before, *::after {
  animation-play-state: paused !important;
  animation: none !important;
  transition: none !important;
  caret-color: transparent !important;
}
html { scroll-behavior: auto !important; }
"""


async def apply_theme(page, theme):
    """Force the document into the requested colour scheme."""
    await page.emulate_media(color_scheme=theme)
    await page.evaluate(
        """(theme) => {
            const root = document.documentElement;
            root.classList.toggle('dark', theme === 'dark');
            root.classList.toggle('light', theme === 'light');
            root.style.colorScheme = theme;
        }""",
        theme,
    )


async def freeze(page):
    await page.add_style_tag(content=FREEZE_CSS)
    # Let the paused frame settle before capturing.
    await page.wait_for_timeout(250)


def _baseline_path(theme, name):
    return os.path.join(SNAPSHOT_DIR, theme, f"{slug(name)}.png")


def _normalize(path_a, path_b):
    a = Image.open(path_a).convert("RGB")
    b = Image.open(path_b).convert("RGB")
    if a.size != b.size:
        size = (min(a.width, b.width), min(a.height, b.height))
        a = a.crop((0, 0, *size))
        b = b.crop((0, 0, *size))
    return a, b


def compare(baseline_path, actual_path, diff_path):
    """Return the ratio of pixels differing beyond CHANNEL_TOLERANCE."""
    base_img, actual_img = _normalize(baseline_path, actual_path)
    diff = ImageChops.difference(base_img, actual_img).convert("L")
    mask = diff.point(lambda v: 255 if v > CHANNEL_TOLERANCE else 0)
    changed = sum(1 for px in mask.getdata() if px)
    total = mask.width * mask.height or 1
    ratio = changed / total
    if ratio > 0:
        os.makedirs(os.path.dirname(diff_path), exist_ok=True)
        Image.merge("RGB", (mask, mask, mask)).save(diff_path)
    return ratio


async def snapshot(page, name, theme, locator=None):
    """Capture and diff one element (or the viewport) against its baseline."""
    baseline = _baseline_path(theme, name)
    os.makedirs(os.path.dirname(baseline), exist_ok=True)
    os.makedirs(DIFF_DIR, exist_ok=True)
    actual = os.path.join(DIFF_DIR, f"{theme}-{slug(name)}-actual.png")

    await freeze(page)
    target = locator if locator is not None else page
    if locator is not None:
        await locator.scroll_into_view_if_needed()
        await page.wait_for_timeout(120)
    await target.screenshot(path=actual)

    if UPDATE or not os.path.exists(baseline):
        Image.open(actual).save(baseline)
        print(f"      recorded baseline {theme}/{slug(name)}.png")
        return 0.0

    ratio = compare(baseline, actual, os.path.join(DIFF_DIR, f"{theme}-{slug(name)}-diff.png"))
    check(
        ratio <= MAX_DIFF_RATIO,
        f"{theme}/{slug(name)} drifted {ratio * 100:.2f}% "
        f"(limit {MAX_DIFF_RATIO * 100:.2f}%) — see {DIFF_DIR}",
    )
    return ratio
