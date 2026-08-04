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

function OrdersExtracted({ orders, setOrders, search, setSearch, sortBy, setSortBy, tab, setTab }) {
  const T = useT();
  const { isMobile } = useBreakpoint();
  const { mutateAsync: mutateOrderStatus, isPending: isUpdatingStatus } = useUpdateOrderStatus();
  const [open, setOpen] = useState(null);
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
    return list;
  }, [normalizedOrders, tab]);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Orders</h2>
          <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>{normalizedOrders.length} total · {filtered.length} shown</p>
        </div>
      </div>
      <Card style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search orders..." />
          <SelectFilter value={sortBy} onChange={setSortBy}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="orderNumberAsc">Order # (A-Z)</option>
            <option value="orderNumberDesc">Order # (Z-A)</option>
          </SelectFilter>
        </div>
      </Card>
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

function OrdersListSkeleton({ isMobile, T }) {
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={`mobile-skeleton-${i}`} style={{ padding: 14 }}>
            <div style={{ height: 12, width: '42%', background: T.bgAlt, borderRadius: 8, marginBottom: 10 }} />
            <div style={{ height: 10, width: '58%', background: T.bgAlt, borderRadius: 8, marginBottom: 8 }} />
            <div style={{ height: 10, width: '34%', background: T.bgAlt, borderRadius: 8, marginBottom: 12 }} />
            <div style={{ height: 28, width: '100%', background: T.bgAlt, borderRadius: 10 }} />
          </Card>
        ))}
      </div>
    );
  }

  return (
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
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={`table-skeleton-${i}`} style={{ borderTop: `1px solid ${T.border}`, background: i % 2 ? T.bgAlt : T.card }}>
                {Array.from({ length: 7 }).map((__, j) => (
                  <td key={`cell-skeleton-${i}-${j}`} style={{ padding: '10px 14px' }}>
                    <div style={{ height: 10, width: `${j === 0 ? 80 : j === 3 ? 56 : 72}%`, background: T.bgAlt, borderRadius: 8 }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default function OrdersPage() {
  const { setOrders, orders, ordersView, setOrdersView } = useAppStore();
  const tab = ordersView?.tab ?? 'All';
  const search = ordersView?.search ?? '';
  const sortBy = ordersView?.sortBy ?? 'newest';
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const T = useT();
  const { isMobile } = useBreakpoint();

  const setSearch = (value) => {
    setOrdersView((prev) => ({
      ...prev,
      search: value
    }));
  };

  const setSortBy = (value) => {
    setOrdersView((prev) => ({
      ...prev,
      sortBy: value
    }));
  };

  const setTab = (value) => {
    setOrdersView((prev) => ({
      ...prev,
      tab: value
    }));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const apiSort = useMemo(() => {
    switch (sortBy) {
      case 'oldest':
        return { sort_by: 'createdAt', sort_order: 'asc' };
      case 'orderNumberAsc':
        return { sort_by: 'orderNumber', sort_order: 'asc' };
      case 'orderNumberDesc':
        return { sort_by: 'orderNumber', sort_order: 'desc' };
      case 'newest':
      default:
        return { sort_by: 'createdAt', sort_order: 'desc' };
    }
  }, [sortBy]);

  const orderQueryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      sort_by: apiSort.sort_by,
      sort_order: apiSort.sort_order
    }),
    [debouncedSearch, apiSort]
  );

  const {
    data: ordersData,
    isLoading,
    isFetching,
    error
  } = useOrders(orderQueryParams);

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

  const isInitialLoad = isLoading && !ordersData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {error ? (
        <Card style={{ padding: 12, border: `1px solid ${T.red}44`, background: T.redL }}>
          <div style={{ color: T.red, fontSize: 12, fontWeight: 600 }}>Failed to refresh orders. Showing latest available results.</div>
        </Card>
      ) : null}
      {isFetching && !isInitialLoad ? (
        <div style={{ color: T.muted, fontSize: 12, fontWeight: 600, padding: '0 2px' }}>Updating orders...</div>
      ) : null}
      {isInitialLoad ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Orders</h2>
              <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>Loading latest orders...</p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
              <SearchBar value={search} onChange={setSearch} placeholder="Search orders..." />
              <SelectFilter value={sortBy} onChange={setSortBy}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="orderNumberAsc">Order # (A-Z)</option>
                <option value="orderNumberDesc">Order # (Z-A)</option>
              </SelectFilter>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
            {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'].map((statusLabel) => {
              const on = tab === statusLabel;
              return (
                <button
                  key={statusLabel}
                  onClick={() => setTab(statusLabel)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: `1.5px solid ${on ? T.teal : T.border}`,
                    background: on ? T.teal : T.card,
                    color: on ? '#fff' : T.muted,
                    fontSize: 12,
                    fontWeight: on ? 700 : 400,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  {statusLabel}
                </button>
              );
            })}
          </div>
          <OrdersListSkeleton isMobile={isMobile} T={T} />
        </div>
      ) : (
        <OrdersExtracted
          orders={orders}
          setOrders={setOrders}
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          tab={tab}
          setTab={setTab}
        />
      )}
    </div>
  );
}
