// ============================================
// HK Job Market Terminal — Application Logic
// ============================================

(function() {
  'use strict';

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

      // Scroll main to top
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

  // ---- Category Color Map ----
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
    'LOCAL EMPLOYMENT': '本地就業',
    'FINTECH': 'FINTECH'
  };

  // ---- Render News ----
  function renderNews(filter) {
    const container = document.getElementById('news-list');
    const filtered = filter === 'all'
      ? NEWS_DATA
      : NEWS_DATA.filter(n => n.category === filter);

    // Sort by date descending
    const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = sorted.map(n => {
      const d = new Date(n.date);
      const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const sentClass = 'sentiment-' + n.sentiment;
      const sentLabel = n.sentiment === 'positive' ? '▲ Positive' : n.sentiment === 'negative' ? '▼ Negative' : '— Neutral';
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

  // News filter buttons
  document.querySelectorAll('.news-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.news-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderNews(btn.dataset.filter);
    });
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

    // Counts
    const counts = {};
    JOBS_DATA.forEach(j => { counts[j.source] = (counts[j.source] || 0) + 1; });
    const total = filtered.length;
    const totalAll = JOBS_DATA.length;

    if (sourceFilter === 'all') {
      statsEl.textContent = `${totalAll} listings — JobsDB: ${counts['JobsDB']||0} · LinkedIn: ${counts['LinkedIn']||0} · eFinancialCareers: ${counts['eFinancialCareers']||0} · Indeed: ${counts['Indeed']||0}`;
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
              <span class="job-detail">⌖ ${j.location}</span>
              ${salaryDisplay}
            </div>
            <div class="job-desc">${j.desc}</div>
          </div>
          <div class="job-right">
            <span class="job-source ${srcClass}">${j.source}</span>
            <span class="job-posted">${j.posted}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Jobs filter buttons
  document.querySelectorAll('.jobs-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.jobs-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderJobs(btn.dataset.source);
    });
  });
  // Inject last-updated timestamp from data.js
(function () {
  const el = document.getElementById('last-updated-display');
  if (el && typeof LAST_UPDATED !== 'undefined') {
    el.textContent = 'Last refreshed: ' + LAST_UPDATED;
  }
})();

  renderJobs('all');

})();
