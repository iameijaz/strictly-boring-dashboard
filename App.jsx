import { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import orders from './data/test_orders.json';
import { aggregateByInfluencer, formatCurrency } from './utils/aggregation';
import RevenueChart from './components/RevenueChart';
import StatsTable from './components/StatsTable';
import DetailModal from './components/DetailModal';

export default function App() {
  const [selected, setSelected] = useState(null);

  const influencers = useMemo(() => aggregateByInfluencer(orders), []);

  const totalRevenue = influencers.reduce((s, i) => s + i.totalRevenue, 0);
  const totalOrders = orders.length;
  const totalReturns = orders.filter(o => o.returned).length;
  const avgReturnRate = ((totalReturns / totalOrders) * 100).toFixed(1);
  const totalNetRevenue = influencers.reduce((s, i) => s + i.netRevenue, 0);

  const metrics = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), accent: '#3b82f6' },
    { label: 'Net Revenue', value: formatCurrency(totalNetRevenue), accent: '#10b981' },
    { label: 'Total Orders', value: totalOrders, accent: '#8b5cf6' },
    { label: 'Returns', value: totalReturns, accent: '#f59e0b' },
    { label: 'Avg Return Rate', value: `${avgReturnRate}%`, accent: '#ef4444' },
  ];

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', padding: '20px 32px', borderBottom: '3px solid #3b82f6' }}>
        <h1 style={{ margin: 0, color: '#f8fafc', fontSize: '1.5rem', fontWeight: 700 }}>
          Influencer ROI Dashboard
        </h1>
        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
          Shopify prototype — 10 influencers · 80 simulated orders · Strictly Boring test case
        </p>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {metrics.map(m => (
            <div key={m.label} style={{
              background: '#fff', borderRadius: '10px', padding: '18px 20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `4px solid ${m.accent}`,
            }}>
              <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                {m.label}
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 700, color: '#111827' }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
          <RevenueChart influencers={influencers} onSelect={setSelected} />
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <StatsTable influencers={influencers} onSelect={setSelected} />
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '28px', color: '#9ca3af', fontSize: '0.8rem' }}>
          Built by Ijaz Ahmed — github.com/iameijaz · ijaz.vbt@gmail.com
        </div>
      </div>

      {selected && (
        <DetailModal
          influencer={selected}
          orders={orders.filter(o => o.influencer === selected.name)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
