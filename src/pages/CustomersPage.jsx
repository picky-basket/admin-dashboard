import { useEffect, useMemo, useState } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import { useAppStore } from '../store/appStore.jsx';
import { useExtractedTheme } from '../components/extracted/theme.js';
import { useCustomers } from '../api/hooks/useCustomers.ts';
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

function CustomersExtracted({
  customers,
  setCustomers,
  orders,
  search,
  setSearch,
  statusFlt,
  setStatus,
  sortBy,
  setSortBy,
  showSkeleton
}) {
  const T = useT();
  const { isMobile } = useBreakpoint();
  const [open, setOpen] = useState(null);

  const normalizedCustomers = useMemo(
    () =>
      (customers || []).map((customer) => ({
        id: customer?.id ?? `c-${Math.random().toString(36).slice(2)}`,
        name: customer?.name ?? 'Unknown Customer',
        email: customer?.email ?? '-',
        phone: customer?.phone ?? '-',
        orders: Number(customer?.orders ?? 0),
        spent: Number(customer?.spent ?? 0),
        joined: customer?.joined ?? '-',
        lastSeen: customer?.lastSeen ?? '-',
        status: customer?.status ?? 'Inactive'
      })),
    [customers]
  );

  const normalizedOrders = useMemo(() => (orders || []).map((order) => ({ ...order })), [orders]);

  const shown = useMemo(() => {
    let list = normalizedCustomers;
    if (statusFlt !== 'All') list = list.filter((c) => c.status === statusFlt);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q));
    }
    if (sortBy === 'spent') list = [...list].sort((a, b) => b.spent - a.spent);
    if (sortBy === 'orders') list = [...list].sort((a, b) => b.orders - a.orders);
    if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [normalizedCustomers, search, statusFlt, sortBy]);

  const getCustOrders = (c) => normalizedOrders.filter((o) => o.customer === c.name);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Customers</h2>
          <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>
            {showSkeleton ? 'Loading customer records...' : `${normalizedCustomers.length} registered · ${shown.length} shown`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." />
          <SelectFilter value={statusFlt} onChange={setStatus}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </SelectFilter>
          <SelectFilter value={sortBy} onChange={setSortBy}>
            <option value="spent">Most Spent</option>
            <option value="orders">Most Orders</option>
            <option value="name">Name A-Z</option>
          </SelectFilter>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { label: 'Total', value: normalizedCustomers.length, color: T.teal },
          { label: 'Active', value: normalizedCustomers.filter((c) => c.status === 'Active').length, color: T.green },
          { label: 'Inactive', value: normalizedCustomers.filter((c) => c.status === 'Inactive').length, color: T.muted }
        ].map((s) => (
          <Card key={s.label} style={{ textAlign: 'center', padding: '12px 10px' }}>
            {showSkeleton ? (
              <div style={{ height: 20, width: 48, borderRadius: 8, background: T.bgAlt, margin: '0 auto' }} />
            ) : (
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            )}
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>
      {showSkeleton ? (
        <CustomersListSkeleton isMobile={isMobile} T={T} />
      ) : shown.length === 0 ? (
        <Card><EmptyState icon="👥" msg="No customers match" /></Card>
      ) : isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {shown.map((c) => (
            <Card key={c.id} style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.tealLt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: T.teal, flexShrink: 0 }}>{c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: T.text }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: T.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</div>
                </div>
                <Tag s={c.status} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                {[['Orders', c.orders], ['Spent', `GHS ${c.spent}`], ['Last', c.lastSeen]].map(([l, v]) => (
                  <div key={l} style={{ background: T.bgAlt, borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{l}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              <Btn sm full onClick={() => setOpen(c)}>View Profile</Btn>
            </Card>
          ))}
        </div>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
              <thead>
                <tr style={{ background: T.bgAlt }}>
                  {['Customer', 'Phone', 'Orders', 'Spent', 'Last Seen', 'Status', ''].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((c, i) => (
                  <tr key={c.id} style={{ borderTop: `1px solid ${T.border}`, background: i % 2 ? T.bgAlt : T.card }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: T.tealLt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: T.teal, flexShrink: 0 }}>{c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: T.text }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: T.muted }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', color: T.muted, fontSize: 12 }}>{c.phone}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: T.text }}>{c.orders}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: T.teal }}>GHS {c.spent.toLocaleString()}</td>
                    <td style={{ padding: '10px 14px', color: T.muted, fontSize: 12 }}>{c.lastSeen}</td>
                    <td style={{ padding: '10px 14px' }}><Tag s={c.status} /></td>
                    <td style={{ padding: '10px 14px' }}><Btn sm onClick={() => setOpen(c)}>View</Btn></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {open ? (
        <Modal title="Customer Profile" onClose={() => setOpen(null)} w={500}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: T.tealLt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: T.teal, margin: '0 auto 10px' }}>{open.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: T.text }}>{open.name}</div>
            <div style={{ fontSize: 13, color: T.muted }}>{open.email}</div>
            <div style={{ marginTop: 7 }}><Tag s={open.status} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[['Phone', open.phone], ['Joined', open.joined], ['Last Seen', open.lastSeen], ['Total Orders', open.orders], ['Total Spent', `GHS ${open.spent.toLocaleString()}`], ['Avg. Order', `GHS ${open.orders ? Math.round(open.spent / open.orders) : 0}`]].map(([l, v]) => (
              <div key={l} style={{ background: T.bgAlt, borderRadius: 9, padding: '9px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{v}</div>
              </div>
            ))}
          </div>
          {getCustOrders(open).length > 0 ? (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Recent Orders</div>
              {getCustOrders(open).map((o) => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: T.teal }}>{o.id}</span>
                  <span style={{ color: T.muted, fontSize: 12 }}>{o.time}</span>
                  <span style={{ fontWeight: 700, color: T.text }}>GHS {o.subtotal + o.fee}</span>
                  <Tag s={o.status} />
                </div>
              ))}
            </div>
          ) : null}
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn
              full
              v={open.status === 'Active' ? 'danger' : 'primary'}
              onClick={() => {
                setCustomers((p) => p.map((c) => (c.id === open.id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c)));
                setOpen((prev) => ({ ...prev, status: prev.status === 'Active' ? 'Inactive' : 'Active' }));
              }}
            >
              {open.status === 'Active' ? '🚫 Suspend' : '✅ Re-activate'}
            </Btn>
            <Btn v="ghost" onClick={() => setOpen(null)}>Close</Btn>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function CustomersListSkeleton({ isMobile, T }) {
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={`customer-mobile-skeleton-${i}`} style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.bgAlt }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 11, width: '42%', borderRadius: 8, background: T.bgAlt, marginBottom: 6 }} />
                <div style={{ height: 9, width: '58%', borderRadius: 8, background: T.bgAlt }} />
              </div>
            </div>
            <div style={{ height: 28, width: '100%', borderRadius: 8, background: T.bgAlt }} />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
          <thead>
            <tr style={{ background: T.bgAlt }}>
              {['Customer', 'Phone', 'Orders', 'Spent', 'Last Seen', 'Status', ''].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={`customer-table-skeleton-${i}`} style={{ borderTop: `1px solid ${T.border}`, background: i % 2 ? T.bgAlt : T.card }}>
                {Array.from({ length: 7 }).map((__, j) => (
                  <td key={`customer-cell-skeleton-${i}-${j}`} style={{ padding: '10px 14px' }}>
                    <div style={{ height: 10, width: `${j === 0 ? 80 : j === 3 ? 52 : 68}%`, borderRadius: 8, background: T.bgAlt }} />
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

export default function CustomersPage() {
  const { customers, setCustomers, orders, customersView, setCustomersView } = useAppStore();
  const {
    data: customersData,
    isLoading,
    isFetching,
    error
  } = useCustomers();
  const T = useT();

  const search = customersView?.search ?? '';
  const statusFlt = customersView?.statusFilter ?? 'All';
  const sortBy = customersView?.sortBy ?? 'spent';

  const setSearch = (value) => setCustomersView((prev) => ({ ...prev, search: value }));
  const setStatus = (value) => setCustomersView((prev) => ({ ...prev, statusFilter: value }));
  const setSortBy = (value) => setCustomersView((prev) => ({ ...prev, sortBy: value }));

  useEffect(() => {
    if (!customersData) return;

    const normalized = customersData.map((c) => ({
      id: c.id || c.customerId,
      name: c.name || 'Unknown Customer',
      email: c.email || '-',
      phone: c.phoneNumber || '-',
      orders: Number(c.numberOfOrders || 0),
      spent: Number(c.totalAmountSpent || 0),
      joined: c.createdAt || '-',
      lastSeen: c.lastActive || '-',
      status: c.isActive ? 'Active' : 'Inactive'
    }));

    setCustomers(normalized);
  }, [customersData, setCustomers]);

  const isInitialLoad = isLoading && !customersData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {error ? (
        <Card style={{ padding: 12, border: `1px solid ${T.red}44`, background: T.redL }}>
          <div style={{ color: T.red, fontSize: 12, fontWeight: 600 }}>Failed to refresh customers. Showing latest available results.</div>
        </Card>
      ) : null}
      {isFetching && !isInitialLoad ? (
        <div style={{ color: T.muted, fontSize: 12, fontWeight: 600, padding: '0 2px' }}>Updating customers...</div>
      ) : null}
      <CustomersExtracted
        customers={customers}
        setCustomers={setCustomers}
        orders={orders}
        search={search}
        setSearch={setSearch}
        statusFlt={statusFlt}
        setStatus={setStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showSkeleton={isInitialLoad}
      />
    </div>
  );
}
