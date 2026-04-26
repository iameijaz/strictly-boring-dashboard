import { formatCurrency } from '../utils/aggregation';

export default function DetailModal({ influencer, orders, onClose }) {
  if (!influencer) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div onClick={handleOverlayClick} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px',
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px', maxWidth: '560px',
        width: '100%', maxHeight: '85vh', overflowY: 'auto',
        padding: '28px', position: 'relative',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: '#f3f4f6', border: 'none', borderRadius: '50%',
          width: '32px', height: '32px', cursor: 'pointer',
          fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#374151',
        }}>✕</button>

        <h2 style={{ margin: '0 0 6px', fontSize: '1.4rem', color: '#111827', paddingRight: '40px' }}>
          {influencer.displayName}
        </h2>
        <p style={{ margin: '0 0 20px', fontSize: '0.85rem', color: '#6b7280', fontFamily: 'monospace' }}>
          {influencer.discountCode}
        </p>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total Revenue', value: formatCurrency(influencer.totalRevenue) },
            { label: 'Net Revenue', value: formatCurrency(influencer.netRevenue) },
            { label: 'Return Rate', value: `${influencer.returnRate}%` },
            { label: 'Orders', value: influencer.totalOrders },
            { label: 'Returns', value: influencer.returnCount },
            { label: 'ROI Est.', value: influencer.roi ? `${influencer.roi}%` : '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: '#f9fafb', borderRadius: '8px', padding: '12px',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px', fontWeight: 600 }}>
                {label}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#374151' }}>
          Order Breakdown ({orders.length} orders)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {orders.map(o => (
            <div key={o.id} style={{
              border: `1px solid ${o.returned ? '#fecaca' : '#d1fae5'}`,
              borderRadius: '8px', padding: '12px',
              background: o.returned ? '#fff5f5' : '#f0fdf4',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>
                  {o.id}
                </span>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px',
                  borderRadius: '4px',
                  background: o.returned ? '#fee2e2' : '#dcfce7',
                  color: o.returned ? '#991b1b' : '#14532d',
                }}>
                  {o.returned ? 'RETURNED' : 'COMPLETED'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.875rem', color: '#4b5563' }}>
                <span>Order: <strong style={{ color: '#111827' }}>{formatCurrency(o.order_value)}</strong></span>
                {o.returned && (
                  <span>Returned: <strong style={{ color: '#dc2626' }}>{formatCurrency(o.returned_amount)}</strong></span>
                )}
                <span>Date: <strong style={{ color: '#111827' }}>{o.date}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
