#!/usr/bin/env python3
"""
update_data.py — HK Job Market Dashboard Auto-Updater
Fetches: KPIs (HSI live + FRED live + 6 manual), News, Jobs via Perplexity sonar

GitHub Secrets required:
  PERPLEXITY_API_KEY  → https://www.perplexity.ai/settings/api
  FRED_API_KEY        → https://fred.stlouisfed.org/docs/api/api_key.html  (free)
"""

import os, json, re, requests, sys
from datetime import datetime, timezone, timedelta
from openai import OpenAI

HKT = timezone(timedelta(hours=8))
NOW = datetime.now(HKT).strftime("%Y-%m-%d %H:%M HKT")

PERPLEXITY_API_KEY = os.environ.get("PERPLEXITY_API_KEY", "")
FRED_API_KEY       = os.environ.get("FRED_API_KEY", "")

if not PERPLEXITY_API_KEY:
    print("ERROR: PERPLEXITY_API_KEY not set"); sys.exit(1)

client = OpenAI(api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai")


# ── Helpers ───────────────────────────────────────────────────────────────────

def safe_get(url, params=None, timeout=15):
    try:
        r = requests.get(url, params=params, timeout=timeout,
                         headers={"User-Agent": "Mozilla/5.0 HK-Dashboard/1.0"})
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print("  WARNING fetch failed:", e)
        return None


def extract_json(text):
    text = re.sub(r"^```json\s*", "", text.strip(), flags=re.MULTILINE)
    text = re.sub(r"^```\s*",     "", text.strip(), flags=re.MULTILINE)
    text = re.sub(r"```$",        "", text.strip(), flags=re.MULTILINE)
    return json.loads(text)


def ask_perplexity(user_msg, model="sonar"):
    system = ("You are a JSON-only response bot. "
              "Return ONLY valid JSON, no markdown fences, no explanation.")
    resp = client.chat.completions.create(
        model=model,
        messages=[{"role": "system", "content": system},
                  {"role": "user",   "content": user_msg}],
        temperature=0.1
    )
    return resp.choices.message.content


# =============================================================================
# LIVE KPI 1 — Hang Seng Index  (Yahoo Finance, no API key needed)
# Source: https://finance.yahoo.com/quote/%5EHSI/
# =============================================================================
print("\n[1/4] Hang Seng Index from Yahoo Finance...")

hsi_val = hsi_change = "N/A"
hsi_cls  = "neutral"
hsi_date = datetime.now(HKT).strftime("%d %b %Y")

yahoo = safe_get("https://query1.finance.yahoo.com/v8/finance/chart/%5EHSI",
                 {"interval": "1d", "range": "2d"})
if yahoo:
    try:
        meta  = yahoo["chart"]["result"]["meta"]
        price = meta.get("regularMarketPrice", 0)
        prev  = meta.get("chartPreviousClose", meta.get("previousClose", 0))
        hsi_val = "{:,.0f}".format(price)
        if prev:
            chg        = ((price - prev) / prev) * 100
            arrow      = ("up +" if chg >= 0 else "down ")
            hsi_change = arrow + "{:.2f}% today".format(abs(chg))
            hsi_cls    = "positive" if chg >= 0 else "negative"
        print("  HSI:", hsi_val, "(", hsi_change, ")")
    except Exception as e:
        print("  HSI parse error:", e)


# =============================================================================
# LIVE KPI 2 — US Fed Funds Rate  (FRED API, free key)
# Get key: https://fred.stlouisfed.org/docs/api/api_key.html
# Add to GitHub Secrets as: FRED_API_KEY
# =============================================================================
print("\n[2/4] US Fed Rate from FRED...")

fed_val    = "4.25-4.50%"              # hardcoded fallback
fed_delta  = "held at target range"
fed_period = "Latest . Federal Reserve"
fed_url    = "https://www.federalreserve.gov/monetarypolicy/openmarket.htm"

if FRED_API_KEY:
    fred = safe_get("https://api.stlouisfed.org/fred/series/observations", {
        "series_id": "FEDFUNDS", "api_key": FRED_API_KEY,
        "file_type": "json", "sort_order": "desc", "limit": 2
    })
    if fred and fred.get("observations"):
        obs        = fred["observations"]
        rate       = float(obs["value"])
        fed_val    = "{:.2f}%".format(rate)
        fed_period = obs["date"][:7] + " . Federal Reserve"
        if len(obs) > 1:
            diff = rate - float(obs["value"])[1]
            if abs(diff) > 0.001:
                fed_delta = ("up +" if diff > 0 else "down ") + "{:.2f}pp".format(abs(diff))
            else:
                fed_delta = "unchanged from prior month"
        print("  Fed Rate:", fed_val, "(", fed_delta, ")")
else:
    print("  No FRED_API_KEY — using hardcoded fallback")


# =============================================================================
# MANUAL KPIs — edit the values below each month, then commit + push
# -----------------------------------------------------------------------------
# GDP            https://www.censtatd.gov.hk          quarterly (Jan/Apr/Jul/Oct)
# PMI            https://www.spglobal.com/pmi          monthly   (1st business day)
# Unemployment   https://www.censtatd.gov.hk          monthly
# CPI            https://www.censtatd.gov.hk          monthly
# Job Vacancies  https://www.censtatd.gov.hk          quarterly
# Median Wage    https://www.censtatd.gov.hk/hkirss    annual
# =============================================================================
print("\n[3/4] Building KPI block (manual + live)...")

KPI_DATA = {
    "gdp_growth": {
        "label":       "GDP Growth",
        "val":         "3.5%",
        "delta":       "up +1.0pp YoY",
        "delta_class": "positive",
        "period":      "Full-year 2025 . C&SD",
        "url":         "https://www.info.gov.hk/gia/general/202601/30/P2026013000262.htm"
    },
    "unemployment": {
        "label":       "Unemployment",
        "val":         "3.8%",
        "delta":       "down prev 3.9%",
        "delta_class": "positive",
        "period":      "Dec25-Feb26 . C&SD",
        "url":         "https://www.censtatd.gov.hk/en/scode210.html"
    },
    "pmi": {
        "label":       "PMI (Mar 2026)",
        "val":         "49.3",
        "delta":       "down -4.0 from Feb",
        "delta_class": "negative",
        "period":      "Mar 2026 . S&P Global",
        "url":         "https://www.spglobal.com/marketintelligence/en/mi/research-analysis/purchasing-managers-index.html",
        "caution":     True
    },
    "hsi": {
        "label":       "Hang Seng Index",
        "val":         hsi_val,
        "delta":       hsi_change,
        "delta_class": hsi_cls,
        "period":      hsi_date + " . HSI",
        "url":         "https://www.hsi.com.hk"
    },
    "cpi": {
        "label":       "CPI Inflation",
        "val":         "1.7%",
        "delta":       "up +0.6pp from Jan",
        "delta_class": "neutral",
        "period":      "Feb 2026 . HKSAR",
        "url":         "https://www.hkeconomy.gov.hk/en/situation/development/index.htm"
    },
    "job_vacancies": {
        "label":       "Job Vacancies",
        "val":         "46,000",
        "delta":       "down -21% YoY",
        "delta_class": "negative",
        "period":      "Dec 2025 . C&SD",
        "url":         "https://www.censtatd.gov.hk/en/scode210.html",
        "caution":     True
    },
    "median_wage": {
        "label":       "Median Monthly Wage",
        "val":         "HK$21,200",
        "delta":       "up +3.5% YoY",
        "delta_class": "positive",
        "period":      "2025 . Ambition HK",
        "url":         "https://www.austcham.com.hk/member-news/future-hiring-hong-kong-2026"
    },
    "fed_rate": {
        "label":       "US Fed Rate",
        "val":         fed_val,
        "delta":       fed_delta,
        "delta_class": "neutral",
        "period":      fed_period,
        "url":         fed_url
    }
}

print("  KPIs built:", list(KPI_DATA.keys()))


# =============================================================================
# NEWS via Perplexity sonar
# =============================================================================
print("\n[4a/4] News via Perplexity sonar...")

NEWS_PROMPT = (
    "You are a professional headhunter and career coach for the Hong Kong job market.\n"
    "Search for the latest news (past 7 days) affecting HK professionals,\n"
    "especially in Data Governance, AI Governance, Compliance, Financial Services.\n\n"
    "Return ONLY a valid JSON array. Each item must have exactly these fields:\n"
    "  headline   - string (English or Traditional Chinese OK)\n"
    "  date       - string YYYY-MM-DD\n"
    "  source     - string (e.g. SCMP, Bloomberg, HKMA, Hong Kong Economic Times)\n"
    "  url        - string (real working URL to the article)\n"
    "  category   - one of: POLICY & REGULATION | CORPORATE | TECHNOLOGY & AI |\n"
    "    FINANCIAL SECTOR | TRADE & GEOPOLITICS | US TARIFFS | DATA GOVERNANCE & PRIVACY |\n"
    "    CHINA MAINLAND | REAL ESTATE & COST | GLOBAL | LOCAL EMPLOYMENT | FINTECH\n"
    "  impact     - string (2-3 sentences: job market impact for HK professionals)\n"
    "  sentiment  - one of: positive | negative | neutral\n\n"
    "Include at least 15 items: HK macro data, US-China tariffs, AI/data regulation "
    "(PDPO, GDPR, EU AI Act), HKMA fintech/RegTech, vacancy stats, salary trends, "
    "GBA talent mobility. Include Traditional Chinese local news where relevant."
)

news_data = []
try:
    news_data = extract_json(ask_perplexity(NEWS_PROMPT))
    print("  News items:", len(news_data))
except Exception as e:
    print("  ERROR parsing news:", e)


# =============================================================================
# JOB OPENINGS via Perplexity sonar
# =============================================================================
print("\n[4b/4] Job listings via Perplexity sonar...")

JOBS_PROMPT = (
    "Search for CURRENT job openings posted in the last 30 days in Hong Kong for:\n"
    "Data Governance, AI Governance, Data Privacy, DPO (Data Protection Officer),\n"
    "Chief Data Officer, Head of Data, Data Quality, DPIA Analyst, Privacy Analyst,\n"
    "Compliance Analyst (data-focused), and related risk/RegTech roles.\n\n"
    "Search across: JobsDB HK, LinkedIn HK, eFinancialCareers HK, Indeed HK.\n\n"
    "Return ONLY a valid JSON array. Each item must have exactly these fields:\n"
    "  title    - string (exact job title)\n"
    "  company  - string\n"
    "  location - string (e.g. Central HK, Kowloon, Remote)\n"
    "  salary   - string (e.g. HK$35,000-50,000/month or Not disclosed)\n"
    "  posted   - string (e.g. 2 days ago, 1 week ago)\n"
    "  url      - string (direct link to the job posting)\n"
    "  source   - one of: JobsDB | LinkedIn | eFinancialCareers | Indeed\n"
    "  desc     - string (2 sentences: role summary + key requirements/certs)\n\n"
    "Include at least 20 listings. Mix seniority: analyst, manager, AVP, VP, director, MD.\n"
    "Prioritise roles valuing: CIPP/E, CIPM, CDMP, CRISC, DAMA, FIP, banking experience."
)

jobs_data = []
try:
    jobs_data = extract_json(ask_perplexity(JOBS_PROMPT))
    print("  Job listings:", len(jobs_data))
except Exception as e:
    print("  ERROR parsing jobs:", e)


# =============================================================================
# WRITE data.js
# =============================================================================
n_kpi  = len(KPI_DATA)
n_news = len(news_data)
n_jobs = len(jobs_data)

output_lines = [
    "// Auto-generated by update_data.py -- DO NOT EDIT MANUALLY",
    "// Last updated: " + NOW,
    "// KPI_DATA: " + str(n_kpi) + " indicators | NEWS_DATA: " + str(n_news) + " items | JOBS_DATA: " + str(n_jobs) + " listings",
    "",
    'const LAST_UPDATED = "' + NOW + '";',
    "",
    "// KPI_DATA: HSI and Fed Rate are fetched live every run.",
    "// All others: edit values in the MANUAL KPIs section above, commit, and push.",
    "const KPI_DATA = " + json.dumps(KPI_DATA, ensure_ascii=False, indent=2) + ";",
    "",
    "const NEWS_DATA = " + json.dumps(news_data, ensure_ascii=False, indent=2) + ";",
    "",
    "const JOBS_DATA = " + json.dumps(jobs_data, ensure_ascii=False, indent=2) + ";",
    "",
]

with open("data.js", "w", encoding="utf-8") as f:
    f.write("\n".join(output_lines))

print("\n✅  data.js written at", NOW)
print("    KPI indicators:", n_kpi)
print("    News items:    ", n_news)
print("    Job listings:  ", n_jobs)
