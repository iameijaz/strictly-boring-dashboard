export function formatName(slug) {
  return slug.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

export function formatCurrency(v) {
  return '€' + parseFloat(v).toFixed(2);
}

export function aggregateByInfluencer(orders) {
  const map = {};
  for (const o of orders) {
    if (!map[o.influencer]) {
      map[o.influencer] = {
        name: o.influencer,
        displayName: formatName(o.influencer),
        discountCode: o.discount_code,
        orders: [],
        totalRevenue: 0,
        totalReturned: 0,
        returnCount: 0,
        totalOrders: 0,
      };
    }
    const inf = map[o.influencer];
    inf.orders.push(o);
    inf.totalOrders += 1;
    inf.totalRevenue += o.order_value;
    if (o.returned) {
      inf.returnCount += 1;
      inf.totalReturned += o.returned_amount;
    }
  }

  return Object.values(map)
    .map(inf => {
      const netRevenue = inf.totalRevenue - inf.totalReturned;
      const returnRate = ((inf.returnCount / inf.totalOrders) * 100).toFixed(1);
      const roi = inf.totalReturned > 0
        ? ((netRevenue / inf.totalReturned) * 100).toFixed(0)
        : null;
      return { ...inf, netRevenue, returnRate: parseFloat(returnRate), roi };
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue);
}
