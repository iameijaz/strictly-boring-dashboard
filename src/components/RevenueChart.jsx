import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { formatCurrency } from '../utils/aggregation';

export default function RevenueChart({ influencers, onSelect }) {
  const divRef = useRef(null);

  useEffect(() => {
    if (!divRef.current || influencers.length === 0) return;

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

    Plotly.newPlot(divRef.current, data, layout, { responsive: true, displayModeBar: false });

    const handleClick = (event) => {
      if (event.points && event.points[0]) {
        const label = event.points[0].x;
        const inf = influencers.find(i => i.displayName === label);
        if (inf) onSelect(inf);
      }
    };

    divRef.current.on('plotly_click', handleClick);

    return () => {
      if (divRef.current) {
        Plotly.purge(divRef.current);
      }
    };
  }, [influencers, onSelect]);

  return <div ref={divRef} style={{ width: '100%', minHeight: '400px' }} />;
}