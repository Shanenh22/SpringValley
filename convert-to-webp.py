#!/usr/bin/env python3
"""
convert-to-webp.py — Spring Valley Dental Associates
Converts all PNG/JPG/JPEG images in ./images/ to optimized WebP and updates
every HTML file's <img> src attributes to point to the .webp version.

Usage:
    pip install Pillow          # one-time install
    python3 convert-to-webp.py

What it does:
  1. Converts images/**.{png,jpg,jpeg} → images/**.webp at quality=82
  2. Updates ALL .html files: replaces src="images/foo.png" with src="images/foo.webp"
  3. Skips files that already have a .webp version and haven't changed
  4. Writes a summary report of size savings

The original files are NOT deleted — you can keep them as fallback or remove
manually once you're happy with results.
"""

import os
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("❌  Pillow not found. Run: pip install Pillow")

IMAGES_DIR = Path("images")
HTML_GLOB  = list(Path(".").glob("*.html")) + list(Path("es").glob("*.html"))
WEBP_QUALITY = 82   # 80-85 is visually lossless for dental photography
EXTENSIONS = {".png", ".jpg", ".jpeg"}

def human(n):
    return f"{n/1024:.0f} KB"

total_orig = 0
total_webp = 0
converted  = 0
skipped    = 0

print("── Converting images to WebP ──────────────────────────────────")

for img_path in sorted(IMAGES_DIR.iterdir()):
    if img_path.suffix.lower() not in EXTENSIONS:
        continue
    webp_path = img_path.with_suffix(".webp")

    # Skip if webp already exists and is newer
    if webp_path.exists() and webp_path.stat().st_mtime >= img_path.stat().st_mtime:
        skipped += 1
        continue

    try:
        orig_size = img_path.stat().st_size
        with Image.open(img_path) as im:
            # Preserve transparency for PNGs (RGBA)
            if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
                im = im.convert("RGBA")
            else:
                im = im.convert("RGB")
            im.save(webp_path, "WEBP", quality=WEBP_QUALITY, method=6)
        webp_size = webp_path.stat().st_size
        saving_pct = (1 - webp_size / orig_size) * 100
        print(f"  ✓ {img_path.name:<45} {human(orig_size):>8} → {human(webp_size):>8}  ({saving_pct:.0f}% smaller)")
        total_orig += orig_size
        total_webp += webp_size
        converted  += 1
    except Exception as ex:
        print(f"  ✗ {img_path.name}: {ex}")

print(f"\n── Updating HTML files ─────────────────────────────────────────")

REPLACE_PATTERN = re.compile(
    r"""(src\s*=\s*['"])(images/[^'"]+?)\.(png|jpg|jpeg)(\?[^'"]*)?(['"])""",
    re.IGNORECASE
)

def replacer(m):
    quote1, base, _ext, qs, quote2 = m.group(1), m.group(2), m.group(3), m.group(4) or "", m.group(5)
    return f"{quote1}{base}.webp{qs}{quote2}"

html_updated = 0
for html_path in HTML_GLOB:
    try:
        original = html_path.read_text(encoding="utf-8")
        updated  = REPLACE_PATTERN.sub(replacer, original)
        if updated != original:
            html_path.write_text(updated, encoding="utf-8")
            html_updated += 1
            print(f"  ✓ {html_path}")
    except Exception as ex:
        print(f"  ✗ {html_path}: {ex}")

print(f"""
── Summary ─────────────────────────────────────────────────────
  Images converted : {converted}
  Images skipped   : {skipped} (already up-to-date)
  HTML files updated: {html_updated}
  Original size    : {human(total_orig)}
  WebP size        : {human(total_webp)}
  Total savings    : {human(total_orig - total_webp)}  ({(1 - total_webp/total_orig)*100:.0f}% smaller)
""")
