/**
 * InsightFlow Analytics — Enterprise BI Dashboard Interactive Application
 * Modern Vanilla JS Architecture · High Performance · No Dependencies
 */

(function () {
  'use strict';

  // Application State
  const AppState = {
    theme: localStorage.getItem('insightflow_theme') || 
           (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    currency: 'USD',
    dateRange: '30d',
    soundEnabled: true,
    notifications: [],
    realtimeActive: true
  };

  // Theme Management Engine
  const ThemeEngine = {
    init() {
      this.applyTheme(AppState.theme, false);
      const toggleBtn = document.querySelector('.darkmode-btn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => this.toggle());
      }

      // Listen for OS system theme change
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
          if (!localStorage.getItem('insightflow_theme')) {
            this.applyTheme(e.matches ? 'dark' : 'light', true);
          }
        });
      }
    },

    toggle() {
      const nextTheme = AppState.theme === 'dark' ? 'light' : 'dark';
      this.applyTheme(nextTheme, true);
    },

    applyTheme(theme, save = true) {
      AppState.theme = theme;
      if (save) {
        localStorage.setItem('insightflow_theme', theme);
      }
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      this.updateToggleButton(theme);
    },

    updateToggleButton(theme) {
      const btn = document.querySelector('.darkmode-btn');
      if (!btn) return;
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.title = theme === 'dark' ? 'Switch to light mode (D)' : 'Switch to dark mode (D)';
      
      if (theme === 'dark') {
        // Sun Icon for Dark Mode
        btn.innerHTML = `
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        `;
      } else {
        // Moon Icon for Light Mode
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        `;
      }
    }
  };

  // Toast Notification Engine
  const ToastEngine = {
    container: null,

    init() {
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        this.container.setAttribute('aria-live', 'polite');
        document.body.appendChild(this.container);
      }
    },

    show({ title = 'Notification', message = '', type = 'info', duration = 4000 } = {}) {
      this.init();

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.setAttribute('role', 'alert');

      const icons = {
        success: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
        info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        warning: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        error: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
      };

      toast.innerHTML = `
        <div class="toast-icon ${type}">
          ${icons[type] || icons.info}
        </div>
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          ${message ? `<div class="toast-desc">${message}</div>` : ''}
        </div>
        <button class="toast-close" aria-label="Dismiss">&times;</button>
        <div class="toast-bar ${type}" style="animation-duration: ${duration}ms;"></div>
      `;

      const removeToast = () => {
        toast.classList.add('toast-exit');
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 250);
      };

      toast.querySelector('.toast-close').addEventListener('click', removeToast);
      const timer = setTimeout(removeToast, duration);

      toast.addEventListener('mouseenter', () => clearTimeout(timer));
      toast.addEventListener('mouseleave', () => setTimeout(removeToast, 1500));

      this.container.appendChild(toast);
      return toast;
    }
  };

  // Counter Animation Engine
  const CounterEngine = {
    animateValue(element, start, end, duration, prefix = '', suffix = '', decimals = 0) {
      const startTime = performance.now();
      const diff = end - start;

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = start + diff * ease;

        const formatted = current.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });

        element.textContent = `${prefix}${formatted}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    },

    animateAllKPIs() {
      const kpis = document.querySelectorAll('.kpi-value');
      kpis.forEach((el) => {
        const rawText = el.textContent.trim();
        const prefix = rawText.startsWith('$') ? '$' : '';
        const suffix = rawText.endsWith('%') ? '%' : '';
        const cleanNumber = rawText.replace(/[^0-9.-]+/g, '');
        const target = parseFloat(cleanNumber);
        if (!isNaN(target)) {
          const decimals = cleanNumber.includes('.') ? cleanNumber.split('.')[1].length : 0;
          el.setAttribute('data-target', target);
          el.setAttribute('data-prefix', prefix);
          el.setAttribute('data-suffix', suffix);
          el.setAttribute('data-decimals', decimals);
          this.animateValue(el, 0, target, 1200, prefix, suffix, decimals);
        }
      });
    }
  };

  // Date Range Filtering Engine
  const DateRangeEngine = {
    data: {
      today: {
        revenue: { val: 142500, prefix: '$', suffix: '', decimals: 0, change: '+6.4%', period: 'vs. $133,900 yesterday' },
        sales: { val: 940, prefix: '', suffix: '', decimals: 0, change: '+4.2%', period: 'vs. 902 yesterday' },
        orders: { val: 482, prefix: '', suffix: '', decimals: 0, change: '+3.8%', period: 'vs. 464 yesterday' },
        aov: { val: 295.60, prefix: '$', suffix: '', decimals: 2, change: '+1.2%', period: 'vs. $292.10 yesterday' },
        growth: { val: 124, prefix: '', suffix: '', decimals: 0, change: '+18.5%', period: 'New customers today' },
        conversion: { val: 7.10, prefix: '', suffix: '%', decimals: 2, change: '+0.4%', period: 'vs. 6.70% yesterday' }
      },
      '7d': {
        revenue: { val: 982400, prefix: '$', suffix: '', decimals: 0, change: '+14.2%', period: 'vs. $860,200 prior 7 days' },
        sales: { val: 6420, prefix: '', suffix: '', decimals: 0, change: '+10.8%', period: 'vs. 5,790 prior 7 days' },
        orders: { val: 3210, prefix: '', suffix: '', decimals: 0, change: '+8.4%', period: 'vs. 2,960 prior 7 days' },
        aov: { val: 306.04, prefix: '$', suffix: '', decimals: 2, change: '+4.1%', period: 'vs. $293.98 prior 7 days' },
        growth: { val: 890, prefix: '', suffix: '', decimals: 0, change: '+19.2%', period: 'New customers this week' },
        conversion: { val: 6.95, prefix: '', suffix: '%', decimals: 2, change: '+0.2%', period: 'vs. 6.75% prior 7 days' }
      },
      '30d': {
        revenue: { val: 4287600, prefix: '$', suffix: '', decimals: 0, change: '+18.4%', period: 'vs. $3,620,400 last month' },
        sales: { val: 28941, prefix: '', suffix: '', decimals: 0, change: '+12.7%', period: 'vs. 25,674 last month' },
        orders: { val: 14382, prefix: '', suffix: '', decimals: 0, change: '+9.2%', period: 'vs. 13,171 last month' },
        aov: { val: 298.10, prefix: '$', suffix: '', decimals: 2, change: '+5.8%', period: 'vs. $281.76 last month' },
        growth: { val: 3847, prefix: '', suffix: '', decimals: 0, change: '+22.1%', period: 'New customers this month' },
        conversion: { val: 6.84, prefix: '', suffix: '%', decimals: 2, change: '-1.3%', period: 'vs. 6.93% last month' }
      },
      q2: {
        revenue: { val: 12840000, prefix: '$', suffix: '', decimals: 0, change: '+24.8%', period: 'vs. $10,288,000 in Q1' },
        sales: { val: 86400, prefix: '', suffix: '', decimals: 0, change: '+16.5%', period: 'vs. 74,160 in Q1' },
        orders: { val: 42800, prefix: '', suffix: '', decimals: 0, change: '+14.1%', period: 'vs. 37,500 in Q1' },
        aov: { val: 300.00, prefix: '$', suffix: '', decimals: 2, change: '+7.2%', period: 'vs. $279.80 in Q1' },
        growth: { val: 11420, prefix: '', suffix: '', decimals: 0, change: '+28.4%', period: 'New customers in Q2' },
        conversion: { val: 6.88, prefix: '', suffix: '%', decimals: 2, change: '+0.6%', period: 'vs. 6.28% in Q1' }
      },
      ytd: {
        revenue: { val: 24650000, prefix: '$', suffix: '', decimals: 0, change: '+26.4%', period: 'Jan 1 – Jun 30, 2025' },
        sales: { val: 168200, prefix: '', suffix: '', decimals: 0, change: '+18.2%', period: 'Jan 1 – Jun 30, 2025' },
        orders: { val: 83100, prefix: '', suffix: '', decimals: 0, change: '+15.9%', period: 'Jan 1 – Jun 30, 2025' },
        aov: { val: 296.63, prefix: '$', suffix: '', decimals: 2, change: '+6.5%', period: 'YTD average' },
        growth: { val: 21850, prefix: '', suffix: '', decimals: 0, change: '+31.2%', period: 'New customers YTD' },
        conversion: { val: 6.79, prefix: '', suffix: '%', decimals: 2, change: '+0.3%', period: 'YTD average conversion' }
      },
      '1y': {
        revenue: { val: 46200000, prefix: '$', suffix: '', decimals: 0, change: '+21.0%', period: 'Full Year 2024 total' },
        sales: { val: 312000, prefix: '', suffix: '', decimals: 0, change: '+15.0%', period: 'Full Year 2024 total' },
        orders: { val: 155000, prefix: '', suffix: '', decimals: 0, change: '+12.4%', period: 'Full Year 2024 total' },
        aov: { val: 298.06, prefix: '$', suffix: '', decimals: 2, change: '+5.1%', period: '2024 average' },
        growth: { val: 39500, prefix: '', suffix: '', decimals: 0, change: '+24.6%', period: 'Total new customers 2024' },
        conversion: { val: 6.75, prefix: '', suffix: '%', decimals: 2, change: '+0.1%', period: '2024 average conversion' }
      }
    },

    init() {
      const wrap = document.querySelector('.date-picker-wrap');
      const btn = document.getElementById('datePickerBtn');
      const menu = document.getElementById('datePickerMenu');

      if (!btn || !wrap || !menu) return;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        wrap.classList.toggle('active');
        btn.setAttribute('aria-expanded', wrap.classList.contains('active'));
      });

      document.addEventListener('click', (e) => {
        if (!wrap.contains(e.target)) {
          wrap.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      menu.querySelectorAll('.dropdown-item').forEach((item) => {
        item.addEventListener('click', () => {
          const range = item.getAttribute('data-range');
          menu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');

          const label = item.textContent.trim();
          const labelSpan = btn.querySelector('.selected-date-text');
          if (labelSpan) labelSpan.textContent = label;

          wrap.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');

          this.applyRange(range, label);
        });
      });
    },

    applyRange(range, label) {
      AppState.dateRange = range;
      const metrics = this.data[range];
      if (!metrics) return;

      Object.keys(metrics).forEach((kpiKey) => {
        const card = document.querySelector(`.kpi-card[data-kpi="${kpiKey}"]`);
        if (!card) return;

        const valEl = card.querySelector('.kpi-value');
        const badgeEl = card.querySelector('.kpi-badge');
        const periodEl = card.querySelector('.kpi-period');
        const m = metrics[kpiKey];

        if (valEl) {
          const currentVal = parseFloat(valEl.getAttribute('data-target')) || 0;
          valEl.setAttribute('data-target', m.val);
          valEl.setAttribute('data-prefix', m.prefix);
          valEl.setAttribute('data-suffix', m.suffix);
          valEl.setAttribute('data-decimals', m.decimals);
          CounterEngine.animateValue(valEl, currentVal, m.val, 900, m.prefix, m.suffix, m.decimals);
        }

        if (badgeEl && m.change) {
          badgeEl.textContent = m.change;
          const isUp = !m.change.startsWith('-');
          badgeEl.className = `kpi-badge ${isUp ? 'up' : 'down'}`;
        }

        if (periodEl && m.period) {
          periodEl.textContent = m.period;
        }
      });

      ToastEngine.show({
        title: 'Date Range Updated',
        message: `Dashboard data recalculated for ${label}`,
        type: 'info',
        duration: 3000
      });
    }
  };

  // Currency Converter Engine
  const CurrencyEngine = {
    rates: {
      USD: { rate: 1, symbol: '$', code: 'USD' },
      EUR: { rate: 0.92, symbol: '€', code: 'EUR' },
      GBP: { rate: 0.78, symbol: '£', code: 'GBP' },
      IDR: { rate: 16200, symbol: 'Rp ', code: 'IDR' }
    },

    init() {
      const wrap = document.querySelector('.currency-wrap');
      const btn = document.getElementById('currencyBtn');
      const menu = document.getElementById('currencyMenu');

      if (!btn || !wrap || !menu) return;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        wrap.classList.toggle('active');
        btn.setAttribute('aria-expanded', wrap.classList.contains('active'));
      });

      document.addEventListener('click', (e) => {
        if (!wrap.contains(e.target)) {
          wrap.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      menu.querySelectorAll('.dropdown-item').forEach((item) => {
        item.addEventListener('click', () => {
          const currency = item.getAttribute('data-currency');
          menu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');

          const label = item.textContent.trim();
          const btnLabel = btn.querySelector('.currency-symbol-label');
          if (btnLabel) btnLabel.textContent = `${currency} (${this.rates[currency].symbol.trim()})`;

          wrap.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');

          this.switchCurrency(currency);
        });
      });
    },

    switchCurrency(currency) {
      AppState.currency = currency;
      const { rate, symbol } = this.rates[currency];

      // Update Revenue and AOV KPI cards
      const revenueCard = document.querySelector('.kpi-card[data-kpi="revenue"]');
      if (revenueCard) {
        const valEl = revenueCard.querySelector('.kpi-value');
        const baseUSD = DateRangeEngine.data[AppState.dateRange].revenue.val;
        const converted = Math.round(baseUSD * rate);
        const current = parseFloat(valEl.getAttribute('data-target')) || 0;
        valEl.setAttribute('data-target', converted);
        valEl.setAttribute('data-prefix', symbol);
        CounterEngine.animateValue(valEl, current, converted, 800, symbol, '', 0);
      }

      const aovCard = document.querySelector('.kpi-card[data-kpi="aov"]');
      if (aovCard) {
        const valEl = aovCard.querySelector('.kpi-value');
        const baseUSD = DateRangeEngine.data[AppState.dateRange].aov.val;
        const converted = currency === 'IDR' ? Math.round(baseUSD * rate) : parseFloat((baseUSD * rate).toFixed(2));
        const decimals = currency === 'IDR' ? 0 : 2;
        const current = parseFloat(valEl.getAttribute('data-target')) || 0;
        valEl.setAttribute('data-target', converted);
        valEl.setAttribute('data-prefix', symbol);
        valEl.setAttribute('data-decimals', decimals);
        CounterEngine.animateValue(valEl, current, converted, 800, symbol, '', decimals);
      }

      ToastEngine.show({
        title: 'Currency Converted',
        message: `Metrics updated to ${currency} at current spot rates`,
        type: 'success',
        duration: 3000
      });
    }
  };

  // Chart Interactive Engine
  const ChartEngine = {
    months: [
      { month: 'January', rev: '$1,400,000', sales: '10,200', growth: '+5.4%' },
      { month: 'February', rev: '$2,100,000', sales: '14,800', growth: '+8.1%' },
      { month: 'March', rev: '$1,850,000', sales: '13,400', growth: '-4.2%' },
      { month: 'April', rev: '$3,100,000', sales: '21,500', growth: '+15.2%' },
      { month: 'May', rev: '$2,600,000', sales: '18,200', growth: '+6.3%' },
      { month: 'June', rev: '$3,800,000', sales: '26,400', growth: '+18.4%' },
      { month: 'July', rev: '$4,287,600', sales: '28,941', growth: '+12.7%' }
    ],

    metrics: {
      revenue: {
        heights: [70, 100, 85, 130, 110, 150, 170],
        yCoords: [130, 100, 115, 70, 90, 50, 30],
        fill: '#2563EB',
        yLabels: ['$5M', '$4M', '$3M', '$2M', '$1M', '$0'],
        sub: 'Revenue & Sales Trend — Q2 2025'
      },
      profit: {
        heights: [35, 60, 48, 82, 70, 98, 115],
        yCoords: [165, 140, 152, 118, 130, 102, 85],
        fill: '#8B5CF6',
        yLabels: ['$3M', '$2.4M', '$1.8M', '$1.2M', '$600K', '$0'],
        sub: 'Net Profit Margin Trend — Q2 2025'
      },
      orders: {
        heights: [50, 75, 65, 110, 95, 135, 155],
        yCoords: [150, 125, 135, 90, 105, 65, 45],
        fill: '#14B8A6',
        yLabels: ['35K', '28K', '21K', '14K', '7K', '0'],
        sub: 'Order Volume & Fulfillment Trend — Q2 2025'
      }
    },

    init() {
      const chartArea = document.querySelector('.chart-area');
      if (!chartArea) return;

      this.initTabs();

      // Create tooltip container if not exists
      let tooltip = document.querySelector('.chart-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        chartArea.appendChild(tooltip);
      }

      const rects = chartArea.querySelectorAll('.chart-svg rect');
      rects.forEach((rect, idx) => {
        const info = this.months[idx] || { month: `Period ${idx + 1}`, rev: 'N/A', sales: 'N/A', growth: '0%' };

        rect.addEventListener('mouseenter', (e) => {
          tooltip.innerHTML = `
            <div class="chart-tooltip-date">${info.month} 2025</div>
            <div class="chart-tooltip-row">Revenue: ${info.rev}</div>
            <div style="color:var(--green);font-size:11px;margin-top:2px;">Sales: ${info.sales} (${info.growth})</div>
          `;
          tooltip.style.display = 'block';
        });

        rect.addEventListener('mousemove', (e) => {
          const rectBounds = chartArea.getBoundingClientRect();
          const x = e.clientX - rectBounds.left;
          const y = e.clientY - rectBounds.top;
          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;
        });

        rect.addEventListener('mouseleave', () => {
          tooltip.style.display = 'none';
        });

        rect.addEventListener('click', () => {
          ToastEngine.show({
            title: `${info.month} 2025 Details`,
            message: `Recorded ${info.rev} revenue across ${info.sales} completed transactions.`,
            type: 'info',
            duration: 3500
          });
        });
      });

      const circles = chartArea.querySelectorAll('.chart-svg circle');
      circles.forEach((circle, idx) => {
        const info = this.months[idx] || { month: `Period ${idx + 1}`, sales: 'N/A' };
        circle.addEventListener('mouseenter', () => {
          tooltip.innerHTML = `
            <div class="chart-tooltip-date">${info.month} Trend</div>
            <div style="color:var(--green);font-weight:700;">Sales: ${info.sales}</div>
          `;
          tooltip.style.display = 'block';
        });
        circle.addEventListener('mousemove', (e) => {
          const rectBounds = chartArea.getBoundingClientRect();
          tooltip.style.left = `${e.clientX - rectBounds.left}px`;
          tooltip.style.top = `${e.clientY - rectBounds.top}px`;
        });
        circle.addEventListener('mouseleave', () => {
          tooltip.style.display = 'none';
        });
      });
    },

    initTabs() {
      const tabs = document.querySelectorAll('.chart-tab');
      const chartCard = document.querySelector('.chart-card');
      if (!tabs.length || !chartCard) return;

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const metricKey = tab.getAttribute('data-metric');
          const metricConfig = this.metrics[metricKey];
          if (!metricConfig) return;

          // Update chart subtitle
          const sub = chartCard.querySelector('.card-sub');
          if (sub && metricConfig.sub) sub.textContent = metricConfig.sub;

          // Update bars
          const rects = chartCard.querySelectorAll('.chart-svg rect');
          rects.forEach((rect, idx) => {
            rect.setAttribute('y', metricConfig.yCoords[idx]);
            rect.setAttribute('height', metricConfig.heights[idx]);
            rect.setAttribute('fill', metricConfig.fill);
          });

          // Update Y-axis labels
          const yAxis = chartCard.querySelector('.chart-y-axis');
          if (yAxis && metricConfig.yLabels) {
            yAxis.innerHTML = metricConfig.yLabels.map(l => `<span>${l}</span>`).join('');
          }

          ToastEngine.show({
            title: 'Chart View Updated',
            message: `Now visualizing ${tab.textContent.trim()} data`,
            type: 'info',
            duration: 2500
          });
        });
      });
    }
  };

  // Table Engine: Filtering, Search, and Category Management
  const TableEngine = {
    searchQuery: '',
    activeCategory: 'all',
    currentPage: 1,
    pageSize: 5,

    init() {
      const searchInput = document.getElementById('tableSearchInput');
      const catPills = document.querySelectorAll('.cat-pill');

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.currentPage = 1;
          this.filterRows();
        });
      }

      if (catPills.length) {
        catPills.forEach((pill) => {
          pill.addEventListener('click', () => {
            catPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            this.activeCategory = pill.getAttribute('data-category').toLowerCase();
            this.currentPage = 1;
            this.filterRows();
          });
        });
      }

      this.initSorting();
      this.initPagination();
      this.initExport();
      this.filterRows();
    },

    initSorting() {
      const headers = document.querySelectorAll('.data-table thead th.sortable');
      const tbody = document.querySelector('.data-table tbody');
      if (!headers.length || !tbody) return;

      let currentSort = { col: null, asc: true };

      headers.forEach((th, colIdx) => {
        th.addEventListener('click', () => {
          const isSameCol = currentSort.col === colIdx;
          const asc = isSameCol ? !currentSort.asc : true;
          currentSort = { col: colIdx, asc };

          headers.forEach(h => h.classList.remove('asc', 'desc'));
          th.classList.add(asc ? 'asc' : 'desc');

          const rows = Array.from(tbody.querySelectorAll('tr:not(.empty-state-row)'));
          rows.sort((a, b) => {
            const aCell = a.children[colIdx]?.textContent.trim() || '';
            const bCell = b.children[colIdx]?.textContent.trim() || '';

            // Clean numeric comparison if possible
            const aNum = parseFloat(aCell.replace(/[^0-9.-]+/g, ''));
            const bNum = parseFloat(bCell.replace(/[^0-9.-]+/g, ''));

            if (!isNaN(aNum) && !isNaN(bNum)) {
              return asc ? aNum - bNum : bNum - aNum;
            }
            return asc ? aCell.localeCompare(bCell) : bCell.localeCompare(aCell);
          });

          rows.forEach(r => tbody.appendChild(r));

          ToastEngine.show({
            title: 'Table Sorted',
            message: `Sorted by ${th.getAttribute('data-sort')} (${asc ? 'Ascending' : 'Descending'})`,
            type: 'info',
            duration: 2000
          });
        });
      });
    },

    filterRows() {
      const table = document.querySelector('.data-table');
      if (!table) return;

      const rows = Array.from(table.querySelectorAll('tbody tr:not(.empty-state-row)'));
      const matchingRows = [];

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const catBadge = row.querySelector('.cat-badge');
        const catText = catBadge ? catBadge.textContent.toLowerCase() : '';

        const matchesSearch = !this.searchQuery || text.includes(this.searchQuery);
        const matchesCat = this.activeCategory === 'all' || 
          catText.includes(this.activeCategory) ||
          (this.activeCategory === 'ai' && catText.includes('ai'));

        if (matchesSearch && matchesCat) {
          matchingRows.push(row);
        } else {
          row.style.display = 'none';
        }
      });

      // Pagination calculation
      const total = matchingRows.length;
      const totalPages = Math.ceil(total / this.pageSize) || 1;
      if (this.currentPage > totalPages) this.currentPage = totalPages;
      if (this.currentPage < 1) this.currentPage = 1;

      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, total);

      matchingRows.forEach((row, idx) => {
        if (idx >= startIndex && idx < endIndex) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });

      // Update Pagination UI
      const pagStart = document.getElementById('pagStart');
      const pagEnd = document.getElementById('pagEnd');
      const pagTotal = document.getElementById('pagTotal');
      const pagPrev = document.getElementById('pagPrev');
      const pagNext = document.getElementById('pagNext');
      const pagNumbers = document.getElementById('pagNumbers');

      if (pagStart) pagStart.textContent = total === 0 ? '0' : startIndex + 1;
      if (pagEnd) pagEnd.textContent = endIndex;
      if (pagTotal) pagTotal.textContent = total;
      if (pagPrev) pagPrev.disabled = this.currentPage <= 1;
      if (pagNext) pagNext.disabled = this.currentPage >= totalPages;

      if (pagNumbers) {
        pagNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `pag-num ${i === this.currentPage ? 'active' : ''}`;
          btn.textContent = i;
          btn.addEventListener('click', () => {
            this.currentPage = i;
            this.filterRows();
          });
          pagNumbers.appendChild(btn);
        }
      }

      // Handle Empty State
      let emptyRow = table.querySelector('.empty-state-row');
      if (total === 0) {
        if (!emptyRow) {
          emptyRow = document.createElement('tr');
          emptyRow.className = 'empty-state-row';
          emptyRow.innerHTML = `
            <td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted);font-size:13px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="margin:0 auto 8px;display:block;opacity:0.6;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              No products found matching your search or category filter.
            </td>
          `;
          table.querySelector('tbody').appendChild(emptyRow);
        }
        emptyRow.style.display = '';
      } else if (emptyRow) {
        emptyRow.style.display = 'none';
      }
    },

    initPagination() {
      const pagPrev = document.getElementById('pagPrev');
      const pagNext = document.getElementById('pagNext');

      if (pagPrev) {
        pagPrev.addEventListener('click', () => {
          if (this.currentPage > 1) {
            this.currentPage--;
            this.filterRows();
          }
        });
      }

      if (pagNext) {
        pagNext.addEventListener('click', () => {
          this.currentPage++;
          this.filterRows();
        });
      }
    },

    initExport() {
      const csvBtn = document.getElementById('btnExportCSV');
      if (csvBtn) {
        csvBtn.addEventListener('click', () => this.exportCSV());
      }
      const jsonBtn = document.getElementById('btnExportJSON');
      if (jsonBtn) {
        jsonBtn.addEventListener('click', () => this.exportJSON());
      }
    },

    exportJSON() {
      const table = document.querySelector('.data-table');
      if (!table) return;

      const rows = Array.from(table.querySelectorAll('tbody tr:not(.empty-state-row)'));
      const data = rows.map((row) => ({
        productName: row.querySelector('.product-cell span')?.textContent.trim() || '',
        category: row.querySelector('.cat-badge')?.textContent.trim() || '',
        unitsSold: parseInt(row.children[2]?.textContent.trim().replace(/,/g, ''), 10) || 0,
        revenue: parseFloat(row.children[3]?.textContent.trim().replace(/[$,]/g, '')) || 0,
        margin: row.querySelector('.margin-bar-wrap span')?.textContent.trim() || '',
        growth: row.children[5]?.textContent.trim() || '',
        status: row.querySelector('.status-badge')?.textContent.trim() || ''
      }));

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `insightflow-products-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      ToastEngine.show({
        title: 'JSON Export Generated',
        message: `Successfully downloaded ${data.length} product records as formatted JSON.`,
        type: 'success',
        duration: 3500
      });
    },

    exportCSV() {
      const table = document.querySelector('.data-table');
      if (!table) return;

      const rows = Array.from(table.querySelectorAll('tbody tr:not(.empty-state-row)'));
      const headers = ['Product Name', 'Category', 'Units Sold', 'Revenue', 'Margin', 'Growth', 'Status'];

      const csvRows = [headers.join(',')];

      rows.forEach((row) => {
        const name = `"${row.querySelector('.product-cell span')?.textContent.trim() || ''}"`;
        const cat = `"${row.querySelector('.cat-badge')?.textContent.trim() || ''}"`;
        const units = `"${row.children[2]?.textContent.trim().replace(/,/g, '') || ''}"`;
        const rev = `"${row.children[3]?.textContent.trim().replace(/[$,]/g, '') || ''}"`;
        const margin = `"${row.querySelector('.margin-bar-wrap span')?.textContent.trim() || ''}"`;
        const growth = `"${row.children[5]?.textContent.trim() || ''}"`;
        const status = `"${row.querySelector('.status-badge')?.textContent.trim() || ''}"`;

        csvRows.push([name, cat, units, rev, margin, growth, status].join(','));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `insightflow-products-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      ToastEngine.show({
        title: 'CSV Export Generated',
        message: `Successfully downloaded ${rows.length} product records as CSV.`,
        type: 'success',
        duration: 3500
      });
    }
    }
  };

  // Notification Center Engine
  const NotificationEngine = {
    unreadCount: 3,

    init() {
      const wrap = document.querySelector('.notif-wrap');
      const btn = document.getElementById('notifBtn');
      const markReadBtn = document.getElementById('notifMarkRead');
      const clearBtn = document.getElementById('notifClearBtn');
      const notifList = document.getElementById('notifList');
      const notifDot = document.getElementById('notifDot');
      const notifCount = document.getElementById('notifCount');

      if (!btn || !wrap) return;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        wrap.classList.toggle('active');
        btn.setAttribute('aria-expanded', wrap.classList.contains('active'));
      });

      document.addEventListener('click', (e) => {
        if (!wrap.contains(e.target)) {
          wrap.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      if (markReadBtn) {
        markReadBtn.addEventListener('click', () => {
          this.unreadCount = 0;
          if (notifDot) notifDot.style.display = 'none';
          if (notifCount) notifCount.textContent = '0 New';
          const unreadItems = wrap.querySelectorAll('.notif-item.unread');
          unreadItems.forEach(item => item.classList.remove('unread'));
          ToastEngine.show({
            title: 'Notifications Cleared',
            message: 'All notifications marked as read',
            type: 'info',
            duration: 2500
          });
        });
      }

      if (clearBtn && notifList) {
        clearBtn.addEventListener('click', () => {
          this.unreadCount = 0;
          if (notifDot) notifDot.style.display = 'none';
          if (notifCount) notifCount.textContent = '0 New';
          notifList.innerHTML = `
            <div style="padding:32px 16px;text-align:center;color:var(--text-muted);font-size:12.5px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="margin:0 auto 8px;display:block;opacity:0.6;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              You're all caught up! No notifications.
            </div>
          `;
          wrap.classList.remove('active');
          ToastEngine.show({
            title: 'Notification Center',
            message: 'Notification inbox cleared',
            type: 'info',
            duration: 2000
          });
        });
      }
    }
  };

  // Live Activity Stream Simulation Engine
  const StreamEngine = {
    events: [
      { icon: '🎉', text: 'New transaction: <strong>InsightPro Annual License</strong> purchased by <strong>Apex Digital ($4,800)</strong>' },
      { icon: '🚀', text: 'Enterprise subscription upgraded: <strong>Quantum Cloud Labs</strong> upgraded to <strong>Custom Cluster ($12,500/mo)</strong>' },
      { icon: '💳', text: 'Instant checkout: <strong>DataStream API</strong> purchased by <strong>FinTech Nordic ($890)</strong>' },
      { icon: '🌍', text: 'Regional surge: <strong>APAC Server Region</strong> reached record traffic of <strong>4.2M req/sec</strong>' },
      { icon: '✨', text: 'AI Insight generated: Automated retention model predicted <strong>+14% Q3 renewals</strong>' },
      { icon: '🛍️', text: 'Cart recovery converted: <strong>DevSync Connect Enterprise</strong> completed <strong>($3,200)</strong>' }
    ],
    currentIndex: 0,
    timer: null,

    init() {
      const toggleBtn = document.getElementById('liveToggleBtn');
      const ticker = document.getElementById('liveTickerItem');
      if (!ticker) return;

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          AppState.realtimeActive = !AppState.realtimeActive;
          toggleBtn.textContent = AppState.realtimeActive ? 'Pause Stream' : 'Resume Stream';
          toggleBtn.style.color = AppState.realtimeActive ? 'var(--text-muted)' : 'var(--amber)';

          ToastEngine.show({
            title: AppState.realtimeActive ? 'Live Stream Resumed' : 'Live Stream Paused',
            message: AppState.realtimeActive ? 'Receiving real-time transaction events' : 'Real-time feed paused',
            type: 'info',
            duration: 2000
          });

          if (AppState.realtimeActive) {
            this.start();
          } else {
            this.stop();
          }
        });
      }

      this.start();
    },

    start() {
      this.stop();
      this.timer = setInterval(() => {
        if (!AppState.realtimeActive) return;
        this.nextEvent();
      }, 7500);
    },

    stop() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    nextEvent() {
      this.currentIndex = (this.currentIndex + 1) % this.events.length;
      const ev = this.events[this.currentIndex];
      const ticker = document.getElementById('liveTickerItem');
      if (!ticker) return;

      ticker.style.animation = 'none';
      void ticker.offsetWidth; // trigger reflow
      ticker.style.animation = 'tickerSlideIn 0.35s var(--ease-out)';

      ticker.innerHTML = `
        <span class="ticker-time">Just now</span>
        <span class="ticker-text">${ev.icon} ${ev.text}</span>
      `;
    }
  };

  // Initialization
  function initApp() {
    ThemeEngine.init();
    ToastEngine.init();
    DateRangeEngine.init();
    CurrencyEngine.init();
    ChartEngine.init();
    TableEngine.init();
    NotificationEngine.init();
    StreamEngine.init();
    CounterEngine.animateAllKPIs();
    console.log('InsightFlow Analytics Dashboard initialized with theme:', AppState.theme);
  }

  // DOM Content Loaded Handler
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // Export to window for modular extension
  window.InsightFlow = {
    state: AppState
  };
})();
