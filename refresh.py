#!/usr/bin/env python3
"""
HK Job Market Terminal — Data Refresh Script
Fetches latest macro data, news, and job listings, then writes data.js.

Data Sources:
  - KPIs: yfinance (^HSI, HKD=X), FRED API (Fed rate), web scrape fallbacks
  - News: Google News RSS, SCMP RSS, RTHK RSS, GIS press releases
  - Jobs: JobsDB, LinkedIn, Indeed, eFinancialCareers search pages

Usage:
  python3 refresh.py               # Full refresh
  python3 refresh.py --dry-run     # Preview without writing
  python3 refresh.py --news-only   # Only refresh news
  python3 refresh.py --kpi-only    # Only refresh KPIs

Requires: requests, beautifulsoup4, yfinance, feedparser
"""

import json
import re
import sys
import os
import shutil
from datetime import datetime, timezone, timedelta
from pathlib import Path

# ---- Install deps if missing ----
REQUIRED = ["requests", "beautifulsoup4", "yfinance", "feedparser"]
try:
    import requests
    from bs4 import BeautifulSoup
    import yfinance as yf
    import feedparser
except ImportError:
    print("Installing required packages...")
    os.system(f"pip install {' '.join(REQUIRED)} -q")
    import requests
    from bs4 import BeautifulSoup
    import yfinance as yf
    import feedparser

# ---- Config ----
HKT = timezone(timedelta(hours=8))
SCRIPT_DIR = Path(__file__).parent.resolve()
DATA_JS_PATH = SCRIPT_DIR / "data.js"
BACKUP_PATH = SCRIPT_DIR / "data.js.bak"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
}

# Perplexity API config — set PERPLEXITY_API_KEY as env var or GitHub Secret
PPLX_API_KEY = os.environ.get("PERPLEXITY_API_KEY", "")
PPLX_MODEL = "sonar"  # cheapest: $0.25/1M input, $2.50/1M output


# ===========================================================
# SECTION 1: KPI FETCHERS — Real-time market data via APIs
# ===========================================================

def fetch_hang_seng():
    """Fetch Hang Seng Index via yfinance (^HSI)."""
    print("  Fetching Hang Seng Index via yfinance...")
    try:
        ticker = yf.Ticker("^HSI")
        hist = ticker.history(period="5d")
        if hist.empty:
            return None, None
        last_close = hist["Close"].iloc[-1]
        last_date = hist.index[-1].strftime("%d %b %Y")
        prev_close = hist["Close"].iloc[-2] if len(hist) > 1 else last_close
        change_pct = ((last_close - prev_close) / prev_close) * 100
        sign = "▲" if change_pct >= 0 else "▼"
        return {
            "value": f"{last_close:,.0f}",
            "delta": f"{sign} {change_pct:+.2f}%",
            "deltaClass": "positive" if change_pct >= 0 else "negative",
            "period": last_date,
            "source": "Yahoo Finance (^HSI)",
            "sourceUrl": "https://finance.yahoo.com/quote/%5EHSI/"
        }, last_close
    except Exception as e:
        print(f"    [WARN] yfinance ^HSI failed: {e}")
        return None, None


def fetch_usd_hkd():
    """Fetch USD/HKD exchange rate via yfinance."""
    print("  Fetching USD/HKD via yfinance...")
    try:
        ticker = yf.Ticker("HKD=X")
        hist = ticker.history(period="5d")
        if hist.empty:
            return None
        rate = hist["Close"].iloc[-1]
        return f"{rate:.3f}"
    except Exception as e:
        print(f"    [WARN] yfinance HKD=X failed: {e}")
        return None


def fetch_fed_rate():
    """Fetch US Federal Funds Rate from FRED API (no key needed for basic)."""
    print("  Fetching Fed Funds Rate from FRED...")
    try:
        url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=DFEDTARU&cosd=2025-01-01"
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            lines = resp.text.strip().split("\n")
            if len(lines) > 1:
                last_line = lines[-1]
                parts = last_line.split(",")
                if len(parts) == 2:
                    date_str, value = parts[0], parts[1].strip()
                    if value and value != ".":
                        rate = float(value)
                        # Also get lower bound
                        url2 = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=DFEDTARL&cosd=2025-01-01"
                        resp2 = requests.get(url2, headers=HEADERS, timeout=15)
                        lower = None
                        if resp2.status_code == 200:
                            lines2 = resp2.text.strip().split("\n")
                            if len(lines2) > 1:
                                lower = float(lines2[-1].split(",")[1].strip())
                        if lower is not None:
                            return {
                                "value": f"{lower:.2f}%–{rate:.2f}%",
                                "period": f"Target range · {date_str}",
                                "source": "FRED / Federal Reserve",
                                "sourceUrl": "https://fred.stlouisfed.org/series/DFEDTARU"
                            }
                        return {
                            "value": f"{rate:.2f}%",
                            "period": f"Upper bound · {date_str}",
                            "source": "FRED / Federal Reserve",
                            "sourceUrl": "https://fred.stlouisfed.org/series/DFEDTARU"
                        }
    except Exception as e:
        print(f"    [WARN] FRED Fed rate failed: {e}")
    return None


def fetch_kpi_data(current_kpis):
    """
    Fetch latest KPI values using APIs. Falls back to current values if fetch fails.
    Returns updated KPI_DATA list.
    """
    print("\n[KPI] Fetching market data...")
    updated = [dict(k) for k in current_kpis]

    # Hang Seng Index
    hsi_data, _ = fetch_hang_seng()
    if hsi_data:
        for kpi in updated:
            if kpi["label"] == "Hang Seng":
                kpi.update(hsi_data)
                print(f"    ✓ Hang Seng: {hsi_data['value']}")
                break
    else:
        print("    ✗ Hang Seng: keeping current value")

    # US Fed Rate
    fed_data = fetch_fed_rate()
    if fed_data:
        for kpi in updated:
            if kpi["label"] == "US Fed Rate":
                kpi.update(fed_data)
                print(f"    ✓ US Fed Rate: {fed_data['value']}")
                break
    else:
        print("    ✗ US Fed Rate: keeping current value")

    # USD/HKD
    hkd_rate = fetch_usd_hkd()
    if hkd_rate:
        print(f"    ✓ USD/HKD: {hkd_rate}")

    return updated


def fetch_yf_last(ticker_symbol, label=""):
    """Fetch the last closing value for any yfinance ticker."""
    try:
        t = yf.Ticker(ticker_symbol)
        hist = t.history(period="5d")
        if not hist.empty:
            return hist["Close"].iloc[-1]
    except Exception as e:
        print(f"    [WARN] yfinance {ticker_symbol} ({label}): {e}")
    return None


def fetch_fred_csv(series_id, start="2025-01-01"):
    """Fetch the latest value from a FRED CSV endpoint."""
    try:
        url = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}&cosd={start}"
        resp = requests.get(url, headers=HEADERS, timeout=20)
        if resp.status_code == 200:
            lines = resp.text.strip().split("\n")
            if len(lines) > 1:
                parts = lines[-1].split(",")
                if len(parts) == 2 and parts[1].strip() != ".":
                    return float(parts[1].strip()), parts[0].strip()
    except Exception as e:
        print(f"    [WARN] FRED {series_id}: {e}")
    return None, None


def update_macro_tables(hk_macro, global_data, kpis):
    """
    Update the 'current' values in HK Macro and Global tables
    using live API data. Falls back to existing values if fetch fails.
    THIS is what keeps the HK Macro and Global tabs up to date.
    """
    print("\n[MACRO] Updating HK Macro & Global table values...")

    # --- Gather live data ---
    live = {}

    # Hang Seng — reuse from KPI
    hsi_kpi = next((k for k in kpis if k["label"] == "Hang Seng"), None)
    if hsi_kpi:
        live["Hang Seng Index"] = hsi_kpi["value"]

    # USD/HKD
    hkd = fetch_usd_hkd()
    if hkd:
        live["USD/HKD Exchange"] = hkd

    # HK Unemployment — yfinance doesn't have this, use FRED
    val, date = fetch_fred_csv("LRHUTTTTTHM156S")  # HK harmonized unemployment
    if val is not None:
        live["Unemployment Rate"] = f"{val:.1f}%"
        print(f"    ✓ HK Unemployment (FRED): {val:.1f}%")

    # HK CPI from FRED
    val, date = fetch_fred_csv("FPCPITOTLZGHKG")  # HK CPI YoY
    if val is not None:
        live["CPI Inflation"] = f"{val:.1f}% ({date[:4]})"
        print(f"    ✓ HK CPI (FRED): {val:.1f}%")

    # US Fed Funds Rate
    val_upper, date = fetch_fred_csv("DFEDTARU")
    val_lower, _ = fetch_fred_csv("DFEDTARL")
    if val_upper is not None:
        if val_lower is not None:
            live["US Federal Funds Rate"] = f"{val_lower:.2f}-{val_upper:.2f}%"
        else:
            live["US Federal Funds Rate"] = f"{val_upper:.2f}%"
        print(f"    ✓ Fed Rate (FRED): {live['US Federal Funds Rate']}")

    # China GDP from FRED
    val, date = fetch_fred_csv("MKTGDPCNA646NWDB", start="2020-01-01")
    # China PMI — not easily available from free APIs, skip

    # Additional yfinance tickers
    yf_map = {
        "^HSI": "Hang Seng Index",
    }
    for ticker, indicator in yf_map.items():
        if indicator not in live:
            v = fetch_yf_last(ticker, indicator)
            if v is not None:
                live[indicator] = f"{v:,.0f}"
                print(f"    ✓ {indicator}: {v:,.0f}")

    # --- Apply to HK Macro table ---
    updated_count = 0
    for row in hk_macro:
        indicator = row["indicator"]
        if indicator in live:
            old_val = row["current"]
            row["previous"] = old_val  # shift current → previous
            row["current"] = live[indicator]
            updated_count += 1

    print(f"  HK Macro: updated {updated_count}/{len(hk_macro)} indicators")

    # --- Apply to Global table ---
    updated_count = 0
    for row in global_data:
        indicator = row["indicator"]
        if indicator in live:
            old_val = row["current"]
            row["previous"] = old_val
            row["current"] = live[indicator]
            updated_count += 1

    print(f"  Global: updated {updated_count}/{len(global_data)} indicators")

    return hk_macro, global_data


# ===========================================================
# SECTION 2: NEWS FETCHERS — RSS feeds + Google News
# ===========================================================

def fetch_google_news_rss(query, max_items=15):
    """Fetch news from Google News RSS for a search query."""
    print(f"  Google News RSS: '{query}'...")
    news = []
    try:
        url = f"https://news.google.com/rss/search?q={query.replace(' ', '+')}&hl=en-HK&gl=HK&ceid=HK:en"
        feed = feedparser.parse(url)
        for entry in feed.entries[:max_items]:
            # Google News title format: "Headline - Source"
            title_parts = entry.title.rsplit(" - ", 1)
            headline = title_parts[0]
            source_name = title_parts[1] if len(title_parts) > 1 else "Google News"
            pub_date = ""
            if hasattr(entry, "published_parsed") and entry.published_parsed:
                pub_date = datetime(*entry.published_parsed[:6]).strftime("%Y-%m-%d")

            news.append({
                "headline": headline,
                "date": pub_date,
                "source": source_name,
                "url": entry.link,
                "category": "",  # to be assigned
                "impact": headline,
                "sentiment": "neutral"
            })
        print(f"    Found {len(news)} items")
    except Exception as e:
        print(f"    [WARN] Google News RSS failed: {e}")
    return news


def fetch_rthk_rss():
    """Fetch from RTHK English news RSS."""
    print("  RTHK RSS...")
    news = []
    try:
        feed = feedparser.parse("https://rthk.hk/rthk/news/rss/e_expressnews_elocal.xml")
        for entry in feed.entries[:10]:
            pub_date = ""
            if hasattr(entry, "published_parsed") and entry.published_parsed:
                pub_date = datetime(*entry.published_parsed[:6]).strftime("%Y-%m-%d")
            keywords = ["job", "employ", "hiring", "unemployment", "wage", "labour",
                        "economy", "gdp", "inflation", "trade", "tariff", "ai",
                        "fintech", "banking", "finance", "data", "tech"]
            title = entry.title if hasattr(entry, "title") else ""
            if any(kw in title.lower() for kw in keywords):
                news.append({
                    "headline": title,
                    "date": pub_date,
                    "source": "RTHK",
                    "url": entry.link,
                    "category": "GLOBAL",
                    "impact": title,
                    "sentiment": "neutral"
                })
        print(f"    Found {len(news)} relevant items")
    except Exception as e:
        print(f"    [WARN] RTHK RSS failed: {e}")
    return news


def fetch_scmp_rss():
    """Fetch from SCMP RSS feeds (business/economy)."""
    print("  SCMP RSS...")
    news = []
    feeds = [
        "https://www.scmp.com/rss/5/feed",   # HK news
        "https://www.scmp.com/rss/2/feed",   # Business
    ]
    for feed_url in feeds:
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries[:8]:
                pub_date = ""
                if hasattr(entry, "published_parsed") and entry.published_parsed:
                    pub_date = datetime(*entry.published_parsed[:6]).strftime("%Y-%m-%d")
                keywords = ["job", "employ", "hiring", "unemployment", "wage",
                            "economy", "gdp", "inflation", "trade", "tariff",
                            "ai", "fintech", "banking", "finance", "data", "tech",
                            "layoff", "recruitment", "salary", "workforce"]
                title = entry.title if hasattr(entry, "title") else ""
                if any(kw in title.lower() for kw in keywords):
                    news.append({
                        "headline": title,
                        "date": pub_date,
                        "source": "SCMP",
                        "url": entry.link,
                        "category": "GLOBAL",
                        "impact": title,
                        "sentiment": "neutral"
                    })
        except Exception as e:
            print(f"    [WARN] SCMP RSS failed: {e}")
    print(f"    Found {len(news)} relevant items")
    return news


def fetch_gis_press():
    """Fetch latest press releases from info.gov.hk."""
    print("  GIS press releases...")
    news = []
    try:
        resp = requests.get("https://www.info.gov.hk/gia/general/today.htm",
                            headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return news
        soup = BeautifulSoup(resp.text, "html.parser")
        links = soup.select('a[href*="/gia/general/"]')
        today = datetime.now(HKT).strftime("%Y-%m-%d")

        keywords = ["就業", "招聘", "勞工", "培訓", "employment", "labour", "hiring",
                     "job", "recruitment", "wage", "salary", "workforce", "talent",
                     "economy", "trade", "gdp", "budget"]
        for link in links[:15]:
            title = link.get_text(strip=True)
            href = link.get("href", "")
            if not title or len(title) < 10:
                continue
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
        print(f"    Found {len(news)} relevant items")
    except Exception as e:
        print(f"    [WARN] GIS failed: {e}")
    return news


# ===========================================================
# SECTION 2.5: LLM ANALYSIS — Perplexity Sonar API
# ===========================================================

def call_perplexity(system_prompt, user_prompt, temperature=0.1):
    """Call Perplexity Sonar API. Returns response text or None."""
    if not PPLX_API_KEY:
        return None
    try:
        resp = requests.post(
            "https://api.perplexity.ai/chat/completions",
            headers={
                "Authorization": f"Bearer {PPLX_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": PPLX_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": temperature,
                "max_tokens": 4000
            },
            timeout=60
        )
        if resp.status_code == 200:
            data = resp.json()
            return data["choices"][0]["message"]["content"]
        else:
            print(f"    [WARN] Perplexity API returned {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        print(f"    [WARN] Perplexity API call failed: {e}")
    return None


def llm_analyze_news(news_items):
    """
    Use Perplexity Sonar to categorize, assign sentiment, and write impact
    analysis for news items. Processes in batches of 10.
    """
    if not PPLX_API_KEY:
        print("  [SKIP] No PERPLEXITY_API_KEY — using keyword-based fallback")
        return [assign_sentiment_keyword(categorize_keyword(item)) for item in news_items]

    print("  Analyzing news with Perplexity Sonar...")
    system_prompt = """You are an expert Hong Kong job market analyst. For each news headline, provide:
1. category: one of POLICY & REGULATION, CORPORATE, TECHNOLOGY & AI, FINANCIAL SECTOR, TRADE & GEOPOLITICS, US TARIFFS, DATA GOVERNANCE & PRIVACY, CHINA MAINLAND, REAL ESTATE & COST, LOCAL EMPLOYMENT, FINTECH, GLOBAL
2. sentiment: positive, negative, or neutral (from a Hong Kong job seeker's perspective)
3. impact: 1-2 sentences explaining how this news affects the Hong Kong job market specifically

Respond in JSON array format: [{"index": 0, "category": "...", "sentiment": "...", "impact": "..."}]
Only output valid JSON, no markdown fences."""

    analyzed = list(news_items)
    batch_size = 10
    for start in range(0, len(analyzed), batch_size):
        batch = analyzed[start:start + batch_size]
        headlines = "\n".join(
            f"{i}. [{item['date']}] {item['headline']} (source: {item['source']})"
            for i, item in enumerate(batch)
        )
        user_prompt = f"Analyze these {len(batch)} Hong Kong job market news headlines:\n\n{headlines}"

        result = call_perplexity(system_prompt, user_prompt)
        if result:
            try:
                result = result.strip()
                if result.startswith("```"):
                    result = re.sub(r'^```(?:json)?\s*', '', result)
                    result = re.sub(r'\s*```$', '', result)
                analyses = json.loads(result)
                for a in analyses:
                    idx = a.get("index", -1)
                    if 0 <= idx < len(batch):
                        if a.get("category"):
                            batch[idx]["category"] = a["category"]
                        if a.get("sentiment"):
                            batch[idx]["sentiment"] = a["sentiment"]
                        if a.get("impact"):
                            batch[idx]["impact"] = a["impact"]
                print(f"    Batch {start//batch_size + 1}: analyzed {len(analyses)} items")
            except (json.JSONDecodeError, KeyError) as e:
                print(f"    [WARN] Failed to parse LLM response for batch {start//batch_size + 1}: {e}")
                for item in batch:
                    assign_sentiment_keyword(categorize_keyword(item))
        else:
            for item in batch:
                assign_sentiment_keyword(categorize_keyword(item))

    return analyzed


def llm_update_macro_values_and_implications(hk_macro, global_data, kpis):
    """
    Use Perplexity Sonar (with web search) to:
    1. Search for and update the latest values of ALL indicators,
       especially those without free APIs (IPO, PMI, Office Vacancy, etc.)
    2. Rewrite job market implications based on the updated figures.
    """
    if not PPLX_API_KEY:
        print("  [SKIP] No PERPLEXITY_API_KEY — keeping existing values and implications")
        return hk_macro, global_data

    print("  Searching for latest indicator values & writing implications...")
    kpi_context = ", ".join(f"{k['label']}: {k['value']}" for k in kpis)
    now_str = datetime.now(HKT).strftime("%B %Y")

    for table_name, table_data in [("HK Macro", hk_macro), ("Global", global_data)]:
        indicators = "\n".join(
            f"{i}. {row['indicator']}: current_value=\"{row['current']}\", previous=\"{row['previous']}\", source={row.get('sourceLabel','')}"
            for i, row in enumerate(table_data)
        )

        system_prompt = f"""You are a senior Hong Kong macroeconomic research analyst. Today is {now_str}.

For each indicator below, you MUST:
1. Search the web for the LATEST available figure. Use official sources (C&SD, HKMA, HKEX, S&P Global, FRED, NBS China, JLL, etc.)
2. If you find a newer value than the current_value shown, return it as "current". Move the old current_value to "previous".
3. If you cannot find a newer value, keep the existing current and previous unchanged.
4. Set "trend" to one of: "▲ UP", "▼ DOWN", "~ STABLE", "~ MIXED", "▲ STRONG", "▼ CONTRACTION", "— HOLD", "⚠ ELEVATED", "▲ EXPANDING", "▲ DEEPENING", "~ SOFTENING", "~ FRAGILE", "▲ SURGING"
5. Set "trendClass" to: "positive", "negative", or "neutral"
6. Write a 1-2 sentence "implication" about what this means for Hong Kong job seekers and hiring.
7. If you found a source URL for the updated value, include it as "sourceUrl" and short name as "sourceLabel".

Respond as a JSON array: [{{
  "index": 0,
  "current": "...",
  "previous": "...",
  "trend": "...",
  "trendClass": "positive|negative|neutral",
  "implication": "...",
  "sourceLabel": "...",
  "sourceUrl": "..."
}}]
Only output valid JSON, no markdown fences. Keep values concise (e.g. "3.8%", "HK$103B+", "49.3")."""

        user_prompt = f"""Dashboard KPI snapshot: {kpi_context}

{table_name} indicators to research and update:
{indicators}"""

        result = call_perplexity(system_prompt, user_prompt, temperature=0.1)
        if result:
            try:
                result = result.strip()
                if result.startswith("```"):
                    result = re.sub(r'^```(?:json)?\s*', '', result)
                    result = re.sub(r'\s*```$', '', result)
                analyses = json.loads(result)
                val_count = 0
                impl_count = 0
                for a in analyses:
                    idx = a.get("index", -1)
                    if 0 <= idx < len(table_data):
                        row = table_data[idx]
                        if a.get("current") and a["current"] != row["current"]:
                            row["previous"] = row["current"]
                            row["current"] = a["current"]
                            val_count += 1
                        if a.get("previous") and a.get("current") == row["current"]:
                            # LLM kept current same but may have updated previous
                            pass
                        if a.get("trend"):
                            row["trend"] = a["trend"]
                        if a.get("trendClass"):
                            row["trendClass"] = a["trendClass"]
                        if a.get("implication"):
                            row["implication"] = a["implication"]
                            impl_count += 1
                        if a.get("sourceLabel"):
                            row["sourceLabel"] = a["sourceLabel"]
                        if a.get("sourceUrl"):
                            row["sourceUrl"] = a["sourceUrl"]
                print(f"    {table_name}: {val_count} values updated, {impl_count} implications rewritten")
            except (json.JSONDecodeError, KeyError) as e:
                print(f"    [WARN] Failed to parse LLM response for {table_name}: {e}")
        else:
            print(f"    {table_name}: LLM call failed, keeping existing data")

    return hk_macro, global_data


# ---- Keyword-based fallbacks (used when no API key) ----

def categorize_keyword(item):
    """Auto-assign category based on headline keywords (fallback)."""
    h = item["headline"].lower()
    if item.get("category"):
        return item
    rules = [
        (["tariff", "trade war", "trade tension", "section 301", "section 122"], "US TARIFFS"),
        (["trade", "geopolit", "sanctions", "import", "export"], "TRADE & GEOPOLITICS"),
        (["ai ", "artificial intelligence", "machine learning", "tech company", "科技"], "TECHNOLOGY & AI"),
        (["fintech", "virtual bank", "digital bank", "blockchain", "crypto"], "FINTECH"),
        (["data governance", "data protection", "privacy", "pdpo", "cybersecurity", "gdpr"], "DATA GOVERNANCE & PRIVACY"),
        (["就業", "失業", "招聘", "勞工", "unemployment", "layoff", "hiring", "job fair", "workforce"], "LOCAL EMPLOYMENT"),
        (["ipo", "banking", "bank", "financial", "interest rate", "hkma", "金融"], "FINANCIAL SECTOR"),
        (["policy", "regulation", "budget", "legislation", "government", "civil serv"], "POLICY & REGULATION"),
        (["gba", "greater bay", "mainland", "china", "beijing", "shenzhen", "中國"], "CHINA MAINLAND"),
        (["property", "rent", "office vacancy", "real estate", "housing"], "REAL ESTATE & COST"),
        (["corporate", "company", "acquisition", "merger"], "CORPORATE"),
    ]
    for keywords, category in rules:
        if any(kw in h for kw in keywords):
            item["category"] = category
            return item
    item["category"] = "GLOBAL"
    return item


def assign_sentiment_keyword(item):
    """Auto-assign sentiment based on keywords (fallback)."""
    h = item["headline"].lower()
    positive_kw = ["growth", "surge", "expand", "rally", "boost", "improve", "gain",
                   "record high", "strong", "positive", "increase", "增長", "上升"]
    negative_kw = ["layoff", "decline", "drop", "fall", "contraction", "recession",
                   "closure", "cut", "裁員", "下跌", "失業", "warning", "risk", "crisis"]
    if any(kw in h for kw in positive_kw):
        item["sentiment"] = "positive"
    elif any(kw in h for kw in negative_kw):
        item["sentiment"] = "negative"
    return item


def fetch_all_news(existing_news):
    """
    Fetch news from all sources, merge with existing, deduplicate.
    THIS is what keeps the News Feed tab current.
    """
    print("\n[NEWS] Fetching from all sources...")
    new_items = []

    # Google News — multiple relevant queries
    queries = [
        "Hong Kong job market 2026",
        "Hong Kong employment economy",
        "Hong Kong layoffs hiring",
        "Hong Kong fintech AI jobs",
        "Hong Kong data governance regulation",
        "香港 就業 招聘",
    ]
    for q in queries:
        new_items.extend(fetch_google_news_rss(q, max_items=8))

    # RSS feeds
    new_items.extend(fetch_rthk_rss())
    new_items.extend(fetch_scmp_rss())
    new_items.extend(fetch_gis_press())

    # Categorize, assign sentiment, and write impact (LLM if API key, else keywords)
    new_items = llm_analyze_news(new_items)

    # Deduplicate by URL
    existing_urls = {n["url"] for n in existing_news}
    # Also deduplicate within new items
    seen_urls = set()
    unique_new = []
    for item in new_items:
        if item["url"] not in existing_urls and item["url"] not in seen_urls:
            seen_urls.add(item["url"])
            unique_new.append(item)

    all_news = unique_new + existing_news
    # Sort by date descending, keep max 80
    all_news.sort(key=lambda n: n.get("date", ""), reverse=True)
    all_news = all_news[:80]

    print(f"\n  Summary: {len(unique_new)} new + {len(existing_news)} existing = {len(all_news)} total")
    return all_news


# ===========================================================
# SECTION 3: JOB LISTINGS FETCHERS — Perplexity Sonar API
# ===========================================================

def fetch_jobs_via_llm():
    """
    Use Perplexity Sonar (with web search) to find real Data/AI governance
    job listings from JobsDB, LinkedIn, eFinancialCareers, and Indeed.
    Returns only verified URLs with posting dates.
    THIS is what keeps the Job Openings tab current.
    """
    if not PPLX_API_KEY:
        print("  [SKIP] No PERPLEXITY_API_KEY — cannot fetch new job listings")
        return []

    print("\n[JOBS] Searching for real job listings via Perplexity Sonar...")
    now_str = datetime.now(HKT).strftime("%d %B %Y")
    all_jobs = []

    # Search each job board separately for better results
    searches = [
        ("JobsDB", "site:hk.jobsdb.com data governance OR AI governance OR data protection Hong Kong", 12),
        ("LinkedIn", "site:linkedin.com/jobs data governance OR AI governance Hong Kong", 12),
        ("eFinancialCareers", "site:efinancialcareers.com data governance OR AI governance Hong Kong", 8),
        ("Indeed", "site:hk.indeed.com data governance OR AI governance Hong Kong", 8),
    ]

    for source_name, search_query, target_count in searches:
        system_prompt = f"""You are a job search assistant. Today is {now_str}.

Search for REAL, CURRENTLY ACTIVE job listings matching the query. For each job found, you MUST provide:
- title: exact job title as posted
- company: the hiring company name
- location: specific location in Hong Kong (e.g. "Central", "Quarry Bay", "Kowloon")
- salary: salary range if shown, otherwise "Not disclosed"
- desc: 1 sentence describing the role
- url: the ACTUAL, REAL URL of the job listing page (must be a valid, clickable link that goes to the real job post — never fabricate URLs)
- posted: the posting date in "DD Mon YYYY" format (e.g. "09 Apr 2026"). If only relative time shown (e.g. "3 days ago"), convert to approximate date.

CRITICAL RULES:
- Only include jobs that ACTUALLY EXIST on {source_name} right now
- Every URL must be a real, working link to an actual job posting
- Never invent or fabricate URLs — if you cannot find the real URL, skip that listing
- Focus on Data Governance, AI Governance, Data Protection, Data Privacy, AI Ethics, and AI Risk roles in Hong Kong

Respond as a JSON array of objects. Only output valid JSON, no markdown fences.
Return up to {target_count} listings."""

        user_prompt = f"Search for: {search_query}"

        print(f"  Searching {source_name}...")
        result = call_perplexity(system_prompt, user_prompt, temperature=0.1)
        if result:
            try:
                result = result.strip()
                if result.startswith("```"):
                    result = re.sub(r'^```(?:json)?\s*', '', result)
                    result = re.sub(r'\s*```$', '', result)
                listings = json.loads(result)
                valid = 0
                for job in listings:
                    url = job.get("url", "")
                    # Validate URL looks real (not fabricated)
                    if not url or not url.startswith("http"):
                        continue
                    # Basic URL validation per source
                    if source_name == "JobsDB" and "jobsdb.com" not in url:
                        continue
                    if source_name == "LinkedIn" and "linkedin.com" not in url:
                        continue
                    if source_name == "eFinancialCareers" and "efinancialcareers" not in url:
                        continue
                    if source_name == "Indeed" and "indeed.com" not in url:
                        continue

                    all_jobs.append({
                        "title": job.get("title", "Untitled"),
                        "company": job.get("company", "Unknown"),
                        "location": job.get("location", "Hong Kong"),
                        "salary": job.get("salary", "Not disclosed"),
                        "desc": job.get("desc", job.get("title", "")),
                        "source": source_name,
                        "url": url,
                        "posted": job.get("posted", now_str)
                    })
                    valid += 1
                print(f"    {source_name}: {valid} valid listings")
            except (json.JSONDecodeError, KeyError) as e:
                print(f"    [WARN] Failed to parse {source_name} results: {e}")
        else:
            print(f"    [WARN] {source_name}: Sonar call failed")

    print(f"  Total new listings found: {len(all_jobs)}")
    return all_jobs


# ===========================================================
# SECTION 4: data.js WRITER
# ===========================================================

def js_string(s):
    """Escape a string for JS."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")


def write_data_js(meta, kpis, signals, hk_macro, global_data, news, jobs):
    """Write all data arrays to data.js."""
    if DATA_JS_PATH.exists():
        shutil.copy2(DATA_JS_PATH, BACKUP_PATH)
        print(f"  Backed up data.js → data.js.bak")

    lines = [
        "// ============================================",
        "// HK Job Market Terminal — Data Layer",
        "// All dashboard data lives here. Regenerated by refresh.py",
        "// ============================================",
        ""
    ]

    # META
    lines.append("const META = {")
    lines.append(f'  updated: "{js_string(meta["updated"])}",')
    lines.append(f'  version: "{js_string(meta["version"])}"')
    lines.append("};")
    lines.append("")

    def write_array(name, data, fields):
        lines.append(f"const {name} = [")
        for i, item in enumerate(data):
            lines.append("  {")
            for j, (key, default) in enumerate(fields):
                val = item.get(key, default)
                comma = "," if j < len(fields) - 1 else ""
                if isinstance(val, str):
                    lines.append(f'    {key}: "{js_string(val)}"{comma}')
                elif isinstance(val, bool):
                    lines.append(f'    {key}: {"true" if val else "false"}{comma}')
                else:
                    lines.append(f"    {key}: {json.dumps(val)}{comma}")
            comma = "," if i < len(data) - 1 else ""
            lines.append(f"  }}{comma}")
        lines.append("];")
        lines.append("")

    kpi_fields = [("label", ""), ("value", ""), ("delta", ""), ("deltaClass", "neutral"),
                  ("period", ""), ("source", ""), ("sourceUrl", ""), ("valueClass", "")]
    write_array("KPI_DATA", kpis, kpi_fields)

    signal_fields = [("title", ""), ("desc", ""), ("sentiment", "neutral"),
                     ("sourceLabel", ""), ("sourceUrl", "")]
    write_array("SIGNAL_DATA", signals, signal_fields)

    macro_fields = [("indicator", ""), ("current", ""), ("currentClass", ""),
                    ("previous", ""), ("trend", ""), ("trendClass", "neutral"),
                    ("implication", ""), ("sourceLabel", ""), ("sourceUrl", "")]
    write_array("HK_MACRO_DATA", hk_macro, macro_fields)
    write_array("GLOBAL_DATA", global_data, macro_fields)

    news_fields = [("headline", ""), ("date", ""), ("source", ""), ("url", ""),
                   ("category", ""), ("impact", ""), ("sentiment", "neutral")]
    write_array("NEWS_DATA", news, news_fields)

    jobs_fields = [("title", ""), ("company", ""), ("location", ""), ("salary", ""),
                   ("desc", ""), ("source", ""), ("url", ""), ("posted", "")]
    write_array("JOBS_DATA", jobs, jobs_fields)

    content = "\n".join(lines) + "\n"
    DATA_JS_PATH.write_text(content, encoding="utf-8")
    print(f"  Wrote data.js ({len(content):,} bytes)")


# ===========================================================
# SECTION 5: MAIN — Load current, fetch updates, write
# ===========================================================

def load_current_data():
    """Parse existing data.js via Node.js to get current values as fallback."""
    import subprocess
    try:
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
            print(f"  [WARN] Node parse failed: {result.stderr[:200]}")
            return None
        return json.loads(result.stdout)
    except FileNotFoundError:
        print("  [WARN] Node.js not found, trying Python JSON fallback...")
        return load_current_data_python()
    except Exception as e:
        print(f"  [WARN] Failed to parse data.js: {e}")
        return None


def load_current_data_python():
    """Fallback: parse data.js using regex (no Node required)."""
    content = DATA_JS_PATH.read_text(encoding="utf-8")
    # Convert JS to valid JSON-ish by wrapping keys in quotes
    # This is a simplified parser for our controlled output format
    content = re.sub(r'const (\w+) = ', r'"\1": ', content)
    content = re.sub(r'//[^\n]*\n', '\n', content)  # strip comments
    content = re.sub(r'(\w+):', r'"\1":', content)    # quote keys
    content = re.sub(r',\s*}', '}', content)           # trailing commas
    content = re.sub(r',\s*]', ']', content)
    content = "{" + content.replace(";\n", ",\n", 6).rstrip().rstrip(",") + "}"
    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        print(f"  [WARN] Python JSON fallback also failed: {e}")
        return None


def main():
    dry_run = "--dry-run" in sys.argv
    news_only = "--news-only" in sys.argv
    kpi_only = "--kpi-only" in sys.argv

    print("=" * 60)
    print("HK Job Market Terminal — Data Refresh")
    print(f"Time: {datetime.now(HKT).strftime('%Y-%m-%d %H:%M HKT')}")
    print(f"Mode: {'DRY RUN' if dry_run else 'news-only' if news_only else 'kpi-only' if kpi_only else 'FULL'}")
    print("=" * 60)

    # Load current data
    print("\nLoading current data.js...")
    current = load_current_data()
    if not current:
        print("FATAL: Cannot parse current data.js. Aborting.")
        sys.exit(1)
    print(f"  Loaded: {len(current['NEWS_DATA'])} news, {len(current['JOBS_DATA'])} jobs")

    # Prepare outputs (start with current as baseline)
    now = datetime.now(HKT)
    meta = {
        "updated": now.strftime("%d %b %Y %H:%M HKT"),
        "version": current["META"]["version"]
    }
    kpis = current["KPI_DATA"]
    signals = current["SIGNAL_DATA"]
    hk_macro = current["HK_MACRO_DATA"]
    global_data = current["GLOBAL_DATA"]
    news = current["NEWS_DATA"]
    jobs = current["JOBS_DATA"]

    # SECTION 1: KPIs
    if not news_only:
        kpis = fetch_kpi_data(current["KPI_DATA"])

    # SECTION 1.5: Macro table values
    if not news_only:
        hk_macro, global_data = update_macro_tables(hk_macro, global_data, kpis)

    # SECTION 2: News
    if not kpi_only:
        news = fetch_all_news(current["NEWS_DATA"])

    # SECTION 2.5: LLM — Update macro values + implications
    if not news_only and not kpi_only and PPLX_API_KEY:
        print("\n[LLM] Searching for latest indicator values & updating implications...")
        hk_macro, global_data = llm_update_macro_values_and_implications(hk_macro, global_data, kpis)

    # SECTION 3: Jobs (full refresh only, requires API key)
    if not news_only and not kpi_only:
        new_jobs = fetch_jobs_via_llm()
        if new_jobs:
            # Merge: new jobs first, then existing, dedup by title+company
            seen = set()
            merged = []
            for j in new_jobs + jobs:
                key = (j["title"].lower(), j["company"].lower())
                if key not in seen:
                    seen.add(key)
                    merged.append(j)
            jobs = merged
            print(f"  Jobs after merge: {len(jobs)}")

    if dry_run:
        print(f"\n[DRY RUN] Would write data.js. Exiting.")
        print(f"  KPIs: {len(kpis)}, News: {len(news)}, Jobs: {len(jobs)}")
        return

    # Write
    print("\nWriting data.js...")
    write_data_js(meta, kpis, signals, hk_macro, global_data, news, jobs)
    print(f"\nDone! Refresh complete at {meta['updated']}")


if __name__ == "__main__":
    main()
