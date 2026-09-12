# 📊 InsightFlow Analytics — Next-Gen Business Intelligence Dashboard

> An executive SaaS analytics and business intelligence dashboard engineered with **100% Pure Native Web Standards**: HTML5, modern CSS3, and modular Vanilla ES6. Zero bundlers, zero npm dependencies, zero build steps — instant sub-millisecond load times.

![InsightFlow Preview](favicon.svg)

---

## 🚀 Key Highlights & Architecture

InsightFlow is crafted to demonstrate that enterprise-grade UI/UX, micro-interactions, responsive design, and fluid data interactivity can be achieved natively without heavy JavaScript frameworks.

### 🎨 Visual & Theme System
* **Dynamic Dark / Light Theme**: Instant switching with CSS custom properties (`data-theme="dark"`), persisted to `localStorage`, and fully synchronized with system OS preferences (`prefers-color-scheme`).
* **Tactile Micro-Haptic Audio**: Built-in sound synthesizer using the native **Web Audio API** (`AudioContext`, `OscillatorNode`, `GainNode`). Delivers subtle, non-intrusive feedback (clicks, harmonic chimes, pops) without external audio files. Includes a mute toggle.
* **Modern Design Tokens**: Strictly structured 8pt SaaS grid system, glassmorphism backdrops (`backdrop-filter: blur()`), semantic status badges, and refined typography powered by *Plus Jakarta Sans* and *JetBrains Mono*.

### 📈 Interactive Data & Charts
* **Live Animated Metric Counters**: Number-ticker easing engine dynamically animating KPI numbers from zero to target upon view or refresh.
* **Interactive Date-Range Filtering**: Filter between *Today*, *Last 7 Days*, *Last 30 Days*, *Q2 2025*, *Year to Date*, and *Full Year 2024* with recalculated metric values.
* **Multi-Currency Engine**: Real-time conversion and symbol formatting supporting **USD ($)**, **EUR (€)**, **GBP (£)**, and **IDR (Rp)**.
* **Authoritative SVG Charts**:
  * **Bar Chart with Metric Tabs**: Smoothly switch between *Revenue*, *Net Profit*, and *Orders* with dynamic coordinate heights.
  * **Sales Trend Line Chart**: Interactive SVG inspection points with floating mouse-tracking tooltip.
  * **Traffic Source Donut Chart**: Hover highlights on segments synchronized with legend counts and percentages.

### 📦 Enterprise Data Table
* **Instant Debounced Search**: Fast filtering across product titles and metadata.
* **Category Filters**: Quick pill toggles (*All*, *Software*, *API Platform*, *AI / ML*, *Security*).
* **Multi-Column Sorting**: Bidirectional sorting on Product Name, Units Sold, Revenue, Margin, and Growth.
* **Client-side Pagination**: Dynamic page slicing with configurable controls.
* **One-Click Data Exports**: Export active table datasets directly to **CSV** or formatted **JSON**.

### ⚡ Real-Time Intelligence & AI
* **Live Sales Ticker & Event Stream**: Simulated real-time order stream with intermittent transaction toasts.
* **AI Analytics Assistant Slide-Over Drawer**: Simulated streaming AI insights assistant with quick prompt chips.
* **What-If Scenario Simulator**: Interactive sliders for ad budget, conversion rate, and average deal size with real-time ROI and pipeline forecasting.

### ⌨️ Command Palette & Keyboard Shortcuts
Press <kbd>⌘</kbd><kbd>K</kbd> or <kbd>Ctrl</kbd><kbd>K</kbd> to launch the command palette from anywhere.

| Shortcut | Action |
|---|---|
| <kbd>⌘</kbd><kbd>K</kbd> / <kbd>Ctrl</kbd><kbd>K</kbd> | Open Command Palette |
| <kbd>D</kbd> | Toggle Dark / Light Mode |
| <kbd>/</kbd> | Quick focus Table Search input |
| <kbd>R</kbd> | Re-trigger KPI counter animations |
| <kbd>?</kbd> | Show Keyboard Shortcuts Cheatsheet |
| <kbd>ESC</kbd> | Close any open modal, drawer, or dropdown |

### 📱 Responsive & Accessible (A11y)
* **Mobile Slide-Out Drawer**: Hamburger navigation with backdrop blur dismissal.
* **Accessible Foundation**: Skip-to-content bypass link, semantic ARIA landmarks and live regions, high-contrast `:focus-visible` outlines.
* **High-Fidelity Print & PDF**: Pristine `@media print` layout turning the dashboard into an executive board report in landscape orientation.
* **PWA Ready**: Web App Manifest (`manifest.json`) and vector brand `favicon.svg`.

---

## 🛠️ Quick Start

No installation or build tools required! Simply open `index.html` in any modern web browser:

```bash
# Clone the repository
git clone https://github.com/ghazyAlghifari508/insightflow-analytics-dashboard.git

# Navigate into the project folder
cd insightflow-analytics-dashboard

# Open index.html in your default browser (or use VS Code Live Server)
start index.html   # On Windows
open index.html    # On macOS
xdg-open index.html # On Linux
```

---

## 📂 Project Structure

├── index.html       # Executive Overview Dashboard & Real-Time Stream
├── sales.html       # Sales Analytics & Pipeline Velocity
├── customers.html   # Customer Intelligence & Retention Cohorts
├── products.html    # Product Telemetry & Feature Adoption
├── marketing.html   # Demand Generation & Channel Attribution ROI
├── inventory.html   # Inventory Operations & Warehouse Stock Control
├── reports.html     # Executive Reports & Automated Export Dispatches
├── forecasting.html # Predictive Modeling & Interactive What-If Simulator
├── settings.html    # Platform Settings, API Tokens & Security Policies
├── style.css        # Pure CSS3 stylesheet (variables, components, animations, print)
├── app.js           # Modular ES6 controllers (Theme, Audio, Charts, Table, AI, Palette)
├── manifest.json    # Progressive Web App manifest
├── favicon.svg      # Vector brand logo favicon
└── README.md        # Documentation and feature guide
```

---

## 📄 License
MIT License. Open for personal and commercial usage.
