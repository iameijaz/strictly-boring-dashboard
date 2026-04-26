import { useState } from 'react';
import { formatCurrency } from '../utils/aggregation';

const COLS = [
  { key: 'displayName', label: 'Influencer' },
  { key: 'discountCode', label: 'Code' },
  { key: 'totalOrders', label: 'Orders' },
  { key: 'totalRevenue', label: 'Revenue' },
  { key: 'returnCount', label: 'Returns' },
  { key: 'returnRate', label: 'Return Rate' },
  { key: 'netRevenue', label: 'Net Revenue' },
  { key: 'roi', label: 'ROI Est.' },
];

function badge(text, bg, color) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
      background: bg, color, fontWeight: 700, fontSize: '0.8rem',
    }}>{text}</span>
  );
}

function ReturnRateBadge({ rate }) {
  const r = parseFloat(rate);
  if (r < 10) return badge(`${rate}%`, '#dcfce7', '#14532d');
  if (r < 20) return badge(`${rate}%`, '#fef3c7', '#78350f');
  return badge(`${rate}%`, '#fee2e2', '#991b1b');
}

function ROIBadge({ roi }) {
  if (roi === null) return <span style={{ color: '#9ca3af' }}>—</span>;
  const r = parseInt(roi);
  if (r > 100) return badge(`${roi}%`, '#dcfce7', '#14532d');
  if (r > 0) return badge(`${roi}%`, '#fef3c7', '#78350f');
  return badge(`${roi}%`, '#fee2e2', '#991b1b');
}

export default function StatsTable({ influencers, onSelect }) {
  const [sortKey, setSortKey] = useState('totalRevenue');
  const [asc, setAsc] = useState(false);

  const handleSort = (key) => {
    if (sortKey === key) setAsc(!asc);
    else { setSortKey(key); setAsc(false); }
  };

  const sorted = [...influencers].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (av === null) av = -Infinity;
    if (bv === null) bv = -Infinity;
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    return asc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });

  return (
    <div>
      <h2 style={{ margin: '0 0 16px', fontSize: '1.2rem', color: '#111827' }}>
        Influencer Performance
        <span style={{ marginLeft: '8px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 400 }}>
          — click a row to drill down
        </span>
      </h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              {COLS.map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)}
                  style={{
                    padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
                    fontWeight: 600, color: '#374151', userSelect: 'none',
                    whiteSpace: 'nowrap',
                    borderBottom: sortKey === col.key ? '2px solid #3b82f6' : '2px solid transparent',
                  }}>
                  {col.label} {sortKey === col.key ? (asc ? '↑' : '↓') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((inf, idx) => (
              <tr key={inf.name} onClick={() => onSelect(inf)}
                style={{
                  borderBottom: '1px solid #e5e7eb', cursor: 'pointer',
                  background: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#fafafa'}
              >
                <td style={{ padding: '10px 12px', fontWeight: 600, color: '#2563eb' }}>
                  {inf.displayName}
                </td>
                <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#6b7280' }}>
                  {inf.discountCode}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{inf.totalOrders}</td>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{formatCurrency(inf.totalRevenue)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{inf.returnCount}</td>
                <td style={{ padding: '10px 12px' }}><ReturnRateBadge rate={inf.returnRate} /></td>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{formatCurrency(inf.netRevenue)}</td>
                <td style={{ padding: '10px 12px' }}><ROIBadge roi={inf.roi} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
