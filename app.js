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
    }
  };

  // Initialization
  function initApp() {
    ThemeEngine.init();
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
