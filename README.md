# Influencer ROI Dashboard

**Shopify prototype for the Strictly Boring test case.**

Live demo → https://iameijaz.github.io/strictly-boring-dashboard

---

## What It Does

Tracks influencer performance for an E-Commerce brand with ~8,000 orders/month:

- Revenue per influencer
- Return rate per influencer (color-coded: green <10%, amber 10–20%, red >20%)
- ROI estimate per influencer
- Click any bar or table row → order-level breakdown modal

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React 19 + Vite | Fast build, minimal config |
| Charts | Plotly.js | Interactive, clickable, no extra config |
| Data | Static JSON (80 orders, 10 influencers) | No API credentials needed for prototype |
| Deploy | GitHub Pages via gh-pages | Free, instant, zero ops |

---

## Run Locally

```bash
git clone https://github.com/iameijaz/strictly-boring-dashboard.git
cd strictly-boring-dashboard
npm install
npm run dev
# Open http://localhost:5173
```

## Deploy to GitHub Pages

```bash
npm run deploy
# Builds to dist/ → pushes to gh-pages branch
# Live at: https://iameijaz.github.io/strictly-boring-dashboard
```

---

## Project Structure

```
src/
├── App.jsx                   Main component + layout
├── main.jsx                  React entry point
├── components/
│   ├── RevenueChart.jsx      Plotly bar chart (clickable)
│   ├── StatsTable.jsx        Sortable influencer stats table
│   └── DetailModal.jsx       Order-level drill-down modal
├── data/
│   └── test_orders.json      80 simulated Shopify orders
└── utils/
    └── aggregation.js        Revenue, ROI, return rate calculation
```

---

## Extending to Real Shopify

Swap `test_orders.json` for a script that fetches live data:

```python
# backend/fetch_shopify.py
import shopify, json

session = shopify.Session(store_url, "2024-01", access_token)
shopify.ShopifyResource.activate_session(session)

orders = shopify.Order.find(status="any", limit=250)
# parse discount_codes + metafields for return status
# export to src/data/test_orders.json
```

Run daily via GitHub Actions cron → frontend auto-rebuilds on push.

---

## See Also

- `APPROACH.md` — full technical approach document
- `vite.config.js` — base path config for GitHub Pages

---

**Contact:** ijaz.vbt@gmail.com · github.com/iameijaz
