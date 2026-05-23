import { useNavigate } from '@tanstack/react-router';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import { useAppStore } from '../store/appStore.jsx';
import { statusStyle, useExtractedTheme } from '../components/extracted/theme.js';
import Button from '../components/extracted/ui/Button.jsx';
import Card from '../components/extracted/ui/Card.jsx';
import Tag from '../components/extracted/ui/Tag.jsx';

const Btn = Button;

function useT() {
  return useExtractedTheme();
}

function DashboardExtracted({ orders, products, customers, go }) {
  const T = useT();
  const { isMobile, isTablet } = useBreakpoint();
  const revenue = orders.filter((o) => o.paid && o.status !== 'Cancelled').reduce((s, o) => s + o.subtotal + o.fee, 0);
  const pending = orders.filter((o) => o.status === 'Pending').length;
  const lowStock = products.filter((p) => p.stock <= 5).length;
  const delivered = orders.filter((o) => o.status === 'Delivered').length;
  const statOrder = ['Pending', 'Packing', 'Delivering', 'Delivered', 'Cancelled'];
  const cols = isMobile ? '1fr 1fr' : isTablet ? '1fr 1fr' : 'repeat(4,1fr)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: T.text, margin: 0, letterSpacing: -0.4 }}>Good day, Admin 👋</h2>
          <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>Here is what is happening in your store today.</p>
        </div>
        <Btn onClick={() => go('orders')} sm v="outline">View All Orders</Btn>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12 }}>
        {[
          { label: 'Revenue', value: `GHS ${revenue.toLocaleString()}`, icon: '💰', color: T.teal, sub: 'All paid orders' },
          { label: 'Pending', value: pending, icon: '⏳', color: T.orange, sub: 'Awaiting process' },
          { label: 'Delivered', value: delivered, icon: '✅', color: T.green, sub: 'Completed' },
          { label: 'Low Stock', value: lowStock, icon: '⚠️', color: T.red, sub: 'Need restock' }
        ].map((s) => (
          <Card key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 12px' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: T.text, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2, fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: s.color, marginTop: 1, fontWeight: 600 }}>{s.sub}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 14 }}>Order Pipeline</div>
          {statOrder.map((s) => {
            const n = orders.filter((o) => o.status === s).length;
            const { fg } = statusStyle(s, T);
            const pct = orders.length ? Math.round((n / orders.length) * 100) : 0;
            return (
              <div key={s} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: fg, fontWeight: 600 }}>{s}</span>
                  <span style={{ color: T.muted }}>{n} · {pct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: T.bgAlt, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: fg, borderRadius: 4, transition: 'width .5s ease' }} />
                </div>
              </div>
            );
          })}
        </Card>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 14 }}>Recent Orders</div>
          {orders.slice(0, 5).map((o, i) => (
            <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i > 0 ? `1px solid ${T.border}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.customer}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{o.id} · {o.time}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: T.text, whiteSpace: 'nowrap' }}>GHS {o.subtotal + o.fee}</div>
              <Tag s={o.status} />
            </div>
          ))}
        </Card>
      </div>
      {lowStock > 0 ? (
        <div style={{ background: T.redL, border: `1px solid ${T.red}44`, borderLeft: `4px solid ${T.red}`, borderRadius: 14, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: T.red, marginBottom: 10 }}>⚠️ Stock Alerts - {lowStock} item{lowStock > 1 ? 's' : ''} need attention</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 8 }}>
            {products.filter((p) => p.stock <= 5).map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: T.card, borderRadius: 9, fontSize: 13, border: `1px solid ${T.red}33` }}>
                <span style={{ fontWeight: 600, color: T.text }}>{p.name}</span>
                <span style={{ fontWeight: 700, color: p.stock === 0 ? T.red : T.yellow }}>{p.stock === 0 ? 'Out' : `Low(${p.stock})`}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { orders, products, customers } = useAppStore();

  const go = (page) => {
    const pathMap = {
      dash: '/',
      orders: '/orders',
      products: '/products',
      categories: '/categories',
      customers: '/customers',
      payments: '/payments',
      settings: '/settings'
    };

    navigate({ to: pathMap[page] ?? '/' });
  };

  return <DashboardExtracted orders={orders} products={products} customers={customers} go={go} />;
}
