// ============================================
// HK Job Market Terminal — Data Layer
// ============================================

const LAST_UPDATED = "2026-04-08";
const NEWS_DATA = [
  {
    headline: "Hong Kong 2026-27 Budget Doubles Down on Talent Attraction with HK$50M AI Up-Skilling Fund",
    date: "2026-02-25",
    source: "VisaHQ / Acclime",
    url: "https://www.visahq.com/news/2026-03-06/hk/hong-kong-2026-27-budget-doubles-down-on-talent-attraction-and-cross-border-expansion/",
    category: "POLICY & REGULATION",
    impact: "Budget allocates HK$50M for AI up-skilling and HK$500M for life-science research. HK$10B innovation fund targets high-growth tech firms. Top Talent Pass Scheme and HK Talent Engage agency enhanced.",
    sentiment: "positive"
  },
  {
    headline: "Hong Kong Widens Visa-Renewal Window to 90 Days for Six Key Employment Schemes",
    date: "2026-03-01",
    source: "VisaHQ",
    url: "https://www.visahq.com/news/2026-03-01/hk/hong-kong-opens-3-month-renewal-window-for-employment-and-talent-visas/",
    category: "POLICY & REGULATION",
    impact: "Immigration Dept expanded visa-extension window from 1 month to 90 days for GEP, ASMTP, TechTAS, QMAS, IANG, and ASSG holders. Reduces compliance pressure on multinationals and foreign professionals.",
    sentiment: "positive"
  },
  {
    headline: "TTPS 2026-27: University List Expanded to 200 Institutions, Category A Stay Extended to 3 Years",
    date: "2026-03-26",
    source: "LeapScholar",
    url: "https://leapscholar.com/digest/news-hong-kong-top-talent-pass-scheme-2026-2027",
    category: "POLICY & REGULATION",
    impact: "TTPS expanded from 184 to 200 eligible universities. Cat A stay extended from 2 to 3 years. Digital verification cut processing to 9-14 days. Broadens talent pipeline in AI, fintech, ESG.",
    sentiment: "positive"
  },
  {
    headline: "New Statutory Minimum Wage Formula Set to Take Effect 1 May 2026",
    date: "2026-02-09",
    source: "JD Supra",
    url: "https://www.jdsupra.com/legalnews/2025-year-in-review-2026-look-forward-6462899/",
    category: "POLICY & REGULATION",
    impact: "First formula-based statutory minimum wage mechanism. More predictable wage floor, could increase base costs for low-wage service sectors. Mandatory pay increase for affected workers.",
    sentiment: "positive"
  },
  {
    headline: "Continuous Contract Threshold Lowered: More Workers Eligible for Statutory Benefits",
    date: "2026-01-18",
    source: "JD Supra",
    url: "https://www.jdsupra.com/legalnews/2025-year-in-review-2026-look-forward-6462899/",
    category: "POLICY & REGULATION",
    impact: "Effective 18 Jan 2026, 'continuous contract' triggered at 17 hrs/4 weeks (down from 18). More part-time and gig workers qualify for statutory benefits including annual leave, sick pay, severance.",
    sentiment: "positive"
  },
  {
    headline: "Three HK Employers Sanctioned Under Enhanced Supplementary Labour Scheme",
    date: "2026-01-22",
    source: "HR Online",
    url: "https://www.humanresourcesonline.net/3-hong-kong-employers-sanctioned-for-violating-local-recruitment-rules-around-importation-of-workers",
    category: "POLICY & REGULATION",
    impact: "Labour Dept imposed 2-year bans on 3 employers for violating ESLS local-recruitment requirements. Reinforces 'local workers first' policy within imported-labour programme.",
    sentiment: "neutral"
  },
  {
    headline: "31% of HK Firms Plan to Boost Hiring in Q1 2026, But AI Threatens Junior Roles",
    date: "2025-12-16",
    source: "SCMP",
    url: "https://www.scmp.com/news/hong-kong/hong-kong-economy/article/3336623/31-hong-kong-firms-boost-hiring-next-quarter-ai-threatens-junior-jobs",
    category: "CORPORATE",
    impact: "ManpowerGroup survey: 31% plan to increase headcount in Q1 2026, esp. hospitality, health, finance. But professional/scientific/technical services at -15% net outlook — worst among all sectors.",
    sentiment: "neutral"
  },
  {
    headline: "HK Job Market to Grow 10-15% in Financial Services Sector in 2026",
    date: "2025-11-18",
    source: "SCMP / LinkedIn",
    url: "https://www.linkedin.com/posts/peggy-sito-06165126_hiring-outlook-improves-for-hong-kongs-financial-activity-7396758655511126016-xtIw",
    category: "CORPORATE",
    impact: "Financial services hiring expected to rise 10-15%. Improved IPO conditions, renewed mainland capital inflows, recovering stock market drive the uptick. Positive for bankers, compliance, fintech.",
    sentiment: "positive"
  },
  {
    headline: "Ambition HK 2026: Contract Hiring Gains Traction as 34% Prefer Flexible Roles",
    date: "2026-01-01",
    source: "AustCham HK",
    url: "https://www.austcham.com.hk/member-news/future-hiring-hong-kong-2026",
    category: "CORPORATE",
    impact: "Hiring becoming highly selective. Contract roles gaining momentum. Tech hiring 'measured but resilient' — cybersecurity, cloud, data, automation. Salary budget growth ~4%, job movers earning 10-15%.",
    sentiment: "neutral"
  },
  {
    headline: "HK Company Re-Domiciliation Regime Attracting International Firms",
    date: "2026-02-03",
    source: "OLN Law",
    url: "https://oln-law.com/hong-kong-company-re-domiciliation-regime-a-new-gateway-for-international-businesses/",
    category: "CORPORATE",
    impact: "Companies Amendment Ordinance 2025 allows foreign companies to relocate legal domicile to HK without dissolution. Attracting BVI/Cayman firms. Generates demand for legal, compliance, accounting roles.",
    sentiment: "positive"
  },
  {
    headline: "HKSTP 'Reimagine AI+' Career Fair Draws 3,000 Visits, 1,000+ I&T Vacancies",
    date: "2026-03-17",
    source: "HKSTP",
    url: "https://www.hkstp.org/en/park-life/news-and-events/news/hkstp-career-fair-2026-reimagine-ai-plus",
    category: "TECHNOLOGY & AI",
    impact: "80+ park companies presenting 1,000+ vacancies across AI, life/health tech, advanced manufacturing, green tech. HKSTP Talent Foundry 2.0 extends AI up-skilling to early-career professionals.",
    sentiment: "positive"
  },
  {
    headline: "AI Talent Gap Real: 1 in 4 HK Companies Can't Fill AI Roles, Salary Premiums 15-25%",
    date: "2026-03-30",
    source: "KOS International",
    url: "https://www.kos-intl.com/insight/the-ai-talent-gap-in-hong-kong-is-real-heres-what-smart-employers-are-doing-about-it/",
    category: "TECHNOLOGY & AI",
    impact: "Structural split: generalist roles face oversupply, while AI/ML/data/cybersecurity specialists command 15-25% salary premiums. Over half of employers introduced AI with headcount optimisation as primary goal.",
    sentiment: "neutral"
  },
  {
    headline: "Robert Walters: Over Half of HK Employers Use AI to Optimise Headcount",
    date: "2026-01-16",
    source: "Robert Walters",
    url: "https://www.robertwalters.com.hk/insights/hiring-advice/blog/AI-adoption-reshapes-workforce-structures.html",
    category: "TECHNOLOGY & AI",
    impact: "25-50% of workforce needs reskilling due to AI automation of admin, accounting, IT support. Demand rising for data scientists, ML engineers, AI product developers. Bifurcated job market emerging.",
    sentiment: "negative"
  },
  {
    headline: "HK Graduate Job Vacancies Hit 5-Year Low as AI Disrupts Career Entry Paths",
    date: "2026-03-24",
    source: "SCMP",
    url: "https://www.scmp.com/opinion/comment/article/3347551/hong-kong-graduates-need-adapt-secure-job-ai-era",
    category: "TECHNOLOGY & AI",
    impact: "23 out of 33 job categories at 6-year lows. AI displacement acute in IT/programming, customer services, clerical work. Applications per position soaring. Universities introducing AI adaptation courses.",
    sentiment: "negative"
  },
  {
    headline: "HKMA Launches 'Fintech 2030' Blueprint — AI, DLT, High-Performance Computing",
    date: "2026-02-03",
    source: "HKMA",
    url: "https://www.hkma.gov.hk/media/eng/doc/key-information/press-release/2026/20260203e3a1.pdf",
    category: "FINANCIAL SECTOR",
    impact: "Aggressive programme across 5 domains: AI, DLT, HPC, Data Excellence, Cyber Resilience. 95% of HK banks already using fintech, 36% devoting >30% of tech budgets. Sustained demand for specialist fintech roles.",
    sentiment: "positive"
  },
  {
    headline: "HKMA 2026 Pay Review: Staff Salaries Raised 2.65% with 20% Variable Pay",
    date: "2026-03-25",
    source: "HKMA",
    url: "https://www.hkma.gov.hk/eng/news-and-media/press-releases/2026/03/20260325-5/",
    category: "FINANCIAL SECTOR",
    impact: "General fixed-pay increase of 2.65%, plus 1.35% for top performers and 20.04% variable pay. As benchmark employer, HKMA salary adjustments influence bank compensation norms across the sector.",
    sentiment: "positive"
  },
  {
    headline: "HKMA Financial Stability Report: Banking Sector Risks Monitored Amid Trade Tensions",
    date: "2026-03-30",
    source: "HKMA",
    url: "https://www.hkma.gov.hk/eng/news-and-media/press-releases/2026/03/20260330-4/",
    category: "FINANCIAL SECTOR",
    impact: "Broadly stable local banking sector but ongoing global trade tension risks. Keeps demand elevated for risk, compliance, and regulatory affairs roles at banks.",
    sentiment: "neutral"
  },
  {
    headline: "Eight Key HK Regulatory Developments for 2026, Including Stablecoin Licensing",
    date: "2026-01-05",
    source: "Simmons & Simmons",
    url: "https://www.simmons-simmons.com/en/publications/cmk26uzl405oevlz0v7q9xpkd/eight-hong-kong-regulatory-developments-for-2026",
    category: "FINANCIAL SECTOR",
    impact: "New virtual asset dealing/custodial/advisory regimes, first stablecoin licences from HKMA, expanded SFC crypto regulation. Drives demand for crypto compliance officers, VA legal counsel, regulatory specialists.",
    sentiment: "positive"
  },
  {
    headline: "Cross-Agency Steering Group Sets 2026-2028 Sustainable Finance Priorities",
    date: "2026-01-30",
    source: "HKMA",
    url: "https://www.hkma.gov.hk/eng/news-and-media/press-releases/2026/01/20260130-3/",
    category: "FINANCIAL SECTOR",
    impact: "Sustainability Disclosure Roadmap requires large entities to adopt ISSB Standards by 2028. Sustains demand for ESG analysts, sustainability reporting specialists, climate-risk professionals.",
    sentiment: "positive"
  },
  {
    headline: "US Supreme Court Strikes Down IEEPA Tariffs; China-HK Goods Now Under 10% Section 122",
    date: "2026-02-20",
    source: "Bloomberg Law",
    url: "https://news.bloomberglaw.com/international-trade/china-stocks-in-hong-kong-jump-as-us-court-strikes-down-tariffs",
    category: "US TARIFFS",
    impact: "SCOTUS ruled IEEPA-based tariffs unauthorized. HSI China Enterprises Index rallied 2.7%. Trump imposed new 10% Section 122 tariff for 150 days. Partial relief but uncertainty persists.",
    sentiment: "neutral"
  },
  {
    headline: "Trump Travels to Beijing for Xi Meeting (April 2026) — Trade Truce Fragile",
    date: "2026-02-21",
    source: "The Standard",
    url: "https://www.thestandard.com.hk/china/article/324913/Trump-to-travel-to-China-next-month-with-US-tariffs-in-focus",
    category: "US TARIFFS",
    impact: "Trump visited China Mar 31–Apr 2. US-China KL Joint Arrangement set 10% reciprocal tariff, suspended 100% escalation until Nov 2026. Progress would boost HK business confidence.",
    sentiment: "positive"
  },
  {
    headline: "HK Official: Trump's 10% Global Tariff Underscores Hong Kong's 'Distinctive Trade Advantages'",
    date: "2026-02-21",
    source: "Reuters",
    url: "https://www.reuters.com/world/asia-pacific/trumps-new-tariffs-underscore-hong-kongs-advantages-city-official-says-2026-02-21/",
    category: "US TARIFFS",
    impact: "Financial Secretary called tariff environment a 'fiasco' but argues it benefits HK as free-port hub — only ~3% of total exports affected. Trade facilitation and professional services roles may see demand.",
    sentiment: "positive"
  },
  {
    headline: "China Launches Investigations into US Trade Practices; Escalation Risk for HK",
    date: "2026-04-02",
    source: "JD Supra / Baker Botts",
    url: "https://www.jdsupra.com/legalnews/trump-tariff-tracker-april-1-2026-3482205/",
    category: "TRADE & GEOPOLITICS",
    impact: "China launched investigations into US practices that 'disrupt global supply chains' and 'hinder green product trade.' Scheduled to conclude in 6 months. Could reignite trade uncertainty.",
    sentiment: "negative"
  },
  {
    headline: "US Section 301 Forced Labor Investigation Threatened Against Hong Kong",
    date: "2026-03-12",
    source: "Trade Compliance Hub",
    url: "https://www.tradecomplianceresourcehub.com/2026/04/02/trump-2-0-tariff-tracker/",
    category: "TRADE & GEOPOLITICS",
    impact: "USTR initiated Section 301 investigation covering HK, with rate and scope TBD. Additional duties would apply on top of Section 122. Creates reputational and compliance risk for HK trading companies.",
    sentiment: "negative"
  },
  {
    headline: "APEC 2026 Hosted by Shenzhen: HK Fights for Relevance Against GBA Rival",
    date: "2025-11-23",
    source: "Think China",
    url: "https://www.thinkchina.sg/economy/apec-2026-lands-shenzhen-hong-kong-fights-relevance",
    category: "TRADE & GEOPOLITICS",
    impact: "Shenzhen hosting APEC 2026 signals growing international standing. Could accelerate capital and talent flows to Shenzhen at HK's expense. HK tech professionals face cross-border competition.",
    sentiment: "negative"
  },
  {
    headline: "HK Grade A Office Rents to Decline 0-5% in 2026; Prime Districts Leading Recovery",
    date: "2026-03-02",
    source: "JLL / Real Estate Asia",
    url: "https://realestateasia.com/commercial-office/news/hong-kong-grade-office-rents-decline-5-in-2026",
    category: "REAL ESTATE & COST",
    impact: "Central and TST leading rental recovery via IPO-linked financial demand. Lower costs give businesses room to invest in headcount. Flight-to-quality trend benefits talent attraction.",
    sentiment: "positive"
  },
  {
    headline: "JP Morgan Raises HK Home Price Forecast to 10-15% Growth on Mainland Buyer Demand",
    date: "2026-02-25",
    source: "Reuters",
    url: "https://www.reuters.com/world/china/hong-kong-home-prices-continue-recovery-analysts-forecast-2026-increase-least-10-2026-02-25/",
    category: "REAL ESTATE & COST",
    impact: "JP Morgan, Goldman Sachs (12%), Morgan Stanley (10%) all bullish on HK property. Improves homeowner wealth but increases cost of living for arriving talent, potentially limiting talent scheme effectiveness.",
    sentiment: "neutral"
  },
  {
    headline: "China 15th Five-Year Plan Outlines Four Major Opportunities for Hong Kong",
    date: "2026-03-16",
    source: "Beijing Review",
    url: "https://www.bjreview.com/China/202603/t20260316_800433003.html",
    category: "CHINA MAINLAND",
    impact: "Endorses HK as intl financial/shipping/trade hub, science centre, 'super connector' for mainland firms going global. Northern Metropolis and Hetao Cooperation Zone accelerate cross-border career pathways.",
    sentiment: "positive"
  },
  {
    headline: "MTR Expansion to Shenzhen Fully Operational by 2035; Cross-Border Labour Mobility Deepens",
    date: "2026-02-25",
    source: "The Young Reporter",
    url: "https://tyr-jour.hkbu.edu.hk/2026/02/25/2026-budget-mtr-expansion-to-shenzhen-fully-operational-by-2035-to-enhance-cross-border-transportation/",
    category: "CHINA MAINLAND",
    impact: "Northern Link (pre-2034) and HK-Shenzhen Western Rail Link (2035) confirmed. 106.67M MTR border crossings in 2025. Deepens 'one-hour living circle' for GBA job market access.",
    sentiment: "positive"
  },
  {
    headline: "GBA Cross-Boundary Private Car Scheme Launched for Guangdong Vehicles",
    date: "2025-12-23",
    source: "People's Daily",
    url: "http://en.people.cn/n3/2025/1224/c90000-20406090.html",
    category: "CHINA MAINLAND",
    impact: "Eligible Guangdong cars can drive into HK city centre via HZMB with daily quotas. Expands province-wide within 6 months. Reduces friction for cross-border talent mobility.",
    sentiment: "positive"
  },
  {
    headline: "Zhuhai and Foshan Designated as Pilot Cross-Border Trade Facilitation Cities",
    date: "2026-03-24",
    source: "Macau News Agency",
    url: "https://macaonews.org/news/greater-bay-area/zhuhai-and-foshan-have-become-cross-border-trade-facilitation-cities/",
    category: "CHINA MAINLAND",
    impact: "29 measures to boost cross-boundary trade quality. Increased GBA trade facilitation creates business expansion for HK logistics, legal, and trade finance professionals.",
    sentiment: "positive"
  },
  {
    headline: "Critical Infrastructure Cybersecurity Ordinance Takes Effect 1 January 2026",
    date: "2026-01-08",
    source: "IAPP / Tanner De Witt",
    url: "https://iapp.org/news/a/notes-from-the-asia-pacific-region-strong-start-to-2026-for-china-s-data-ai-governance-landscape",
    category: "DATA GOVERNANCE & PRIVACY",
    impact: "HK's first cybersecurity law covers finance, telecom, transport. CI Operators must establish governance frameworks and report vulnerabilities. Fines HKD 500K-5M. Drives demand for cybersecurity and compliance specialists.",
    sentiment: "positive"
  },
  {
    headline: "PCPD Plans Mandatory Data Breach Notification Law Consultation in 2026",
    date: "2026-02-07",
    source: "SCMP",
    url: "https://www.scmp.com/news/hong-kong/society/article/3342754/hong-kong-plans-revive-privacy-law-mandating-firms-report-data-breaches",
    category: "DATA GOVERNANCE & PRIVACY",
    impact: "Privacy Commissioner confirmed plans for mandatory breach notification and administrative fines under revived PDPO amendment. Businesses will need dedicated DPOs and incident response capabilities.",
    sentiment: "neutral"
  },
  {
    headline: "HK Government Working Group to Review AI Legislation; AIRDI to Govern Standards",
    date: "2026-03-18",
    source: "HK Govt / GIS",
    url: "https://www.info.gov.hk/gia/general/202603/18/P2026031800419.htm",
    category: "DATA GOVERNANCE & PRIVACY",
    impact: "Inter-Departmental Working Group will review AI risk legislation including deepfakes and misinformation. AIRDI to develop AI standards and safety assessments. Signals shift from soft guidance to binding regulation.",
    sentiment: "neutral"
  },
  {
    headline: "PCPD Arrests Two for Doxxing (Mar 2026); Corporate Liability Escalating",
    date: "2026-03-12",
    source: "YTL LLP",
    url: "https://hkytl.com/2026/03/12/hong-kong-doxxing-offences-corporate-liability-pdpo/",
    category: "DATA GOVERNANCE & PRIVACY",
    impact: "Two arrested under PDPO doxxing offence (Section 64(3A)). Corporations face vicarious liability for employee data misuse. Increasing pressure to hire DPOs and invest in PDPO compliance training.",
    sentiment: "neutral"
  },
  {
    headline: "HK Adopts Soft-Law Approach to AI Governance; No Dedicated AI Statute Yet",
    date: "2026-03-15",
    source: "DOOD HK",
    url: "https://doodhk.com/blog/regulating-ai-in-hong-kong/",
    category: "DATA GOVERNANCE & PRIVACY",
    impact: "No dedicated AI law yet — relying on 6 voluntary frameworks. PCPD found 80% of 60 orgs using AI daily. Shift toward binding regulation is 'when not whether.' Drives demand for AI governance specialists.",
    sentiment: "neutral"
  },
  {
    headline: "APAC Remote Work Surging: 78% of Companies Plan 60%+ Remote Hires",
    date: "2026-01-08",
    source: "EWS Ltd",
    url: "https://www.ews-limited.com/remote-work-apac-2026-trends-expansion/",
    category: "GLOBAL",
    impact: "IDC: 78% of APAC companies plan 60%+ remote hires within 12-18 months. HK's conservative in-office culture may hinder global talent attraction vs. more flexible regional hubs.",
    sentiment: "negative"
  },
  {
    headline: "Allianz: HK GDP Growth Forecast at 2.4% with Downside Risks from US Trade War",
    date: "2026-01-01",
    source: "Allianz Research",
    url: "https://www.allianz.com/en/economic_research/country-and-sector-risk/country-risk/hong-kong.html",
    category: "GLOBAL",
    impact: "Below government's own 2.5-3.5% forecast. External debt at ~500% of GDP. Slower growth would reduce business confidence and suppress hiring in trade-dependent sectors.",
    sentiment: "negative"
  },
  {
    headline: "HK Economy Grew 3.5% in 2025; CPI Forecast at 1.7% for 2026",
    date: "2026-04-01",
    source: "HKSAR Govt",
    url: "https://www.hkeconomy.gov.hk/en/situation/development/index.htm",
    category: "GLOBAL",
    impact: "Third consecutive year of expansion. Merchandise exports surged 29.6% YoY in Jan-Feb 2026 driven by AI electronics. Low inflation supports real wage growth and stable hiring costs.",
    sentiment: "positive"
  },
  {
    headline: "HK Economy Forecast 2.5-3.5% in 2026; Labour Market Remains Stable",
    date: "2026-02-25",
    source: "HK Budget 2026-27",
    url: "https://www.budget.gov.hk/2026/eng/budget03.html",
    category: "GLOBAL",
    impact: "Government forecasts stable labour market with moderate growth. Merchandise exports strong. Geopolitical trade uncertainties pose downside risks but underlying fundamentals support steady hiring.",
    sentiment: "positive"
  },
  // ---- Local HK News (Traditional Chinese) ----
  {
    headline: "彭博︰滙豐擬未來數年大規模裁員或涉2萬職位 因AI助縮部門規模 [Bloomberg: HSBC Reportedly Planning Large-Scale Layoffs Over Next Few Years, Up to 20,000 Jobs, as AI Shrinks Departments]",
    date: "2026-03-19",
    source: "HK01 香港01",
    url: "https://www.hk01.com/%E8%B2%A1%E7%B6%93%E5%BF%AB%E8%A8%8A/60331942/%E5%BD%AD%E5%8D%9A-%E6%BB%99%E8%B1%90%E6%93%AC%E6%9C%AA%E4%BE%86%E6%95%B8%E5%B9%B4%E5%A4%A7%E8%A6%8F%E6%A8%A1%E8%A3%81%E5%93%A1%E6%88%96%E6%B6%892%E8%90%AC%E8%81%B7%E4%BD%8D-%E5%9B%A0ai%E5%8A%A9%E7%B8%AE%E9%83%A8%E9%96%80%E8%A6%8F%E6%A8%A1",
    category: "FINANCIAL SECTOR",
    impact: "HSBC CEO Georges Elhedery is reportedly planning to cut up to 20,000 positions globally — roughly 10% of its 211,479 workforce — over a 3-5 year period, leveraging AI to eliminate back-office and non-customer-facing roles. As Hong Kong is HSBC\'s primary headquarters hub, local middle-office and support function jobs face disproportionate risk, directly impacting the city\'s financial services employment base. The announcement has triggered significant anxiety among Hong Kong\'s mortgage-holding middle-management class and signals accelerating structural displacement in banking.",
    sentiment: "negative"
  },
  {
    headline: "裁員與結業齊發：香港踏入2026年的寒冬警號 [Layoffs and Closures Converge: Hong Kong Enters 2026 Under Winter Warning Signs]",
    date: "2026-02-11",
    source: "Hong Kong Labour Rights Monitor 香港勞權監察",
    url: "https://hklabourrights.org/news/%E8%A3%81%E5%93%A1%E8%88%87%E7%B5%90%E6%A5%AD%E9%BD%8A%E7%99%BC%EF%BC%9A%E9%A6%99%E6%B8%AF%E8%B8%8F%E5%85%A52026%E5%B9%B4%E7%9A%84%E5%AF%92%E5%86%AC%E8%AD%A6%E8%99%9F/?lang=zh-hant",
    category: "LOCAL EMPLOYMENT",
    impact: "A wave of closures and layoffs at the start of 2026 has hit Hong Kong across multiple sectors: international architecture firm Benoy abruptly shut its HK office with 50 immediate job losses; Cathay Pacific announced limited layoffs cutting non-operational costs by ~5%; Citigroup cut ~1,000 employees in Asia. Retail and F&B closures (Pizza-BOX, 一碗肉燥, 老媽拌麵) have displaced frontline and grassroots workers. Unemployment rose from 3.2% (Q1 2025) to 3.8% (Q4 2025), with F&B unemployment hitting 6.2% and construction 6.7%, indicating structural deterioration in blue-collar sectors.",
    sentiment: "negative"
  },
  {
    headline: "財政預算案2026｜警務處削1335個職位 文體旅局雙減包括3首長級 [Budget 2026: Police Force Cuts 1,335 Posts; Culture, Sports & Tourism Bureau Cuts 23% Including 3 Senior Positions]",
    date: "2026-02-25",
    source: "HK01 香港01",
    url: "https://www.hk01.com/%E7%A4%BE%E6%9C%83%E6%96%B0%E8%81%9E/60325115/%E8%B2%A1%E6%94%BF%E9%A0%90%E7%AE%97%E6%A1%882026-%E8%AD%A6%E5%8B%99%E8%99%95%E5%89%8A1335%E5%80%8B%E8%81%B7%E4%BD%8D-%E6%96%87%E9%AB%94%E6%97%85%E5%B1%80%E9%9B%99%E6%B8%9B%E5%8C%85%E6%8B%AC3%E9%A6%96%E9%95%B7%E7%B4%9A",
    category: "POLICY & REGULATION",
    impact: "The 2026-27 Budget mandates a 2% annual reduction in civil service headcount across two financial years, bringing total civil service positions to approximately 188,000 by April 2026 — a cumulative cut of over 10,000 posts by end of current government term. The Police Force bears the largest single-department cut (1,335 posts), followed by Fire Services (259) and Food and Environmental Hygiene (235). This represents a significant contraction in the public sector\'s traditional role as a stable employment buffer, potentially increasing competition for remaining government vacancies.",
    sentiment: "negative"
  },
  {
    headline: "香港法定最低工資水平將調升至43.1元 [Hong Kong Statutory Minimum Wage to Rise to HK$43.1 Per Hour]",
    date: "2026-02-11",
    source: "Human Resources Online",
    url: "https://www.humanresourcesonline.net/hong-kong-to-raise-statutory-minimum-wage-to-hk-43-1-per-hour-chi",
    category: "POLICY & REGULATION",
    impact: "The Executive Council accepted the Minimum Wage Committee\'s recommendation to raise the statutory minimum wage from HK$42.1 to HK$43.1 per hour (a 2.38% increase), effective 1 May 2026 — the first adjustment under the new annual review mechanism. The monthly wage recording threshold rises correspondingly from HK$17,200 to HK$17,600. This benefits approximately 130,000–150,000 low-wage workers, particularly in F&B, cleaning, retail and elderly care, while increasing the labour cost burden for SMEs operating in sectors already experiencing margin compression.",
    sentiment: "positive"
  },
  {
    headline: "「新質生產力」人才招聘會2026 提供超過10,000個優質職位 啟動大灣區職業新篇章 [\"New Quality Productive Forces\" Job Fair 2026 Offers 10,000+ Positions to Launch New GBA Career Chapter]",
    date: "2026-03-07",
    source: "香港生產力促進局 (HKPC)",
    url: "https://www.hkpc.org/zh-HK/about-us/media-centre/press-releases/2026/hkpc-job-fair-2026",
    category: "CHINA MAINLAND",
    impact: "HKPC\'s second annual \"New Quality Productive Forces\" job fair offered over 10,000 positions from 40+ companies including Huawei, Alibaba HK, Cathay Pacific Services, BEA, EY and PwC, focused on AI consultants, AI digitalization specialists, solution engineers, and programmers. The event explicitly bridges the GBA talent market and signals a deliberate government push to redirect Hong Kong\'s workforce toward AI-driven and STEAM-aligned roles. Its alignment with the 2026-27 Budget\'s talent development agenda underscores the policy thrust to reposition HK workers for the innovation economy.",
    sentiment: "positive"
  },
  {
    headline: "立法會九題：優化人才入境計劃 — 三年累計批出逾41萬人才簽證 [LegCo Q9: Optimising Talent Admission Schemes — Over 410,000 Talent Visas Approved in Three Years]",
    date: "2026-03-25",
    source: "政府新聞處 GIS (info.gov.hk)",
    url: "https://www.info.gov.hk/gia/general/202603/25/P2026032500258.htm",
    category: "POLICY & REGULATION",
    impact: "Labour Secretary Sun Yuk-han disclosed that since late 2022, nearly 600,000 talent admission applications have been submitted across seven schemes, with over 410,000 approved — 73% from mainland China. As of February 2026, approximately 280,000 overseas and mainland talents are now working and developing in Hong Kong. The government has also updated its Talent List to 60 shortage professions and is conducting a mid-term manpower projection update (expected Q4 2026) factoring in AI disruption. This sustained talent influx directly expands competition in high-skill segments while helping alleviate projected shortfall of 180,000 workers by 2028.",
    sentiment: "positive"
  },
  {
    headline: "香港科技園「Reimagine AI+」招聘會 逾3,000人次參加 提供1,000+創科職位 [HKSTP \'Reimagine AI+\' Career Fair Attracts 3,000+ Attendees, Offers 1,000+ I&T Positions]",
    date: "2026-03-17",
    source: "香港科技園公司 (HKSTP)",
    url: "https://www.hkstp.org/zh-hk/park-life/news-and-events/news/hkstp-career-fair-2026-reimagine-ai-plus",
    category: "TECHNOLOGY & AI",
    impact: "Hong Kong Science and Technology Parks hosted its 2026 career fair under the AI+ theme, with 80+ park companies and startups offering 1,000+ innovation and technology positions. HKSTP simultaneously launched \"Talent Foundry 2.0\" to extend AI-related training and job matching from university students to in-service professionals seeking career transitions. The fair\'s alignment with China\'s national AI+ action plan signals a deliberate effort to channel talent into industrial AI applications and signals strong near-term demand for AI engineers, data specialists, and automation professionals.",
    sentiment: "positive"
  },
  {
    headline: "數碼港互動招聘博覽2026 提供逾2,000個就業良機 聚焦21個熱門創科行業 [Cyberport Interactive Recruitment Expo 2026 Offers 2,000+ Jobs Across 21 Hot Tech Sectors]",
    date: "2026-03-16",
    source: "文匯報 Wenweipo",
    url: "https://www.wenweipo.com/a/202603/16/AP69b716a9e4b04d7d56d8a511.html",
    category: "TECHNOLOGY & AI",
    impact: "Cyberport\'s 2026 interactive career expo (20–21 March) offered 2,000+ positions across 21 creative tech sectors including AI, big data, and low-altitude economy. The event featured Baidu smart driving demos and iFlytek sessions on core skills mainland firms need from Hong Kong talent, reinforcing the GBA employment bridge. The expo directly supports the government\'s \"AI Talent High Ground\" agenda and demonstrates growing demand for tech-literate workers even as traditional sectors contract, providing meaningful upside for candidates willing to reskill.",
    sentiment: "positive"
  },
  {
    headline: "大摩據報裁減2,500員工 波及三大部門 [Morgan Stanley Reportedly Cuts 2,500 Staff Across Three Major Divisions]",
    date: "2026-03-05",
    source: "香港商報 Hong Kong Commercial Daily (HKCD)",
    url: "https://www.hkcd.com.hk/hkcdweb/content/2026/03/05/content_8742994.html",
    category: "FINANCIAL SECTOR",
    impact: "Morgan Stanley cut approximately 2,500 employees (3% of global headcount) across investment banking & trading, wealth management, and investment management — including private bankers and mortgage-related staff. While primarily US-focused, Hong Kong\'s wholesale banking and wealth management sectors are directly affected given the city\'s role as Morgan Stanley\'s Asia-Pacific hub. This layoff round, driven by business pivot and performance reviews, contributes to mounting job insecurity in HK\'s financial district and signals continued headcount rationalisation across global investment banks.",
    sentiment: "negative"
  },
  {
    headline: "彭博︰國泰擬在香港及海外小規模裁員 節省成本為增長放緩作準備 [Bloomberg: Cathay Pacific Plans Limited Layoffs in HK and Overseas to Cut Costs as Growth Slows]",
    date: "2026-01-09",
    source: "HK01 香港01",
    url: "https://www.hk01.com/%E8%B2%A1%E7%B6%93%E5%BF%AB%E8%A8%8A/60311105/%E5%BD%AD%E5%8D%9A-%E5%9C%8B%E6%B3%B0%E6%93%AC%E5%9C%A8%E9%A6%99%E6%B8%AF%E5%8F%8A%E6%B5%B7%E5%A4%96%E5%B0%8F%E8%A6%8F%E6%A8%A1%E8%A3%81%E5%93%A1-%E7%AF%80%E7%9C%81%E6%88%90%E6%9C%AC%E7%82%BA%E5%A2%9E%E9%95%B7%E6%94%BE%E7%B7%A9%E4%BD%9C%E6%BA%96%E5%82%99",
    category: "CORPORATE",
    impact: "Bloomberg reported Cathay Pacific is preparing for slower growth in 2026 by requiring all departments to identify cost savings and efficiency improvements. Plans include consolidating some divisional roles, redeploying staff, and conducting limited layoffs in HK and overseas — cutting non-operational costs by ~5% and reducing headquarters marketing and administration spending. The airline employs ~34,000 people and plans to hire ~3,000 in 2026 for operational expansion, creating a two-tier employment picture of frontline growth but back-office contraction.",
    sentiment: "negative"
  },
  {
    headline: "2026年大灣區青年就業計劃招聘會啟動 逾1,500個職位 120家僱主參與 [2026 Greater Bay Area Youth Employment Scheme Job Fair Launched with 1,500+ Positions from 120+ Employers]",
    date: "2026-03-13",
    source: "VisaHQ (citing HK Labour Department)",
    url: "https://www.visahq.com/zh/news/2026-03-13/hk/hong-kong-launches-2026-greater-bay-area-youth-employment-scheme-job-fair/",
    category: "CHINA MAINLAND",
    impact: "The Labour Department launched the 2026 GBA Youth Employment Scheme, targeting 8,000 placements (up from ~5,000 in prior two years combined). About 120 employers participated, offering 1,500+ positions from software engineering to supply chain management with a government subsidy of up to HK$12,000/month or 60% of salary. The scheme, underpinning Chief Executive John Lee\'s talent mobility strategy, creates a new employment channel for Hong Kong graduates and pressures local employers to strengthen cross-border HR capabilities while deepening integration with GBA cities.",
    sentiment: "positive"
  },
  {
    headline: "僱員再培訓局升格為「技能提升局」 推動AI全民培訓 [ERB Upgraded to \'Upskill Hong Kong\', Driving AI Training for All Workers]",
    date: "2026-02-25",
    source: "僱員再培訓局 ERB",
    url: "https://www.erb.org/tc/corporate-information/press-releases/erb-welcomes-budget-speech-on-upgrading-erb-as-upskill-hong-kong",
    category: "POLICY & REGULATION",
    impact: "The 2026-27 Budget announced the rebranding of the Employees Retraining Board (ERB) to \"Upskill Hong Kong\" with a fundamental shift from employment-based to skills-based training, now serving the entire workforce rather than just grassroots workers. A HK$50 million AI public education fund was allocated alongside HK$3.6 billion in total reskilling measures. By lifting the education cap and introducing stackable micro-credential AI courses, the government is directly targeting the growing displacement risk to mid-level professionals as AI adoption accelerates in finance, retail, and the public sector.",
    sentiment: "positive"
  },
  {
    headline: "香港計劃重啟強制資料外洩通報立法 私隱專員擬諮詢立法會 [HK Plans to Revive Mandatory Data Breach Reporting Law; Privacy Commissioner to Consult LegCo]",
    date: "2026-02-07",
    source: "South China Morning Post (SCMP)",
    url: "https://www.scmp.com/news/hong-kong/society/article/3342754/hong-kong-plans-revive-privacy-law-mandating-firms-report-data-breaches",
    category: "DATA GOVERNANCE & PRIVACY",
    impact: "Privacy Commissioner Ada Chung confirmed the Office of the Privacy Commissioner for Personal Data plans to consult LegCo in 2026 on mandatory data breach reporting and administrative fines — a reform shelved in 2024 over business environment concerns. A phased approach is under consideration to minimise SME impact. If enacted, this will create significant demand for data governance, compliance, and cybersecurity roles across Hong Kong\'s financial services, healthcare, and retail sectors, while driving hiring of Chief Information Security Officers and Data Protection Officers.",
    sentiment: "neutral"
  },
  {
    headline: "內地科技公司競相登陸香港 BBC：香港成「中企出海橋頭堡」 [Mainland Tech Companies Race to Set Up in Hong Kong; BBC: HK Becomes \'Launchpad for Chinese Tech Going Global\']",
    date: "2026-03-29",
    source: "BBC News",
    url: "https://www.bbc.com/news/articles/c8d5v404m96o",
    category: "TECHNOLOGY & AI",
    impact: "Mainland Chinese tech listings on HKEX surged 153% from 30 in 2024 to 76 in 2025, as geopolitical barriers in the US and EU push Chinese AI, robotics, and software firms to use Hong Kong as a regulatory sandbox and international capital gateway. MiningLamp Technology (AI software), Yunji Technology (service robots), and numerous AI firms are establishing HK operations to build compliance credentials for global expansion. This structural shift is creating material demand for bilingual tech talent, compliance specialists, and cross-border data governance professionals in Hong Kong.",
    sentiment: "positive"
  },
  {
    headline: "FTAHK制定港2030目標：助金融業AI應用率達90% 吸引逾百億投資 [FTAHK Sets 2030 Target: 90% AI Adoption Rate Across All HK Financial Institutions, Attracting HK$8–12B Investment]",
    date: "2026-04-03",
    source: "文匯報 Wenweipo",
    url: "https://www.wenweipo.com/a/202604/03/AP69ceccb9e4b0b49ad1b51a4f.html",
    category: "FINTECH",
    impact: "The Hong Kong Fintech Association (FTAHK) released a position paper setting 2030 targets: 90% AI adoption across all financial institutions (up from current 38%), HK$8–12B in AI-related venture investment, 75+ new AI-native financial products, and top-3 global ranking in financial AI innovation. A survey of 103 institutions found 49% struggling to recruit technical talent and 74% demanding clearer AI ethics guidance. This roadmap will directly create a sustained 5-year hiring boom for AI engineers, model validators, compliance specialists, and fintech product managers in Hong Kong\'s financial sector.",
    sentiment: "positive"
  },
  {
    headline: "財政預算案2026｜公務員編制今年4月縮至18.8萬個職位 [Budget 2026: Civil Service Headcount to Shrink to 188,000 Posts by April 2026]",
    date: "2026-02-25",
    source: "Yahoo 財經 (citing Budget documents)",
    url: "https://hk.finance.yahoo.com/news/%E8%B2%A1%E6%94%BF%E9%A0%90%E7%AE%97%E6%A1%882026-%E5%85%AC%E5%8B%99%E5%93%A1%E7%B7%A8%E5%88%B6%E4%BB%8A%E5%B9%B4%E4%B8%A6%E7%B8%AE%E8%87%B318-8%E8%90%AC%E5%80%8B%E8%81%B7%E4%BD%8D-045335115.html",
    category: "POLICY & REGULATION",
    impact: "The 2026-27 Budget confirmed civil service positions will reduce 2% per year for two consecutive financial years, reaching 188,000 posts by April 2026 — cumulative elimination of 10,000+ positions by mid-2027. Three departments (Civil Affairs & Youth, Overseas ETOs, InvestHK) gained limited headcount against the overall trend, targeting youth policy and outward investment promotion. This sustained public sector contraction reduces the cushion that historically absorbed displaced graduates and older workers, adding structural pressure on the private sector job market.",
    sentiment: "negative"
  },
  {
    headline: "公務員事務局：2026年首輪綜合招聘考試3月28日起接受報名 [Civil Service Bureau: Applications for 2026 Round One Common Recruitment Exam Open from 28 March]",
    date: "2026-03-28",
    source: "公務員事務局 Civil Service Bureau (CSB)",
    url: "https://www.csb.gov.hk/tc_chi/recruit/cre/949.html",
    category: "LOCAL EMPLOYMENT",
    impact: "Despite the overall civil service contraction, the Civil Service Bureau opened applications for the 2026 Common Recruitment Examination (CRE) from 28 March to 10 April, with the exam scheduled for 6 June 2026. This entry pathway for degree-level civil service positions (Administrative Officers, Executive Officers, disciplinary services) remains a significant channel for Hong Kong graduates, particularly amid private sector uncertainty. The continued holding of CRE despite headcount cuts signals that selective quality hiring into key government grades is maintained.",
    sentiment: "neutral"
  },
  {
    headline: "補充勞工優化計劃：截至去年底批出9.61萬人 今年上半年完成檢討 [Supplementary Labour Scheme: 96,100 Workers Approved to Year-End; Review to be Completed in H1 2026]",
    date: "2026-01-27",
    source: "立法會人力事務委員會政策簡報 (LegCo Manpower Panel)",
    url: "https://www.legco.gov.hk/yr2026/chinese/panels/mp/papers/mp20250127cb1-37-1-c.pdf",
    category: "POLICY & REGULATION",
    impact: "Labour Secretary Sun Yuk-han revealed that as of year-end, 14,900 applications covering 96,100 imported workers had been approved under the Supplementary Labour Scheme (優化計劃). The government is completing a review of the scheme\'s scope and operations in H1 2026, with results to be published. The scheme is a critical safety valve for sectors unable to fill positions locally (construction, F&B, elderly care), and its outcome will shape labour supply dynamics and wage pressure for frontline workers throughout the year.",
    sentiment: "neutral"
  },
  {
    headline: "2026-27財政預算案：推動AI產業化 設AI研發院 撥50億建沙嶺數據中心群 [2026-27 Budget: Driving AI Industrialisation, Establishing AI R&D Institute, HK$5B for Sandy Ridge Data Centre Cluster]",
    date: "2026-02-25",
    source: "budget.gov.hk (HK Government Budget)",
    url: "https://www.budget.gov.hk/2026/chi/pf.html",
    category: "TECHNOLOGY & AI",
    impact: "The 2026-27 Budget allocated resources to establish the Hong Kong AI Research and Development Institute (to operate in H2 2026), a HK$100M AI Efficacy Enhancement Team for government digitisation, and advanced the Sandy Ridge data centre cluster (250,000 sqm gross floor area) to boost computing power. A new \"AI+ Industry Development Strategy Committee\" chaired by the Financial Secretary was announced. These measures collectively create sustained near-term demand for AI researchers, data engineers, cloud infrastructure specialists, and digital transformation consultants in both public and private sectors.",
    sentiment: "positive"
  },
  {
    headline: "香港失業率升至3.9% 高盛警告AI永久裁員潮逼近 [Hong Kong Unemployment Rate Rises to 3.9%; Goldman Sachs Warns AI-Driven Permanent Layoff Wave Approaching]",
    date: "2026-03-30",
    source: "YouTube 財經頻道 (citing 政府統計處 Census & Statistics Department)",
    url: "https://www.youtube.com/watch?v=voUmGZd453g",
    category: "LOCAL EMPLOYMENT",
    impact: "Hong Kong\'s seasonally adjusted unemployment rate rose to 3.9% in the November 2025–January 2026 period, translating to approximately 138,400 unemployed persons — the highest in several years. Goldman Sachs\' 2026 global report warns that AI deployment maturity in finance and tech sectors is shifting from job augmentation to job substitution, particularly threatening mid-level white-collar roles. Youth unemployment is particularly elevated. If AI-driven structural unemployment accelerates, the city faces the prospect of entrenched joblessness for professionals who cannot reskill rapidly.",
    sentiment: "negative"
  },
  {
    headline: "港對外攬才計劃3年批准逾41萬件 73%來自中國大陸 [HK Talent Recruitment Schemes Approve 410,000+ Applications in 3 Years; 73% from Mainland China]",
    date: "2026-03-26",
    source: "聯合新聞網 (citing 明報 Ming Pao)",
    url: "https://udn.com/news/story/7333/9405488",
    category: "CHINA MAINLAND",
    impact: "Labour Secretary Sun Yuk-han\'s LegCo written reply confirmed that among the 410,000+ talent admissions approved since late 2022, 300,000 (73%) are from mainland China — with the High Talent Pass Scheme (高才通) showing 94% mainland applicants. While officials attribute this to close economic, linguistic, and cultural ties with the mainland, the skew raises market questions about whether incoming talent diversifies HK\'s labour pool or primarily deepens integration with mainland China\'s professional networks, potentially reshaping competitive dynamics for local job seekers.",
    sentiment: "neutral"
  },
  {
    headline: "香港薪酬指南2026：科技金融治理崗位嚴重人才短缺 加薪幅度3-5% [HK Salary Guide 2026: Critical Talent Shortages in Tech, Finance & Governance Roles; 3-5% Pay Rise Forecast]",
    date: "2026-03-10",
    source: "Human Resources Online",
    url: "https://www.humanresourcesonline.net/hong-kong-salary-guide-2026-pay-trends-hot-skills-and-hiring-priorities-across-key-sectors-chi",
    category: "LOCAL EMPLOYMENT",
    impact: "Morgan McKinley\'s 2026 HK Salary Guide identifies critical talent shortages in AI, data analytics, cybersecurity, cloud solutions, and governance roles, with general salary budgets capped at 3-5% but niche specialists commanding 10-20% premiums on job moves. The market is bifurcated: generalists face intense competition for limited openings while specialists in digital transformation and risk compliance are actively headhunted. Employers are increasingly prioritising skills-based and contract hiring, reducing reliance on permanent headcount expansion and signalling a more fluid labour market structure.",
    sentiment: "neutral"
  },
  {
    headline: "Benoy國際建築公司突關閉香港辦公室 50名建築師即時離職 [Benoy International Architecture Firm Abruptly Closes HK Office; 50 Architects Immediately Dismissed]",
    date: "2026-01-15",
    source: "Hong Kong Labour Rights Monitor 香港勞權監察",
    url: "https://hklabourrights.org/news/%E8%A3%81%E5%93%A1%E8%88%87%E7%B5%90%E6%A5%AD%E9%BD%8A%E7%99%BC%EF%BC%9A%E9%A6%99%E6%B8%AF%E8%B8%8F%E5%85%A52026%E5%B9%B4%E7%9A%84%E5%AF%92%E5%86%AC%E8%AD%A6%E8%99%9F/?lang=zh-hant",
    category: "CORPORATE",
    impact: "Benoy, a UK-based international architecture and design firm that operated in Hong Kong for nearly 20 years and designed landmark projects including Elements, Hysan Place and Nina Tower, abruptly closed its HK and Singapore offices in mid-January 2026, immediately displacing 50 architects. The exit reflects the precipitous decline in private construction project volume in Hong Kong, with industry insiders reporting no visible recovery in market conditions. The move signals continued attrition in the city\'s professional services firms as the construction sector fails to rebound.",
    sentiment: "negative"
  },
  {
    headline: "2026-27財政預算案HR重點：增撥2.22億支援中高齡再就業 年終加薪開綠燈 [2026-27 Budget HR Highlights: HK$222M Extra for Middle-Aged Re-employment; Year-End Pay Rise Greenlit]",
    date: "2026-02-25",
    source: "Human Resources Online",
    url: "https://www.humanresourcesonline.net/hong-kong-2026-2027-budget-what-matters-most-for-hr-businesses-and-the-workforce",
    category: "POLICY & REGULATION",
    impact: "The 2026-27 Budget increased Re-employment Allowance Pilot Scheme funding to HK$222M and maintained the Employment Programme for Elderly and Middle-Aged with up to HK$5,000/month employer on-the-job training incentives. The government signalled it will proceed with civil service salary trend surveys (implicitly allowing pay adjustments after 2025\'s freeze). About 3,600 short-term government internship placements for post-secondary students were also announced. Together these measures provide modest fiscal support to re-employment efforts but fall short of advocates\' calls for a universal unemployment insurance mechanism.",
    sentiment: "positive"
  },
  {
    headline: "花旗集團亞太區持續裁員 香港辦公室受波及 [Citigroup Continues Asia-Pacific Layoffs; Hong Kong Office Affected]",
    date: "2026-01-13",
    source: "BusinessFocus (Facebook; citing Reuters)",
    url: "https://www.facebook.com/businessfocus.io/posts/%E8%B3%BA%E9%8C%A2%E7%85%A7%E7%82%92%E4%BA%BA-%E9%87%91%E8%9E%8D%E5%B7%A8%E9%A0%AD%E8%A3%81%E5%93%A1%E6%BD%AE%E5%86%8D%E8%B5%B7%E8%8A%B1%E6%97%97%E7%A0%8D1000%E4%BA%BA",
    category: "FINANCIAL SECTOR",
    impact: "Citigroup cut approximately 1,000 employees globally in January 2026 as part of CEO Jane Fraser\'s restructuring plan targeting 20,000 global job eliminations by end-2026. While Citi did not disclose Hong Kong-specific figures, its continued Asia-Pacific downsizing directly reduces headcount in Hong Kong\'s financial sector, particularly in operations, compliance, and investment banking. The layoffs add to a pattern of global bank rationalisation that is accelerating the displacement of back-office financial professionals in the city.",
    sentiment: "negative"
  },
  {
    headline: "HKMA發布《Fintech 2030》策略 四大DART支柱重塑香港金融科技格局 [HKMA Launches \'Fintech 2030\' Strategy; Four DART Pillars to Reshape HK Fintech Landscape]",
    date: "2026-01-27",
    source: "香港金融管理局 (HKMA)",
    url: "https://www.hongkong-fintech.hk/media/c04bdaja/fintechhk-factsheet_en_20260127.pdf",
    category: "FINTECH",
    impact: "HKMA\'s November 2025-launched Fintech 2030 strategy (Data, AI, Resilience, Tokenisation — DART) will drive sustained structural demand for fintech talent over the next five years. Over 75% of HK banks are already deploying or piloting AI across credit, risk, fraud monitoring and customer engagement, with annual fintech investment projected to exceed HK$100 billion over the next three years. The strategy directly creates demand for AI-finance integration specialists, tokenisation engineers, payment infrastructure architects, and regulatory technology professionals.",
    sentiment: "positive"
  },
  {
    headline: "阿里巴巴、京東等內地科技巨頭在港購入辦公室 帶動商業地產及就業 [Alibaba, JD.com and Other Mainland Tech Giants Acquire HK Office Space, Boosting Commercial Real Estate and Employment]",
    date: "2026-01-27",
    source: "Caixin Global",
    url: "https://www.caixinglobal.com/2026-01-27/hong-kong-office-market-gets-a-jolt-from-chinas-tech-leaders-102408678.html",
    category: "CORPORATE",
    impact: "Mainland Chinese tech giants drove HK$17.3 billion (43% market share) in Hong Kong commercial property acquisitions in 2025: Alibaba/Ant acquired the top 13 floors of Island One Centre for HK$7.2B; JD.com paid HK$3.5B for a 50% stake in China Construction Bank Tower. At least 20 other mainland firms are seeking HK office space. These large-scale, ownership-based commitments signal long-term operational expansion plans, creating meaningful job creation demand for bilingual tech talent, compliance, legal, and administrative professionals over the 2026-2028 horizon.",
    sentiment: "positive"
  },
  {
    headline: "零售服務業就業人口自2018年底大跌21% 部分行業呈「無就業式增長」 [Retail & Hospitality Employment Down 21% Since End-2018; Some Sectors Show \'Jobless Growth\']",
    date: "2026-01-19",
    source: "明報教育出版 (Ming Pao Educational Press)",
    url: "https://resources.mpep.com.hk/en/news/21/75757",
    category: "LOCAL EMPLOYMENT",
    impact: "A Ming Pao data analysis found that HK\'s retail, accommodation, and F&B employment fell 21% from end-2018 to November 2025, reaching 490,000 workers — a loss of 130,000 jobs in these traditionally accessible sectors. Despite rising retail sales values, sector employment continues to decline due to structural shifts toward high-end economic transformation, favouring finance and tech over labour-intensive services. HKU economist Tang Sik-wai described the pattern as \'jobless growth\', warning that low-skilled workers face severe difficulty transitioning to finance and tech positions without significant re-training support.",
    sentiment: "negative"
  }
];

const JOBS_DATA = [
  // JobsDB
  { title: "Data Enablement Manager - Data Science & Governance", company: "The Bank of East Asia", location: "Hong Kong SAR", salary: "Not disclosed", posted: "3h ago", url: "https://hk.jobsdb.com/data-governance-jobs?jobId=91386368&type=standard", source: "JobsDB", desc: "Data visualization (Tableau), cloud environments (GCP, AWS). Data science & governance enablement." },
  { title: "Data Governance Senior Manager", company: "PERSOL", location: "Tsim Sha Tsui", salary: "HK$70,000-100,000/mo", posted: "28d ago", url: "https://hk.jobsdb.com/data-governance-jobs", source: "JobsDB", desc: "Head/Senior Manager of Data Governance. Expertise in Data Governance and Data Science required." },
  { title: "Data Governance Project Manager (Investment Bank, Up to 80k)", company: "Recruit Logic", location: "Hong Kong Island", salary: "HK$60,000-80,000/mo", posted: "23d ago", url: "https://hk.jobsdb.com/data-governance-jobs", source: "JobsDB", desc: "Lead data governance projects in investment bank. 8+ years experience, hands-on enterprise data tools." },
  { title: "Digital Intelligence Management Manager (Data Governance)", company: "China Mobile HK", location: "Kwai Hing", salary: "Not disclosed", posted: "12d ago", url: "https://hk.jobsdb.com/data-governance-jobs", source: "JobsDB", desc: "Centralized data architecture for large-scale IT systems. Data standards and security frameworks." },
  { title: "Data Specialist, Data Governance and Management", company: "Chow Sang Sang Holdings", location: "Cheung Sha Wan", salary: "Not disclosed", posted: "18d ago", url: "https://hk.jobsdb.com/data-governance-jobs", source: "JobsDB", desc: "Formulate and implement data governance strategies. 5+ years in data governance and quality management." },
  { title: "Data Governance & AI Director - Investment Bank", company: "Hays Recruitment", location: "Kowloon City", salary: "Market leading", posted: "7d ago", url: "https://hk.jobsdb.com/data-governance-jobs", source: "JobsDB", desc: "Director at global investment bank. Market-leading compensation, cutting-edge technologies." },
  { title: "Head of Data Governance", company: "FundPark Limited", location: "Kwun Tong", salary: "Not disclosed", posted: "27d ago", url: "https://hk.jobsdb.com/data-governance-jobs", source: "JobsDB", desc: "Own key data domains (borrower, transaction, product, risk). Business glossaries, data standards, metadata." },
  { title: "Data Governance and AI Risk Manager", company: "Pinpoint Asia", location: "Admiralty", salary: "HK$50,000-70,000/mo", posted: "20d ago", url: "https://hk.jobsdb.com/data-governance-jobs", source: "JobsDB", desc: "Liaison between 2nd and 1st Line of Defense. Data and AI Risk Governance in Banking." },
  { title: "Senior AI & Data Solution Manager", company: "Bank of East Asia", location: "Hong Kong Island", salary: "Not disclosed", posted: "7d ago", url: "https://hk.jobsdb.com/data-governance-jobs", source: "JobsDB", desc: "Coordinate with business units on Data Warehouse/Core Banking. Senior manager-level data science & governance." },
  { title: "Officer to Asst Manager, Data Governance & Mgmt", company: "ICBC", location: "Hung Hom", salary: "Not disclosed", posted: "26d ago", url: "https://hk.jobsdb.com/data-governance-jobs", source: "JobsDB", desc: "Data analysis and data governance at ICBC within Data Management Division." },
  { title: "PMO (Data Governance & Project Support) / Public Sector", company: "Venturenix", location: "Kowloon", salary: "HK$35,000-50,000/mo", posted: "12d ago", url: "https://hk.jobsdb.com/data-governance-jobs", source: "JobsDB", desc: "Data Governance project support in public sector. PMO functions, coordination, governance documentation." },
  { title: "Manager - AI Technology and Governance", company: "Chow Sang Sang Holdings", location: "Cheung Sha Wan", salary: "Not disclosed", posted: "5d ago", url: "https://hk.jobsdb.com/ai-governance-jobs", source: "JobsDB", desc: "AI computation and data platform review. AI project deployment, governance, QA. 6+ years IT experience." },
  { title: "Manager/AVP, AI Compliance (Legal & Compliance)", company: "CMB Wing Lung Bank", location: "Mong Kok", salary: "Not disclosed", posted: "5h ago", url: "https://hk.jobsdb.com/ai-governance-jobs", source: "JobsDB", desc: "Supervise AI compliance. Execute compliance checks, formulate policies, ensure transparency & fairness." },
  { title: "AI Portfolio Manager - Leading Insurer", company: "Pinpoint Asia", location: "Kowloon", salary: "HK$70,000-90,000/mo", posted: "8d ago", url: "https://hk.jobsdb.com/ai-governance-jobs", source: "JobsDB", desc: "Lead AI delivery portfolio for global financial powerhouse. Enterprise AI governance and strategy." },
  { title: "Data Privacy Manager", company: "HKT (via Smarthire)", location: "Causeway Bay", salary: "Not disclosed", posted: "8d ago", url: "https://hk.jobsdb.com/data-privacy-jobs", source: "JobsDB", desc: "5+ years data privacy experience. Knowledge of SRAA and regulatory requirements. Family health & dental." },
  { title: "Manager, Data Protection and Quality Management", company: "ASTRI", location: "Sha Tin", salary: "Not disclosed", posted: "30d+ ago", url: "https://hk.jobsdb.com/data-privacy-jobs", source: "JobsDB", desc: "Data protection and quality management at HK Science Parks. Medical and life insurance." },
  { title: "Senior Manager, Compliance (Data Privacy)", company: "Chow Tai Fook Life Insurance", location: "Kowloon", salary: "Not disclosed", posted: "25d ago", url: "https://hk.jobsdb.com/data-privacy-jobs", source: "JobsDB", desc: "Data Privacy Compliance oversight. Data privacy governance framework and compliance matters." },
  { title: "Data Privacy Lead, Insurance", company: "Ambition Recruitment", location: "Central", salary: "Attractive package", posted: "25d ago", url: "https://hk.jobsdb.com/data-privacy-jobs", source: "JobsDB", desc: "Data privacy governance framework at one of HK's most established life insurers." },

  // LinkedIn
  { title: "VP/AVP, Specialist, Data Management & Governance", company: "DBS Bank", location: "Kowloon", salary: "Not disclosed", posted: "3 weeks ago", url: "https://hk.linkedin.com/jobs/view/vp-avp-specialist-data-management-governance-at-dbs-bank-4371356890", source: "LinkedIn", desc: "VP/AVP level data management and governance specialist at DBS Bank." },
  { title: "Senior - Data Governance Manager", company: "ALL-STAR AGENCY", location: "Hong Kong", salary: "Not disclosed", posted: "3 weeks ago", url: "https://hk.linkedin.com/jobs/view/senior-data-governance-manager-at-all-star-agency-4385638949", source: "LinkedIn", desc: "Senior Data Governance Manager position placed by ALL-STAR AGENCY." },
  { title: "AVP, Data Governance & Analytics (Corporate Bank)", company: "ALL-STAR AGENCY", location: "Hong Kong", salary: "Not disclosed", posted: "2 weeks ago", url: "https://hk.linkedin.com/jobs/view/assistant-vice-president-data-governance-analytics-corporate-bank-at-all-star-agency-4376018495", source: "LinkedIn", desc: "AVP-level Data Governance & Analytics role within a corporate bank." },
  { title: "VP - Data Governance & Analytics (Corporate Bank)", company: "ALL-STAR AGENCY", location: "Hong Kong", salary: "Not disclosed", posted: "1 week ago", url: "https://hk.linkedin.com/jobs/view/vice-president-data-governance-analytics-corporate-bank-at-all-star-agency-4368094370", source: "LinkedIn", desc: "Vice President level Data Governance & Analytics at a corporate bank." },
  { title: "Data Governance Manager - Banking", company: "ALL-STAR AGENCY", location: "Hong Kong", salary: "Not disclosed", posted: "3 weeks ago", url: "https://hk.linkedin.com/jobs/view/data-governance-manager-banking-at-all-star-agency-4384241452", source: "LinkedIn", desc: "Data Governance Manager for a banking institution." },
  { title: "Business Analyst, Data Governance - Investment Bank (9-mth)", company: "Hays", location: "Hong Kong", salary: "Not disclosed", posted: "1 week ago", url: "https://hk.linkedin.com/jobs/view/business-analyst-data-governance-investment-bank-9-mth-at-hays-4393506861", source: "LinkedIn", desc: "9-month contract BA role focused on Data Governance at an investment bank." },
  { title: "Senior Manager, Data Governance (3-yr contract)", company: "HK Jockey Club", location: "Sha Tin", salary: "Not disclosed", posted: "1 week ago", url: "https://hk.linkedin.com/jobs/view/senior-manager-data-governance-3-years-contract-at-the-hong-kong-jockey-club-4381973470", source: "LinkedIn", desc: "Senior Manager, Data Governance on a 3-year contract at HKJC." },
  { title: "Consultant / Senior Consultant (Data Governance) - AI & Data", company: "Deloitte", location: "Hong Kong", salary: "Not disclosed", posted: "2 days ago", url: "https://hk.linkedin.com/jobs/view/consultant-senior-consultant-data-governance-ai-data-hong-kong-314898-at-deloitte-4304521977", source: "LinkedIn", desc: "Data Governance within Deloitte's AI & Data practice." },
  { title: "Director, IT & Data Governance", company: "Mandarin Oriental", location: "Hong Kong", salary: "Not disclosed", posted: "2 weeks ago", url: "https://hk.linkedin.com/jobs/view/director-it-data-governance-at-mandarin-oriental-4369354258", source: "LinkedIn", desc: "Director-level IT & Data Governance at Mandarin Oriental Hotel Group." },
  { title: "Operations Data Governance & Strategy, Senior Analyst", company: "AIA", location: "Hong Kong", salary: "Not disclosed", posted: "1 week ago", url: "https://hk.linkedin.com/jobs/view/operations-data-governance-data-strategy-senior-analyst-at-aia-hong-kong-and-macau-4363086285", source: "LinkedIn", desc: "Senior Analyst in Operations Data Governance & Data Strategy at AIA." },
  { title: "Operations Data Governance & Strategy, Principal", company: "AIA", location: "Hong Kong", salary: "Not disclosed", posted: "1 week ago", url: "https://hk.linkedin.com/jobs/view/operations-data-governance-data-strategy-principal-at-aia-hong-kong-and-macau-4363182766", source: "LinkedIn", desc: "Principal-level Operations Data Governance & Strategy at AIA." },
  { title: "Data & Cyber Security Governance Lead", company: "PFCC Group", location: "Hong Kong", salary: "Not disclosed", posted: "5 days ago", url: "https://hk.linkedin.com/jobs/view/data-cyber-security-governance-lead-leading-investment-bank-at-pfcc-group-4390429790", source: "LinkedIn", desc: "Combined Data & Cyber Security Governance Lead at leading investment bank." },
  { title: "Head of Global Technology Governance & Compliance", company: "Ant International", location: "Hong Kong", salary: "Not disclosed", posted: "5 days ago", url: "https://hk.linkedin.com/jobs/view/head-of-global-technology-governance-compliance-at-ant-international-4393422165", source: "LinkedIn", desc: "Head of Global Technology Governance & Compliance at Ant International (Alibaba)." },
  { title: "Manager, Operations AI Governance", company: "Prudential HK", location: "Hong Kong", salary: "Not disclosed", posted: "1 week ago", url: "https://hk.linkedin.com/jobs/view/manager-operations-ai-governance-at-prudential-hong-kong-4378795283", source: "LinkedIn", desc: "Dedicated Operations AI Governance role at Prudential Hong Kong." },
  { title: "Head of A.I. Services - Innovation Office", company: "Bank of East Asia", location: "Hong Kong", salary: "Not disclosed", posted: "2 weeks ago", url: "https://hk.linkedin.com/jobs/view/head-of-a-i-services-innovation-office-at-the-bank-of-east-asia-bea-4388605093", source: "LinkedIn", desc: "Head of AI Services — AI research, deployment, governance & regulatory compliance at BEA." },
  { title: "Chief AI Officer", company: "AXA HK & Macau", location: "Hong Kong", salary: "Not disclosed", posted: "2 months ago", url: "https://hk.linkedin.com/jobs/view/chief-ai-officer-at-axa-hong-kong-and-macau-4363665399", source: "LinkedIn", desc: "C-suite Chief AI Officer at AXA Hong Kong and Macau." },
  { title: "Senior Legal Counsel, Data Privacy", company: "Tencent", location: "Hong Kong", salary: "Not disclosed", posted: "3 weeks ago", url: "https://hk.linkedin.com/jobs/view/senior-legal-counsel-data-privacy-at-tencent-4383516558", source: "LinkedIn", desc: "Senior Legal Counsel specializing in Data Privacy at Tencent." },
  { title: "Legal Counsel (Manager) - Data Protection/Privacy", company: "PwC", location: "Hong Kong", salary: "Not disclosed", posted: "1 month ago", url: "https://hk.linkedin.com/jobs/view/legal-counsel-manager-data-protection-data-privacy-at-pwc-4321523763", source: "LinkedIn", desc: "Manager-level Legal Counsel in Data Protection and Privacy at PwC." },
  { title: "Privacy & Compliance Counsel", company: "Legal.io", location: "Hong Kong", salary: "Not disclosed", posted: "5 days ago", url: "https://hk.linkedin.com/jobs/view/privacy-compliance-counsel-at-legal-io-4395719043", source: "LinkedIn", desc: "Privacy & Compliance Counsel role placed through Legal.io." },
  { title: "Head of Cross-Border Data & Control", company: "Ant International", location: "Hong Kong", salary: "Not disclosed", posted: "5 days ago", url: "https://hk.linkedin.com/jobs/view/head-of-cross-border-data-control-at-ant-international-4393411703", source: "LinkedIn", desc: "Cross-border data governance and privacy compliance at Ant International." },
  { title: "Data Governance Specialist - Finance Consulting", company: "KPMG China", location: "Wong Chuk Hang", salary: "Not disclosed", posted: "9 months ago", url: "https://hk.linkedin.com/jobs/view/data-governance-specialist-senior-consultant-manager-associate-director-finance-consulting-at-kpmg-china-4248508904", source: "LinkedIn", desc: "Multiple seniority levels in KPMG's Finance Consulting Data Governance practice." },
  { title: "Cyber Security - Privacy - Senior Associate", company: "EY", location: "Hong Kong", salary: "Not disclosed", posted: "1 week ago", url: "https://hk.linkedin.com/jobs/view/technology-consulting-cyber-security-privacy-senior-associate-hong-kong-at-ey-4320042341", source: "LinkedIn", desc: "EY Technology Consulting focused on Cyber Security & Privacy." },

  // eFinancialCareers
  { title: "Head of Data Science & Governance", company: "Undisclosed Bank", location: "Hong Kong", salary: "Not disclosed", posted: "Recent", url: "https://hk.linkedin.com/jobs/view/head-of-data-science-governance-at-jobs-via-efinancialcareers-4008720108", source: "eFinancialCareers", desc: "Drive strategy of data as business asset. Lead data science, AI/ML strategy, and governance frameworks." },
  { title: "AI and Data Governance Manager", company: "Undisclosed Bank", location: "Hong Kong", salary: "Negotiable", posted: "2026-03-09", url: "https://www.ambition.com.hk/job/ai-and-data-governance-manager-5836821", source: "eFinancialCareers", desc: "Shape bank's data strategy, drive AI/data initiatives, embed robust governance frameworks." },
  { title: "Technology Consulting - AI & Data Governance - Manager", company: "EY", location: "Hong Kong", salary: "Not disclosed", posted: "Recent", url: "https://hk.linkedin.com/jobs/data-governance-manager-jobs", source: "eFinancialCareers", desc: "End-to-end implementation of data environments and governance frameworks for financial services clients." },
  { title: "Manager, Data Management / Data Governance", company: "Dah Sing Bank", location: "Hong Kong", salary: "Not disclosed", posted: "Recent", url: "https://hk.linkedin.com/jobs/data-governance-manager-jobs", source: "eFinancialCareers", desc: "Data management and governance at Dah Sing Bank. Data quality, metadata, regulatory compliance." },

  // Indeed
  { title: "Consulting - Data Strategy & Governance - Senior Manager", company: "EY", location: "Hong Kong", salary: "Not disclosed", posted: "Recent", url: "https://hk.indeed.com/jobs?q=data+governance&l=Hong+Kong&vjk=0fbaed09ed0b5fa4", source: "Indeed", desc: "Senior Manager providing end-to-end data strategy and governance for financial services." },
  { title: "Consultant / Senior Consultant (Data Governance)", company: "Deloitte", location: "Hong Kong", salary: "Not disclosed", posted: "Recent", url: "https://hk.indeed.com/jobs?q=data+governance&l=Hong+Kong&vjk=08e852dd236f65f9", source: "Indeed", desc: "Data governance frameworks, metadata management, data standards, data quality management." },
  { title: "Senior Strategy PMO / Project Manager (AI & Org Efficiency)", company: "OKX", location: "Hong Kong", salary: "Not disclosed", posted: "Recent", url: "https://hk.indeed.com/jobs?q=AI+governance&l=Hong+Kong&vjk=af9ac859ad3613f7", source: "Indeed", desc: "Project governance frameworks for AI and organizational efficiency. Crypto exchange." },
  { title: "Digital Intelligence Mgr (AI Application)", company: "China Mobile", location: "Hong Kong", salary: "Not disclosed", posted: "Recent", url: "https://hk.indeed.com/jobs?q=AI+governance&l=Hong+Kong&vjk=47c0fda8f0c89b87", source: "Indeed", desc: "AI architecture governance, model version management, data privacy protection, AI ethics review." },
  { title: "(Senior) Data Analyst (AI Data Management)", company: "Bank of China (HK)", location: "Hong Kong", salary: "Not disclosed", posted: "Recent", url: "https://hk.indeed.com/jobs?q=data+privacy&l=Hong+Kong&vjk=0ba52e5869a3106c", source: "Indeed", desc: "AI models for data classification, sensitive data identification, anomaly detection. Privacy & governance." },
  { title: "Legal Consultant - Data Privacy", company: "Axiom Law", location: "Hong Kong", salary: "Competitive", posted: "Recent", url: "https://hk.indeed.com/jobs?q=data+privacy&l=Hong+Kong&vjk=74f271d385979cbd", source: "Indeed", desc: "Legal advice on data privacy and PIAs to F500 clients. Qualified lawyer or privacy professional, 2+ PQE." },
  { title: "Manager I, AI & Automation", company: "Avnet", location: "Kowloon Bay", salary: "Not disclosed", posted: "Recent", url: "https://hk.indeed.com/jobs?q=AI+governance&l=Hong+Kong&vjk=83bf40980fbcfe14", source: "Indeed", desc: "AI governance, ethical AI principles, data privacy frameworks. Governance, standardization, secure AI." },
  { title: "Data Analytics & AI Consulting Manager", company: "Classy Wheeler", location: "Quarry Bay", salary: "Not disclosed", posted: "Recent", url: "https://hk.indeed.com/jobs?q=AI+governance&l=Hong+Kong&vjk=ca048765e87be0d5", source: "Indeed", desc: "Data consulting — governance frameworks, tool-kits, accelerators for data and AI strategy delivery." }
];
