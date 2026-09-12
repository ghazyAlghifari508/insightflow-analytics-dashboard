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

  // Initialization
  function initApp() {
    ThemeEngine.init();
    ToastEngine.init();
    DateRangeEngine.init();
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
