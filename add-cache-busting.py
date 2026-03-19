#!/usr/bin/env python3
"""
Cache-busting script for Spring Valley Dental site.
Run this before EVERY deployment to force browsers to load fresh assets.

Handles:
  - CSS/JS: href="file.css" → href="file.css?v=YYYYMMDD"
  - Hero preload: href="images/hero-background.png" → href="images/hero-background.png?v=YYYYMMDD"
  - Hero inline style: url('images/hero-background.png') → url('images/hero-background.png?v=YYYYMMDD')
  - Hero CSS in <style> blocks: url('images/hero-background.png') → versioned
  - OG/Twitter meta image tags: content="https://...hero-background.png" → versioned
  - Strips any previous ?v= before adding new one
"""

import os
import re
from datetime import datetime

SITE_DIR = "/home/claude/sv16/SpringValley_New/SpringValley - Copy"
VERSION = datetime.now().strftime("%Y%m%d")

# ── Pattern 1: CSS and JS asset links ─────────────────────────────────────────
ASSET_PATTERN = re.compile(
    r'((?:href|src)=")([^"]*\.(?:css|js))(?:\?v=[^"]*)?(")',
    re.IGNORECASE
)

# ── Pattern 2: <link rel="preload" href="images/hero-background.png"> ─────────
PRELOAD_PATTERN = re.compile(
    r'(href=")([^"]*hero-background\.png)(?:\?v=[^"]*)?(")',
    re.IGNORECASE
)

# ── Pattern 3: inline style background-image: url('images/hero-background.png')
STYLE_URL_PATTERN = re.compile(
    r"(url\(['\"]?)([^'\")\s]*hero-background\.png)(\?v=[^'\")\s]*)?((?:['\"]?)\))",
    re.IGNORECASE
)

# ── Pattern 4: OG / Twitter meta content="https://...hero-background.png" ────
META_IMAGE_PATTERN = re.compile(
    r'(content="https://[^"]*hero-background\.png)(?:\?v=[^"]*)?(")',
    re.IGNORECASE
)

def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        original = f.read()

    updated = original

    # Apply all patterns
    updated = ASSET_PATTERN.sub(
        lambda m: f'{m.group(1)}{m.group(2)}?v={VERSION}{m.group(3)}',
        updated
    )
    updated = PRELOAD_PATTERN.sub(
        lambda m: f'{m.group(1)}{m.group(2)}?v={VERSION}{m.group(3)}',
        updated
    )
    updated = STYLE_URL_PATTERN.sub(
        lambda m: f'{m.group(1)}{m.group(2)}?v={VERSION}{m.group(4)}',
        updated
    )
    updated = META_IMAGE_PATTERN.sub(
        lambda m: f'{m.group(1)}?v={VERSION}{m.group(2)}',
        updated
    )

    if updated != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(updated)
        return True
    return False

html_files = [
    os.path.join(root, fname)
    for root, _, files in os.walk(SITE_DIR)
    for fname in files
    if fname.endswith(".html")
]

changed = 0
for path in sorted(html_files):
    if process_file(path):
        changed += 1
        print(f"  ✓ {os.path.basename(path)}")

print(f"\nDone. Cache-busted {changed}/{len(html_files)} HTML files with ?v={VERSION}")
