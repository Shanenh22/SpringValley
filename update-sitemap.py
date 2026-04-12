#!/usr/bin/env python3
"""
update-sitemap.py — Spring Valley Dental Associates
Stamps each <lastmod> in sitemap.xml with the actual file modification date.
Run this from the site root before deploying:
    python3 update-sitemap.py

Requirements: none (stdlib only)
"""

import os
import re
from datetime import datetime, timezone

SITEMAP = "sitemap.xml"
BASE_URL = "https://springvalleydentistry.com/"

def url_to_filepath(url):
    """Convert a sitemap URL to a local file path."""
    path = url.replace(BASE_URL, "")
    if path == "" or path == "/":
        return "index.html"
    # Remove trailing slash
    path = path.rstrip("/")
    # If no extension, try .html
    if "." not in os.path.basename(path):
        path = path + ".html"
    return path

def get_mtime(filepath):
    """Return ISO-8601 date string for a file's modification time, or today if not found."""
    try:
        mtime = os.path.getmtime(filepath)
        dt = datetime.fromtimestamp(mtime, tz=timezone.utc)
        return dt.strftime("%Y-%m-%d")
    except FileNotFoundError:
        return datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")

with open(SITEMAP, "r", encoding="utf-8") as f:
    xml = f.read()

# Find all <url> blocks and update their <lastmod>
def replace_lastmod(match):
    block = match.group(0)
    loc_match = re.search(r"<loc>(.*?)</loc>", block)
    if not loc_match:
        return block
    url = loc_match.group(1).strip()
    filepath = url_to_filepath(url)
    mtime = get_mtime(filepath)
    # Replace or insert <lastmod>
    if "<lastmod>" in block:
        block = re.sub(r"<lastmod>.*?</lastmod>", f"<lastmod>{mtime}</lastmod>", block)
    else:
        block = block.replace("</url>", f"    <lastmod>{mtime}</lastmod>\n  </url>")
    return block

updated_xml = re.sub(r"<url>.*?</url>", replace_lastmod, xml, flags=re.DOTALL)

with open(SITEMAP, "w", encoding="utf-8") as f:
    f.write(updated_xml)

print(f"✅ sitemap.xml updated — {updated_xml.count('<lastmod>')} URLs stamped with real modification dates.")
