import { useEffect, useMemo, useState } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import { useAppStore } from '../store/appStore.jsx';
import { useExtractedTheme } from '../components/extracted/theme.js';
import { useOrders, useUpdateOrderStatus } from '../api/hooks/useOrders.ts';
import Button from '../components/extracted/ui/Button.jsx';
import Card from '../components/extracted/ui/Card.jsx';
import EmptyState from '../components/extracted/ui/EmptyState.jsx';
import Modal from '../components/extracted/ui/Modal.jsx';
import SearchBar from '../components/extracted/ui/SearchBar.jsx';
import SelectFilter from '../components/extracted/ui/SelectFilter.jsx';
import Tag from '../components/extracted/ui/Tag.jsx';

const Btn = Button;

function useT() {
  return useExtractedTheme();
}

const STATUS_TO_API = {
  Pending: 'pending',
  Confirmed: 'confirmed',
  Processing: 'processing',
  Shipped: 'shipped',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
  Refunded: 'refunded'
};

const NEXT_STATUS = {
  Confirmed: 'Processing',
  Processing: 'Shipped',
  Shipped: 'Delivered',
  Cancelled: 'Refunded'
};

function OrdersExtracted({ orders, setOrders }) {
  const T = useT();
  const { isMobile } = useBreakpoint();
  const { mutateAsync: mutateOrderStatus, isPending: isUpdatingStatus } = useUpdateOrderStatus();
  const [tab, setTab] = useState('All');
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const tabs = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

  const normalizedOrders = useMemo(
    () =>
      (orders || []).map((order) => ({
        ...order,
        items: Array.isArray(order?.items) ? order.items : []
      })),
    [orders]
  );

  const filtered = useMemo(() => {
    let list = tab === 'All' ? normalizedOrders : normalizedOrders.filter((o) => o.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          (o.orderNumber || '').toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.phone.includes(q)
      );
    }
    if (sortBy === 'highest') list = [...list].sort((a, b) => (b.subtotal + b.fee) - (a.subtotal + a.fee));
    if (sortBy === 'lowest') list = [...list].sort((a, b) => (a.subtotal + a.fee) - (b.subtotal + b.fee));
    return list;
  }, [normalizedOrders, tab, search, sortBy]);

  const applyStatusLocally = (orderId, status) => {
    setOrders((p) => p.map((x) => (x.id === orderId ? { ...x, status } : x)));
    setOpen((prev) => (prev && prev.id === orderId ? { ...prev, status } : prev));
  };

  const updateStatus = async (order, nextStatus, cancellationReason = '') => {
    try {
      setUpdatingOrderId(order.id);
      await mutateOrderStatus({
        orderId: order.id,
        status: STATUS_TO_API[nextStatus],
        cancellationReason
      });
      applyStatusLocally(order.id, nextStatus);
    } catch {
      window.alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const advance = async (order) => {
    const nextStatus = NEXT_STATUS[order.status];
    if (!nextStatus) return;
    await updateStatus(order, nextStatus);
  };

  const cancel = async (order) => {
    await updateStatus(order, 'Cancelled', 'Cancelled by admin');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Orders</h2>
          <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>{normalizedOrders.length} total · {filtered.length} shown</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search orders..." />
          <SelectFilter value={sortBy} onChange={setSortBy}>
            <option value="newest">Newest</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </SelectFilter>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        {tabs.map((t) => {
          const cnt = t === 'All' ? normalizedOrders.length : normalizedOrders.filter((o) => o.status === t).length;
          const on = tab === t;
          return (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${on ? T.teal : T.border}`, background: on ? T.teal : T.card, color: on ? '#fff' : T.muted, fontSize: 12, fontWeight: on ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {t} <span style={{ opacity: 0.7, fontSize: 11 }}>({cnt})</span>
            </button>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <Card><EmptyState icon="📭" msg="No orders match" /></Card>
      ) : isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((o) => (
            <Card key={o.id} style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, color: T.teal, fontSize: 13 }}>{o.orderNumber || o.id}</div>
                  <div style={{ fontWeight: 600, color: T.text, fontSize: 14 }}>{o.customer}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{o.phone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Tag s={o.status} />
                  <div style={{ fontWeight: 700, fontSize: 16, color: T.text, marginTop: 4 }}>GHS {o.subtotal + o.fee}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <Btn sm onClick={() => setOpen(o)} full>View Details</Btn>
                {NEXT_STATUS[o.status] && o.status !== 'Cancelled' ? (
                  <Btn sm v="outline" onClick={() => advance(o)} full disabled={isUpdatingStatus && updatingOrderId === o.id}>
                    → {NEXT_STATUS[o.status]}
                  </Btn>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
              <thead>
                <tr style={{ background: T.bgAlt }}>
                  {['Order', 'Customer', 'Items', 'Total', 'Status', 'Paid', 'Action'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => (
                  <tr key={o.id} style={{ borderTop: `1px solid ${T.border}`, background: i % 2 ? T.bgAlt : T.card }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: T.teal, whiteSpace: 'nowrap' }}>{o.orderNumber || o.id}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 600, color: T.text }}>{o.customer}</div>
                      <div style={{ fontSize: 11, color: T.muted }}>{o.phone}</div>
                    </td>
                    <td style={{ padding: '10px 14px', color: T.muted, fontSize: 12 }}>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: T.text }}>GHS {o.subtotal + o.fee}</td>
                    <td style={{ padding: '10px 14px' }}><Tag s={o.status} /></td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontSize: 12, color: o.paid ? T.green : T.red, fontWeight: 700 }}>{o.paid ? '✓ Paid' : '✗ Unpaid'}</div>
                      <div style={{ fontSize: 11, color: T.muted }}>{o.method}</div>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <Btn sm onClick={() => setOpen(o)}>View</Btn>
                        {NEXT_STATUS[o.status] && o.status !== 'Cancelled' ? (
                          <Btn sm v="outline" onClick={() => advance(o)} disabled={isUpdatingStatus && updatingOrderId === o.id}>
                            → {NEXT_STATUS[o.status]}
                          </Btn>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {open ? (
        <Modal title={`Order ${open.orderNumber || open.id}`} onClose={() => setOpen(null)} w={520}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[['Customer', open.customer], ['Phone', open.phone], ['Address', open.address], ['Placed', open.time], ['Payment', open.method], ['Paid', open.paid ? '✓ Yes' : '✗ No']].map(([l, v]) => (
              <div key={l} style={{ background: T.bgAlt, borderRadius: 9, padding: '9px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: l === 'Paid' ? (open.paid ? T.green : T.red) : T.text }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background: T.bgAlt, borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Order Items</div>
            {open.items.map((it, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < open.items.length - 1 ? `1px solid ${T.border}` : 'none', fontSize: 13 }}>
                <span style={{ color: T.text }}>{it.name} <span style={{ color: T.muted }}>×{it.qty}</span></span>
                <span style={{ fontWeight: 700, color: T.text }}>GHS {it.price * it.qty}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0 0', fontSize: 12, color: T.muted }}><span>Subtotal</span><span>GHS {open.subtotal}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12, color: T.muted }}><span>Delivery fee</span><span>GHS {open.fee}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0', borderTop: `1px solid ${T.border}`, marginTop: 4, fontWeight: 800, fontSize: 15, color: T.text }}>
              <span>Total</span><span style={{ color: T.teal }}>GHS {open.subtotal + open.fee}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {open.status === 'Confirmed' || open.status === 'Processing' || open.status === 'Shipped' ? (
              <Btn onClick={() => advance(open)} disabled={isUpdatingStatus && updatingOrderId === open.id}>
                Mark as {NEXT_STATUS[open.status]} →
              </Btn>
            ) : null}
            {open.status === 'Cancelled' ? (
              <Btn v="outline" onClick={() => advance(open)} disabled={isUpdatingStatus && updatingOrderId === open.id}>
                Mark as Refunded →
              </Btn>
            ) : null}
            {open.status !== 'Cancelled' && open.status !== 'Delivered' && open.status !== 'Refunded' ? (
              <Btn v="danger" onClick={() => cancel(open)} disabled={isUpdatingStatus && updatingOrderId === open.id}>
                Cancel Order
              </Btn>
            ) : null}
            <Btn v="ghost" onClick={() => setOpen(null)}>Close</Btn>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

export default function OrdersPage() {
  const { setOrders } = useAppStore();
  const { data: ordersData, isLoading, error } = useOrders();

  useEffect(() => {
    if (ordersData) {
      // Normalize API order structure to match local expectations
      const normalized = ordersData.map((o) => {
        const statusMap = {
          pending: 'Pending',
          confirmed: 'Confirmed',
          processing: 'Processing',
          shipped: 'Shipped',
          delivered: 'Delivered',
          cancelled: 'Cancelled',
          refunded: 'Refunded'
        };
        return {
          ...o,
          id: o.orderId,
          customer: o.customerName || 'Unknown',
          phone: o.customerPhone || '',
          address: o.shippingAddress?.streetAddress || '',
          time: o.createdAt || new Date().toISOString(),
          status: statusMap[o.status] || 'Pending',
          paid: o.paymentStatus === 'paid',
          method: o.paymentMethod || 'Unknown',
          subtotal: Math.round((o.total || 0) * 0.95), // Estimate subtotal (80% of total for fee calculation)
          fee: Math.round((o.total || 0) * 0.05), // Estimate fee (20% of total)
          items: (o.items || []).map((item) => ({
            ...item,
            name: item.productName || item.name || 'Item',
            qty: item.quantity ?? item.qty ?? 0,
            price: item.unitPrice ?? item.price ?? 0
          }))
        };
      });
      setOrders(normalized);
    }
  }, [ordersData, setOrders]);

  const { orders } = useAppStore();

  if (isLoading) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#d32f2f' }}>
        Failed to load orders. Using local data.
      </div>
    );
  }

  return <OrdersExtracted orders={orders} setOrders={setOrders} />;
}
