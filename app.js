// ============================================
// HK Job Market Terminal — Application Logic
// All rendering driven by data.js constants
// ============================================

(function() {
  'use strict';

  // ---- Meta ----
  document.getElementById('status-text').textContent = 'LIVE \u00b7 Updated ' + META.updated;
  document.getElementById('version-tag').textContent = META.version;

  // ---- Theme Toggle ----
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');
  const root = document.documentElement;

  function getInitialTheme() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('theme') === 'light') return 'light';
    if (params.get('theme') === 'dark') return 'dark';
    try { const s = window['local' + 'Storage'].getItem('hk-dashboard-theme'); if (s) return s; } catch(e) {}
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }

  const initialTheme = getInitialTheme();
  root.setAttribute('data-theme', initialTheme);
  updateThemeUI(initialTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { window['local' + 'Storage'].setItem('hk-dashboard-theme', next); } catch(e) {}
    updateThemeUI(next);
  });

  function updateThemeUI(theme) {
    if (theme === 'light') {
      themeIcon.textContent = '\u263E';
      themeLabel.textContent = 'Dark';
    } else {
      themeIcon.textContent = '\u2600';
      themeLabel.textContent = 'Light';
    }
  }

  // ---- Tab Navigation ----
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      panels.forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + target).classList.add('active');
      document.querySelector('.main-content').scrollTop = 0;
    });
  });

  // ---- Keyboard nav for tabs ----
  document.querySelector('.tabbar').addEventListener('keydown', (e) => {
    const active = document.querySelector('.tab.active');
    const allTabs = Array.from(tabs);
    const idx = allTabs.indexOf(active);
    let next;
    if (e.key === 'ArrowRight') next = allTabs[(idx + 1) % allTabs.length];
    if (e.key === 'ArrowLeft') next = allTabs[(idx - 1 + allTabs.length) % allTabs.length];
    if (next) { next.click(); next.focus(); }
  });

  // ---- Render KPI Cards ----
  const kpiGrid = document.getElementById('kpi-grid');
  kpiGrid.innerHTML = KPI_DATA.map(k => {
    const valClass = k.valueClass ? ' ' + k.valueClass : '';
    return `
      <a class="kpi-card kpi-link" href="${k.sourceUrl}" target="_blank" rel="noopener">
        <div class="kpi-label">${k.label}</div>
        <div class="kpi-value${valClass}">${k.value}</div>
        <div class="kpi-delta ${k.deltaClass}">${k.delta}</div>
        <div class="kpi-period">${k.period} \u00b7 ${k.source} \u2197</div>
      </a>
    `;
  }).join('');

  // ---- Render Signal Board ----
  const signalGrid = document.getElementById('signal-grid');
  const signalSentMap = { positive: 'signal-positive', negative: 'signal-negative', caution: 'signal-caution' };
  const signalIconMap = { positive: '\u25b2', negative: '\u25bc', caution: '\u25c6' };

  signalGrid.innerHTML = SIGNAL_DATA.map(s => {
    const cls = signalSentMap[s.sentiment] || 'signal-caution';
    const icon = signalIconMap[s.sentiment] || '\u25c6';
    return `
      <div class="signal-card ${cls}">
        <div class="signal-icon">${icon}</div>
        <div class="signal-body">
          <div class="signal-title">${s.title}</div>
          <div class="signal-desc">${s.desc}</div>
          <a class="signal-source" href="${s.sourceUrl}" target="_blank" rel="noopener">${s.sourceLabel} \u2197</a>
        </div>
      </div>
    `;
  }).join('');

  // ---- Render Macro Tables ----
  function renderMacroTable(data, tbodyId) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = data.map(row => {
      const curClass = row.currentClass ? ' ' + row.currentClass : '';
      const badgeClass = 'badge-' + row.trendClass;
      return `
        <tr>
          <td class="indicator-name">${row.indicator}</td>
          <td class="mono${curClass}">${row.current}</td>
          <td class="mono">${row.previous}</td>
          <td><span class="badge ${badgeClass}">${row.trend}</span></td>
          <td>${row.implication}</td>
          <td><a href="${row.sourceUrl}" target="_blank">${row.sourceLabel} \u2197</a></td>
        </tr>
      `;
    }).join('');
  }

  renderMacroTable(HK_MACRO_DATA, 'hk-macro-tbody');
  renderMacroTable(GLOBAL_DATA, 'global-macro-tbody');

  // ---- Category Color & Short Name Maps ----
  const catColorMap = {
    'POLICY & REGULATION': 'cat-policy',
    'CORPORATE': 'cat-corporate',
    'TECHNOLOGY & AI': 'cat-tech',
    'FINANCIAL SECTOR': 'cat-financial',
    'TRADE & GEOPOLITICS': 'cat-trade',
    'US TARIFFS': 'cat-tariffs',
    'DATA GOVERNANCE & PRIVACY': 'cat-data',
    'CHINA MAINLAND': 'cat-china',
    'REAL ESTATE & COST': 'cat-realestate',
    'GLOBAL': 'cat-global',
    'LOCAL EMPLOYMENT': 'cat-localemploy',
    'FINTECH': 'cat-fintech'
  };

  const catShortMap = {
    'POLICY & REGULATION': 'POLICY',
    'CORPORATE': 'CORPORATE',
    'TECHNOLOGY & AI': 'TECH/AI',
    'FINANCIAL SECTOR': 'FINANCE',
    'TRADE & GEOPOLITICS': 'TRADE',
    'US TARIFFS': 'TARIFFS',
    'DATA GOVERNANCE & PRIVACY': 'DATA GOV',
    'CHINA MAINLAND': 'CHINA/GBA',
    'REAL ESTATE & COST': 'PROPERTY',
    'GLOBAL': 'GLOBAL',
    'LOCAL EMPLOYMENT': '\u672c\u5730\u5c31\u696d',
    'FINTECH': 'FINTECH'
  };

  const catFilterLabel = {
    'POLICY & REGULATION': 'Policy',
    'CORPORATE': 'Corporate',
    'TECHNOLOGY & AI': 'Tech & AI',
    'FINANCIAL SECTOR': 'Financial',
    'TRADE & GEOPOLITICS': 'Trade',
    'US TARIFFS': 'Tariffs',
    'DATA GOVERNANCE & PRIVACY': 'Data Gov',
    'CHINA MAINLAND': 'China/GBA',
    'REAL ESTATE & COST': 'Real Estate',
    'GLOBAL': 'Global',
    'LOCAL EMPLOYMENT': '\u672c\u5730\u5c31\u696d',
    'FINTECH': 'Fintech'
  };

  // ---- Build News Filter Buttons Dynamically ----
  const newsFiltersEl = document.getElementById('news-filters');
  const usedCategories = [...new Set(NEWS_DATA.map(n => n.category))];
  const catOrder = [
    'POLICY & REGULATION', 'CORPORATE', 'TECHNOLOGY & AI', 'FINANCIAL SECTOR',
    'TRADE & GEOPOLITICS', 'US TARIFFS', 'DATA GOVERNANCE & PRIVACY',
    'CHINA MAINLAND', 'REAL ESTATE & COST', 'GLOBAL', 'LOCAL EMPLOYMENT', 'FINTECH'
  ];
  const sortedCats = catOrder.filter(c => usedCategories.includes(c));
  usedCategories.forEach(c => { if (!sortedCats.includes(c)) sortedCats.push(c); });

  let filterHTML = '<button class="filter-btn active" data-filter="all">All</button>';
  sortedCats.forEach(cat => {
    const label = catFilterLabel[cat] || cat;
    filterHTML += `<button class="filter-btn" data-filter="${cat}">${label}</button>`;
  });
  newsFiltersEl.innerHTML = filterHTML;

  // ---- Render News ----
  function renderNews(filter) {
    const container = document.getElementById('news-list');
    const filtered = filter === 'all'
      ? NEWS_DATA
      : NEWS_DATA.filter(n => n.category === filter);

    const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = sorted.map(n => {
      const d = new Date(n.date);
      const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const sentClass = 'sentiment-' + n.sentiment;
      const sentLabel = n.sentiment === 'positive' ? '\u25b2 Positive' : n.sentiment === 'negative' ? '\u25bc Negative' : '\u2014 Neutral';
      const catClass = catColorMap[n.category] || 'cat-global';
      const catLabel = catShortMap[n.category] || n.category;

      return `
        <div class="news-item" data-category="${n.category}">
          <div class="news-date">${dateStr}</div>
          <div class="news-body">
            <div class="news-headline"><a href="${n.url}" target="_blank" rel="noopener">${n.headline}</a></div>
            <div class="news-impact">${n.impact}</div>
          </div>
          <div class="news-meta">
            <span class="news-category ${catClass}">${catLabel}</span>
            <span class="news-sentiment ${sentClass}">${sentLabel}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  newsFiltersEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    newsFiltersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderNews(btn.dataset.filter);
  });

  renderNews('all');

  // ---- Source Color Map ----
  const sourceColorMap = {
    'JobsDB': 'source-jobsdb',
    'LinkedIn': 'source-linkedin',
    'eFinancialCareers': 'source-efinancialcareers',
    'Indeed': 'source-indeed'
  };

  // ---- Render Jobs ----
  function renderJobs(sourceFilter) {
    const container = document.getElementById('jobs-list');
    const statsEl = document.getElementById('jobs-stats');
    const filtered = sourceFilter === 'all'
      ? JOBS_DATA
      : JOBS_DATA.filter(j => j.source === sourceFilter);

    const counts = {};
    JOBS_DATA.forEach(j => { counts[j.source] = (counts[j.source] || 0) + 1; });
    const total = filtered.length;
    const totalAll = JOBS_DATA.length;

    if (sourceFilter === 'all') {
      statsEl.textContent = `${totalAll} listings \u2014 JobsDB: ${counts['JobsDB']||0} \u00b7 LinkedIn: ${counts['LinkedIn']||0} \u00b7 eFinancialCareers: ${counts['eFinancialCareers']||0} \u00b7 Indeed: ${counts['Indeed']||0}`;
    } else {
      statsEl.textContent = `${total} listings from ${sourceFilter}`;
    }

    container.innerHTML = filtered.map(j => {
      const srcClass = sourceColorMap[j.source] || '';
      const salaryDisplay = j.salary && j.salary !== 'Not disclosed'
        ? `<span class="job-detail job-salary">$ ${j.salary}</span>`
        : '';

      return `
        <div class="job-item">
          <div class="job-main">
            <div class="job-title"><a href="${j.url}" target="_blank" rel="noopener">${j.title}</a></div>
            <div class="job-company">${j.company}</div>
            <div class="job-details">
              <span class="job-detail">\u2316 ${j.location}</span>
              ${salaryDisplay}
            </div>
            <div class="job-desc">${j.desc}</div>
          </div>
          <div class="job-right">
            <span class="job-source ${srcClass}">${j.source}</span>
            <span class="job-posted">Posted: ${j.posted}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  document.querySelectorAll('.jobs-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.jobs-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderJobs(btn.dataset.source);
    });
  });

  renderJobs('all');

})();
