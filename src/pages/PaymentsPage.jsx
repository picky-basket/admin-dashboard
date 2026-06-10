import { useMemo, useState } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import { useAppStore } from '../store/appStore.jsx';
import { useExtractedTheme } from '../components/extracted/theme.js';
import Card from '../components/extracted/ui/Card.jsx';
import EmptyState from '../components/extracted/ui/EmptyState.jsx';
import SearchBar from '../components/extracted/ui/SearchBar.jsx';
import SelectFilter from '../components/extracted/ui/SelectFilter.jsx';
import Tag from '../components/extracted/ui/Tag.jsx';

function useT() {
  return useExtractedTheme();
}

function PaymentsExtracted({ orders, search, setSearch, methodFlt, setMethod }) {
  const T = useT();
  const { isMobile } = useBreakpoint();
  const paid = orders.filter((o) => o.paid && o.status !== 'Cancelled');
  const revenue = paid.reduce((s, o) => s + o.subtotal + o.fee, 0);

  const byMethod = ['MTN MoMo', 'Card', 'Vodafone'].map((m) => {
    const items = paid.filter((o) => o.method === m);
    return {
      m,
      n: items.length,
      total: items.reduce((s, o) => s + o.subtotal + o.fee, 0),
      pct: paid.length ? Math.round((items.length / paid.length) * 100) : 0
    };
  });

  const shown = useMemo(() => {
    let list = orders;
    if (methodFlt !== 'All') list = list.filter((o) => o.method === methodFlt);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q));
    }
    return list;
  }, [orders, search, methodFlt]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Payments</h2>
        <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>Revenue & transaction history</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'Total Collected', value: `GHS ${revenue.toLocaleString()}`, icon: '💰', color: T.teal },
          { label: 'Paid Orders', value: paid.length, icon: '✅', color: T.green },
          { label: 'Avg. Order', value: `GHS ${paid.length ? Math.round(revenue / paid.length) : 0}`, icon: '📊', color: T.orange }
        ].map((s) => (
          <Card key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: T.text, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 14 }}>By Payment Method</div>
        {byMethod.map(({ m, n, total, pct }) => (
          <div key={m} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 5 }}>
              <div style={{ fontSize: 20, flexShrink: 0 }}>{m === 'MTN MoMo' ? '📱' : m === 'Card' ? '💳' : '📲'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, color: T.text }}>{m} <span style={{ color: T.muted, fontWeight: 400, fontSize: 11 }}>({n} orders)</span></span>
                  <span style={{ fontWeight: 700, color: T.teal }}>GHS {total.toLocaleString()}</span>
                </div>
                <div style={{ height: 5, borderRadius: 4, background: T.bgAlt, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: T.teal, borderRadius: 4 }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Card>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.border}`, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 13, flex: 1, color: T.text }}>All Transactions</span>
          <SearchBar value={search} onChange={setSearch} placeholder="Search..." />
          <SelectFilter value={methodFlt} onChange={setMethod}>
            <option value="All">All Methods</option>
            <option value="MTN MoMo">MTN MoMo</option>
            <option value="Card">Card</option>
            <option value="Vodafone">Vodafone</option>
          </SelectFilter>
        </div>
        {shown.length === 0 ? (
          <EmptyState icon="💸" msg="No transactions match" />
        ) : isMobile ? (
          <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {shown.map((o) => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
                <div>
                  <div style={{ fontWeight: 700, color: T.teal, fontSize: 13 }}>{o.id}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{o.customer} · {o.method}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: o.paid ? T.green : T.red }}>{o.paid ? '+' : '-'}GHS {o.subtotal + o.fee}</div>
                  <Tag s={o.paid && o.status !== 'Cancelled' ? 'Settled' : 'Refunded'} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: T.bgAlt }}>
                  {['Order', 'Customer', 'Amount', 'Method', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((o, i) => (
                  <tr key={o.id} style={{ borderTop: `1px solid ${T.border}`, background: i % 2 ? T.bgAlt : T.card }}>
                    <td style={{ padding: '9px 14px', fontWeight: 700, color: T.teal }}>{o.id}</td>
                    <td style={{ padding: '9px 14px', color: T.text }}>{o.customer}</td>
                    <td style={{ padding: '9px 14px', fontWeight: 700, color: o.paid ? T.green : T.red }}>{o.paid ? '+' : '-'}GHS {o.subtotal + o.fee}</td>
                    <td style={{ padding: '9px 14px', color: T.muted }}>{o.method}</td>
                    <td style={{ padding: '9px 14px' }}><Tag s={o.paid && o.status !== 'Cancelled' ? 'Settled' : 'Refunded'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function PaymentsPage() {
  const { orders, paymentsView, setPaymentsView } = useAppStore();
  const search = paymentsView?.search ?? '';
  const methodFlt = paymentsView?.methodFilter ?? 'All';
  const setSearch = (value) => setPaymentsView((prev) => ({ ...prev, search: value }));
  const setMethod = (value) => setPaymentsView((prev) => ({ ...prev, methodFilter: value }));

  return (
    <PaymentsExtracted
      orders={orders}
      search={search}
      setSearch={setSearch}
      methodFlt={methodFlt}
      setMethod={setMethod}
    />
  );
}
