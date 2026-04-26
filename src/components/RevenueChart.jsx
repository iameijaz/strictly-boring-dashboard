import Plot from 'react-plotly.js';
import { formatCurrency } from '../utils/aggregation';

export default function RevenueChart({ influencers, onSelect }) {
  const colors = influencers.map(inf => {
    const rr = parseFloat(inf.returnRate);
    if (rr < 10) return '#10b981';
    if (rr < 20) return '#f59e0b';
    return '#ef4444';
  });

  const data = [{
    type: 'bar',
    x: influencers.map(i => i.displayName),
    y: influencers.map(i => i.totalRevenue),
    marker: { color: colors },
    hovertemplate: '<b>%{x}</b><br>Revenue: %{customdata}<br>Return rate: %{text}%<extra></extra>',
    customdata: influencers.map(i => formatCurrency(i.totalRevenue)),
    text: influencers.map(i => i.returnRate),
  }];

  const layout = {
    title: { text: 'Revenue by Influencer', font: { size: 16, color: '#111827' } },
    xaxis: { tickangle: -20, automargin: true },
    yaxis: { title: 'Revenue (€)', tickformat: '€,.0f' },
    margin: { t: 50, b: 80, l: 70, r: 20 },
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff',
    showlegend: false,
    annotations: [{
      x: 1, y: 1.08, xref: 'paper', yref: 'paper', xanchor: 'right', yanchor: 'top',
      text: '<span style="color:#10b981">■</span> <10% returns &nbsp; <span style="color:#f59e0b">■</span> 10–20% &nbsp; <span style="color:#ef4444">■</span> >20%',
      showarrow: false, font: { size: 11, color: '#6b7280' }, align: 'right',
    }],
  };

  const handleClick = (data) => {
    const label = data.points[0].x;
    const inf = influencers.find(i => i.displayName === label);
    if (inf) onSelect(inf);
  };

  return (
    <Plot
      data={data}
      layout={layout}
      config={{ responsive: true, displayModeBar: false }}
      onClick={handleClick}
      style={{ width: '100%', cursor: 'pointer' }}
      useResizeHandler
    />
  );
}
