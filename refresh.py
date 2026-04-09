#!/usr/bin/env python3
"""
HK Job Market Terminal — Data Refresh Script
Fetches latest macro data, news, and job listings, then writes data.js.
Designed to be run by a cron job or manually.

Usage:
  python3 refresh.py               # Full refresh (fetches everything)
  python3 refresh.py --dry-run     # Show what would be fetched without writing

Requires: requests, beautifulsoup4
"""

import json
import re
import sys
import os
from datetime import datetime, timezone, timedelta
from pathlib import Path

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Installing required packages...")
    os.system("pip install requests beautifulsoup4 -q")
    import requests
    from bs4 import BeautifulSoup

# ---- Config ----
HKT = timezone(timedelta(hours=8))
SCRIPT_DIR = Path(__file__).parent.resolve()
DATA_JS_PATH = SCRIPT_DIR / "data.js"
BACKUP_PATH = SCRIPT_DIR / "data.js.bak"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
}

# ---- Fetch Helpers ----
def safe_get(url, timeout=15):
    """Fetch a URL with error handling."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=timeout)
        resp.raise_for_status()
        return resp
    except Exception as e:
        print(f"  [WARN] Failed to fetch {url}: {e}")
        return None


def extract_number(text):
    """Extract a numeric value from text."""
    if not text:
        return None
    match = re.search(r'[\d,.]+', text.replace(',', ''))
    return match.group() if match else None


# ---- Data Fetchers ----

def fetch_trading_economics(indicator_url, prompt=None):
    """Fetch a value from Trading Economics."""
    resp = safe_get(indicator_url)
    if not resp:
        return None
    soup = BeautifulSoup(resp.text, 'html.parser')
    # Try multiple selectors for the headline value
    selectors = [
        '#ctl00_ContentPlaceHolder1_ctl00_ctl01_lblValue',
        '#ctl00_ContentPlaceHolder1_ctl00_ctl00_lblValue',
        '.te-data-value',
        '[id*="lblValue"]',
    ]
    for sel in selectors:
        val_el = soup.select_one(sel)
        if val_el:
            text = val_el.get_text(strip=True)
            # Only return if it looks like a number
            if re.search(r'\d', text) and len(text) < 20:
                return text
    # Fallback: look for the large number in the page title or og:description
    title = soup.select_one('title')
    if title:
        match = re.search(r'[\d.]+\s*%?', title.get_text())
        if match:
            return match.group()
    return None


def fetch_hsi():
    """Fetch Hang Seng Index value."""
    # Try Trading Economics page title first (more reliable than scraping JS-rendered pages)
    resp = safe_get("https://tradingeconomics.com/hong-kong/stock-market")
    if resp:
        soup = BeautifulSoup(resp.text, 'html.parser')
        title = soup.select_one('title')
        if title:
            # Title format: "Hong Kong Stock Market (HSI) - 24751.00 | ..."
            match = re.search(r'(\d{4,6}(?:\.\d+)?)', title.get_text())
            if match:
                val = match.group(1)
                # Format with commas
                num = float(val)
                if num > 1000:
                    return f"{num:,.0f}"
        # Also try og:description meta
        meta = soup.select_one('meta[property="og:description"]')
        if meta:
            match = re.search(r'(\d{4,6}(?:\.\d+)?)', meta.get('content', ''))
            if match:
                num = float(match.group(1))
                if num > 1000:
                    return f"{num:,.0f}"
    return None


def fetch_kpi_data(current_kpis):
    """
    Fetch latest KPI values. Falls back to current values if fetch fails.
    Returns updated KPI_DATA list.
    """
    print("Fetching KPI data...")
    updated = [dict(k) for k in current_kpis]  # deep copy

    # Map of KPI label -> (fetch_function, source_url)
    fetchers = {
        "Unemployment": ("https://tradingeconomics.com/hong-kong/unemployment-rate", "C&SD", "https://www.censtatd.gov.hk/en/scode210.html"),
        "CPI Inflation": ("https://tradingeconomics.com/hong-kong/inflation-cpi", "HKSAR Govt", "https://www.hkeconomy.gov.hk/en/situation/development/index.htm"),
        "Hang Seng": (None, "HSI", "https://www.hsi.com.hk"),
        "US Fed Rate": ("https://tradingeconomics.com/united-states/interest-rate", "Federal Reserve", "https://www.federalreserve.gov"),
    }

    for kpi in updated:
        label = kpi["label"]
        if label in fetchers:
            url, src, src_url = fetchers[label]
            if label == "Hang Seng":
                val = fetch_hsi()
            elif url:
                val = fetch_trading_economics(url)
            else:
                val = None

            if val:
                print(f"  {label}: {val}")
                kpi["value"] = val
                kpi["source"] = src
                kpi["sourceUrl"] = src_url
            else:
                print(f"  {label}: keeping current value ({kpi['value']})")

    return updated


def fetch_news_from_gis():
    """Fetch latest press releases from info.gov.hk."""
    print("Fetching GIS press releases...")
    news = []
    resp = safe_get("https://www.info.gov.hk/gia/general/today.htm")
    if not resp:
        return news

    soup = BeautifulSoup(resp.text, 'html.parser')
    links = soup.select('a[href*="/gia/general/"]')
    today = datetime.now(HKT).strftime("%Y-%m-%d")

    for link in links[:10]:
        title = link.get_text(strip=True)
        href = link.get("href", "")
        if not title or len(title) < 10:
            continue
        # Check if labour/employment related
        keywords = ["就業", "招聘", "勞工", "培訓", "employment", "labour", "hiring",
                     "job", "recruitment", "wage", "salary", "workforce", "talent"]
        if any(kw.lower() in title.lower() for kw in keywords):
            full_url = "https://www.info.gov.hk" + href if href.startswith("/") else href
            news.append({
                "headline": title,
                "date": today,
                "source": "政府新聞公報 (info.gov.hk)",
                "url": full_url,
                "category": "LOCAL EMPLOYMENT",
                "impact": title,
                "sentiment": "neutral"
            })
    print(f"  Found {len(news)} employment-related GIS releases")
    return news


def fetch_rthk_news():
    """Fetch latest RTHK business/employment news."""
    print("Fetching RTHK news...")
    news = []
    resp = safe_get("https://news.rthk.hk/rthk/en/component/k2/1.htm")
    if not resp:
        return news

    soup = BeautifulSoup(resp.text, 'html.parser')
    articles = soup.select('.news-list a, .articleList a')
    today = datetime.now(HKT).strftime("%Y-%m-%d")

    keywords = ["employment", "job", "hiring", "unemployment", "wage", "labour",
                 "tariff", "trade", "gdp", "economy", "fintech", "ai", "data",
                 "finance", "banking", "property", "inflation"]

    for a in articles[:20]:
        title = a.get_text(strip=True)
        href = a.get("href", "")
        if not title or len(title) < 10:
            continue
        if any(kw.lower() in title.lower() for kw in keywords):
            full_url = href if href.startswith("http") else "https://news.rthk.hk" + href
            news.append({
                "headline": title,
                "date": today,
                "source": "RTHK",
                "url": full_url,
                "category": "GLOBAL",
                "impact": title,
                "sentiment": "neutral"
            })
    print(f"  Found {len(news)} relevant RTHK articles")
    return news


# ---- data.js Writer ----

def js_string(s):
    """Escape a string for JS."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")


def write_data_js(meta, kpis, signals, hk_macro, global_data, news, jobs):
    """Write all data arrays to data.js."""

    # Backup existing
    if DATA_JS_PATH.exists():
        import shutil
        shutil.copy2(DATA_JS_PATH, BACKUP_PATH)
        print(f"Backed up existing data.js to data.js.bak")

    lines = [
        "// ============================================",
        "// HK Job Market Terminal — Data Layer",
        "// All dashboard data lives here. Regenerated by refresh.py",
        "// ============================================",
        ""
    ]

    # META
    lines.append(f'const META = {{')
    lines.append(f'  updated: "{js_string(meta["updated"])}",')
    lines.append(f'  version: "{js_string(meta["version"])}"')
    lines.append(f'}};')
    lines.append('')

    # Helper to write an array of objects
    def write_array(name, data, fields):
        lines.append(f'const {name} = [')
        for i, item in enumerate(data):
            lines.append('  {')
            for j, (key, default) in enumerate(fields):
                val = item.get(key, default)
                if isinstance(val, str):
                    lines.append(f'    {key}: "{js_string(val)}"{"," if j < len(fields)-1 else ""}')
                elif isinstance(val, bool):
                    lines.append(f'    {key}: {"true" if val else "false"}{"," if j < len(fields)-1 else ""}')
                else:
                    lines.append(f'    {key}: {json.dumps(val)}{"," if j < len(fields)-1 else ""}')
            comma = ',' if i < len(data) - 1 else ''
            lines.append(f'  }}{comma}')
        lines.append('];')
        lines.append('')

    # KPI_DATA
    kpi_fields = [("label",""), ("value",""), ("delta",""), ("deltaClass","neutral"),
                  ("period",""), ("source",""), ("sourceUrl",""), ("valueClass","")]
    write_array("KPI_DATA", kpis, kpi_fields)

    # SIGNAL_DATA
    signal_fields = [("title",""), ("desc",""), ("sentiment","neutral"),
                     ("sourceLabel",""), ("sourceUrl","")]
    write_array("SIGNAL_DATA", signals, signal_fields)

    # HK_MACRO_DATA
    macro_fields = [("indicator",""), ("current",""), ("currentClass",""),
                    ("previous",""), ("trend",""), ("trendClass","neutral"),
                    ("implication",""), ("sourceLabel",""), ("sourceUrl","")]
    write_array("HK_MACRO_DATA", hk_macro, macro_fields)

    # GLOBAL_DATA
    write_array("GLOBAL_DATA", global_data, macro_fields)

    # NEWS_DATA
    news_fields = [("headline",""), ("date",""), ("source",""), ("url",""),
                   ("category",""), ("impact",""), ("sentiment","neutral")]
    write_array("NEWS_DATA", news, news_fields)

    # JOBS_DATA
    jobs_fields = [("title",""), ("company",""), ("location",""), ("salary",""),
                   ("desc",""), ("source",""), ("url",""), ("posted","")]
    write_array("JOBS_DATA", jobs, jobs_fields)

    content = "\n".join(lines) + "\n"
    DATA_JS_PATH.write_text(content, encoding="utf-8")
    print(f"Wrote {DATA_JS_PATH} ({len(content):,} bytes)")
    return content


# ---- Main ----

def load_current_data():
    """Parse existing data.js to get current values as fallback."""
    content = DATA_JS_PATH.read_text(encoding="utf-8")
    # Use a simple approach: eval via Node.js
    import subprocess
    result = subprocess.run(
        ["node", "-e", f"""
        const fs = require('fs');
        let c = fs.readFileSync('{DATA_JS_PATH}', 'utf8').replace(/const /g, 'var ');
        eval(c);
        console.log(JSON.stringify({{
            META, KPI_DATA, SIGNAL_DATA, HK_MACRO_DATA, GLOBAL_DATA, NEWS_DATA, JOBS_DATA
        }}));
        """],
        capture_output=True, text=True, timeout=10
    )
    if result.returncode != 0:
        print(f"  [WARN] Failed to parse current data.js: {result.stderr}")
        return None
    return json.loads(result.stdout)


def main():
    dry_run = "--dry-run" in sys.argv

    print("=" * 50)
    print("HK Job Market Terminal — Data Refresh")
    print(f"Time: {datetime.now(HKT).strftime('%Y-%m-%d %H:%M HKT')}")
    print("=" * 50)

    # Load current data as fallback
    print("\nLoading current data.js...")
    current = load_current_data()
    if not current:
        print("FATAL: Cannot parse current data.js. Aborting.")
        sys.exit(1)

    # Update META timestamp
    now = datetime.now(HKT)
    meta = {
        "updated": now.strftime("%d %b %Y %H:%M HKT"),
        "version": current["META"]["version"]
    }
    print(f"\nNew timestamp: {meta['updated']}")

    # Fetch updated KPI values
    kpis = fetch_kpi_data(current["KPI_DATA"])

    # Fetch new news items
    new_news = []
    new_news.extend(fetch_news_from_gis())
    new_news.extend(fetch_rthk_news())

    # Merge new news with existing, dedup by URL
    existing_urls = {n["url"] for n in current["NEWS_DATA"]}
    added_news = [n for n in new_news if n["url"] not in existing_urls]
    all_news = added_news + current["NEWS_DATA"]
    # Keep latest 80 items max
    all_news.sort(key=lambda n: n.get("date", ""), reverse=True)
    all_news = all_news[:80]
    print(f"\nNews: {len(added_news)} new + {len(current['NEWS_DATA'])} existing = {len(all_news)} total")

    # Signals, macro tables, and jobs: keep current (manual/cron research updates these)
    signals = current["SIGNAL_DATA"]
    hk_macro = current["HK_MACRO_DATA"]
    global_data = current["GLOBAL_DATA"]
    jobs = current["JOBS_DATA"]

    if dry_run:
        print("\n[DRY RUN] Would write data.js with above changes. Exiting.")
        return

    # Write data.js
    print("\nWriting data.js...")
    write_data_js(meta, kpis, signals, hk_macro, global_data, all_news, jobs)

    print("\nDone! Dashboard data refreshed.")
    print(f"Backup saved to: {BACKUP_PATH}")


if __name__ == "__main__":
    main()
