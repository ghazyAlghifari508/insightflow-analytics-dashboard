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
