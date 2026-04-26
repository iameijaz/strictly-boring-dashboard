# Approach — Influencer ROI Dashboard

## Problem

An E-Commerce brand with ~8,000 orders/month across 30 influencers needs to know:
- How much revenue did each influencer drive?
- What is the return rate per influencer?
- Which partnerships are actually ROI-positive?

---

## Architecture Decision

**Frontend-only.** React + Plotly, static JSON data, deployed on GitHub Pages.

No server. No database. No API keys needed.

This is intentional, not a limitation. For a prototype, the goal is demonstrability
in the shortest path. A live link proves more than a diagram.

```
test_orders.json  →  aggregation.js  →  React components  →  GitHub Pages
(80 simulated       (revenue, ROI,      (chart, table,        (live, free,
 Shopify orders)     return rate)        modal)                zero ops)
```

**Why React + Vite?**
Fastest setup for a component-driven UI. Vite builds in ~8 seconds; no webpack config.

**Why Plotly?**
Interactive bar charts with click handlers and hover tooltips out of the box.
Recharts is lighter but Plotly has better interactivity for this use case.

**Why static JSON?**
Eliminates Shopify API setup, OAuth, credentials. Data structure mirrors what the
real API returns — swapping it in is a one-file change.

**Why GitHub Pages?**
Free, instant, no cold starts, no infrastructure. The goal is a shareable live link.

---

## Implementation Plan

### Day 1: Setup
- `npm create vite@latest . -- --template react`
- Install Plotly, gh-pages
- Init git, push to GitHub
- Configure `vite.config.js` base path for GitHub Pages

### Day 2–3: Data Layer
- Create `test_orders.json`: 80 orders across 10 influencers
- Varied order values (€50–€500), varied return rates (0–30%)
- Discount codes: SARAH15, ALEX10, EMMA20, etc.
- Write `aggregation.js`: group by influencer, calculate revenue / return rate / ROI

### Day 4–5: Components
- `App.jsx` — layout, metrics header, state management
- `RevenueChart.jsx` — Plotly bar chart, color-coded by return rate
- `StatsTable.jsx` — sortable table, click-to-select
- `DetailModal.jsx` — order-level breakdown, overlay pattern

### Day 6: Polish
- Responsive layout (mobile/tablet/desktop)
- Hover effects on table rows
- Chart click handlers (bar click → open modal)
- Legend annotation on chart

### Day 7: Deploy
- `npm run deploy` → pushes dist/ to gh-pages branch
- Verify live link
- Test on mobile

### Day 8: Documentation
- README.md (setup, deploy, structure)
- APPROACH.md (this file)

---

## AI Tools Usage

**Claude Code** — initial component scaffolding (Dashboard layout, modal overlay pattern),
aggregation function structure (groupBy pattern), Plotly configuration (hover template syntax).
Saved ~3h on boilerplate.

**Cursor** — refactoring component prop interfaces, inline styling consistency, table sort
comparator logic, responsive grid breakpoints. Saved ~2h on iteration.

**Copilot** — utility function completions (formatCurrency, formatName), JSX attribute
suggestions. Saved ~1h on nitpicky syntax.

**Manual decisions** (not delegated to AI):
- Frontend-only vs. backend architecture (tradeoffs for demo speed)
- Plotly vs. Recharts (click handler requirements)
- Component hierarchy (why DetailModal is separate from App)
- Color thresholds for return rate badges (<10% green, <20% amber, >20% red)
- Static JSON vs. live API for prototype

---

## Data Model

Each order in `test_orders.json`:

```json
{
  "id": "ORD-001",
  "influencer": "sarah_fitness",
  "discount_code": "SARAH15",
  "order_value": 145.50,
  "returned": false,
  "returned_amount": 0,
  "date": "2024-03-01"
}
```

Mirrors what you get from Shopify's Orders API + metafields for return status.

---

## Aggregation Logic

```js
// For each influencer:
netRevenue = totalRevenue - totalReturned
returnRate = (returnCount / totalOrders) * 100
roi = (netRevenue / totalReturned) * 100  // null if no returns
```

ROI interpretation: 200% = net revenue is 2× the loss from returns.
An influencer with zero returns has no ROI denominator → shown as "—", not infinity.

---

## Extending to Real Shopify

**Step 1:** Python backend fetches live data:

```python
import shopify

session = shopify.Session(store_url, "2024-01", access_token)
shopify.ShopifyResource.activate_session(session)

orders = shopify.Order.find(status="any", limit=250)
```

**Step 2:** Parse discount codes (identify influencer) and order metafields
(identify returns: tags "retourniert", "teilretourniert").

**Step 3:** Export to `src/data/test_orders.json`. Frontend unchanged.

**Step 4:** Schedule via GitHub Actions cron (daily). Push to main.
Frontend auto-rebuilds and redeploys.

**Adding Klaviyo:** Same pattern — backend fetches email performance per
influencer, merges with Shopify data, adds fields to JSON. Frontend
adds a new chart/column.

---

## What This Demonstrates

1. **End-to-end thinking** — problem → data model → aggregation → UI → deployment
2. **Pragmatic choices** — no overengineering; static JSON is correct for a prototype
3. **Shipped, not described** — click through a live dashboard in 10 seconds
4. **Extensible foundation** — real Shopify data is a one-file swap
5. **AI for velocity, not abdication** — tools accelerated boilerplate; architecture is manual
