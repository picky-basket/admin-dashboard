import { useNavigate } from '@tanstack/react-router';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import { useUser } from '../api/hooks/useUser.ts';
import { useDashboard } from '../api/hooks/useDashboard.ts';
import { statusStyle, useExtractedTheme } from '../components/extracted/theme.js';
import Button from '../components/extracted/ui/Button.jsx';
import Card from '../components/extracted/ui/Card.jsx';
import Tag from '../components/extracted/ui/Tag.jsx';
import { ROUTES } from '../types/routes.js';

const Btn = Button;

function useT() {
  return useExtractedTheme();
}

function toTitleCase(value = '') {
  return value
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function DashboardSkeleton() {
  const T = useT();
  const { isMobile, isTablet } = useBreakpoint();
  const cols = isMobile ? '1fr 1fr' : isTablet ? '1fr 1fr' : 'repeat(4,1fr)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={`card-skeleton-${i}`} style={{ padding: '14px 12px' }}>
            <div style={{ height: 16, width: '50%', borderRadius: 8, background: T.bgAlt, marginBottom: 10 }} />
            <div style={{ height: 10, width: '68%', borderRadius: 8, background: T.bgAlt }} />
          </Card>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={`panel-skeleton-${i}`}>
            <div style={{ height: 14, width: '42%', borderRadius: 8, background: T.bgAlt, marginBottom: 14 }} />
            {Array.from({ length: 5 }).map((__, row) => (
              <div key={`panel-row-${i}-${row}`} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ height: 10, width: '28%', borderRadius: 8, background: T.bgAlt }} />
                  <div style={{ height: 10, width: '18%', borderRadius: 8, background: T.bgAlt }} />
                </div>
                <div style={{ height: 6, width: '100%', borderRadius: 4, background: T.bgAlt }} />
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

function DashboardExtracted({ dashboard, user, go }) {
  const T = useT();
  const { isMobile, isTablet } = useBreakpoint();
  const cards = dashboard?.cards ?? {
    revenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    lowStockCount: 0
  };
  const orderPipeline = dashboard?.orderPipeline ?? [];
  const recentOrders = dashboard?.recentOrders ?? [];
  const stockAlerts = dashboard?.stockAlerts ?? { count: 0, items: [] };
  const cols = isMobile ? '1fr 1fr' : isTablet ? '1fr 1fr' : 'repeat(4,1fr)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: T.text, margin: 0, letterSpacing: -0.4 }}>Good day, {user?.name ?? 'Admin'} 👋</h2>
          <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>Here is what is happening in your store today.</p>
        </div>
        <Btn onClick={() => go('orders')} sm v="outline">View All Orders</Btn>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12 }}>
        {[
          { label: 'Revenue', value: `GHS ${cards.revenue.toLocaleString()}`, icon: '💰', color: T.teal, sub: 'All paid orders' },
          { label: 'Pending', value: cards.pendingOrders, icon: '⏳', color: T.orange, sub: 'Awaiting process' },
          { label: 'Delivered', value: cards.deliveredOrders, icon: '✅', color: T.green, sub: 'Completed' },
          { label: 'Low Stock', value: cards.lowStockCount, icon: '⚠️', color: T.red, sub: 'Need restock' }
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
          {/** Use one consistent accent color across the pipeline. */}
          {(() => {
            const pipelineColor = statusStyle('shipped', T).fg;
            return orderPipeline.map((pipelineItem) => {
              const statusLabel = toTitleCase(pipelineItem.status);
              return (
                <div key={pipelineItem.status} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: pipelineColor, fontWeight: 600 }}>{statusLabel}</span>
                    <span style={{ color: T.muted }}>{pipelineItem.count} · {pipelineItem.percentage}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 4, background: T.bgAlt, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pipelineItem.percentage}%`, background: pipelineColor, borderRadius: 4, transition: 'width .5s ease' }} />
                  </div>
                </div>
              );
            });
          })()}
        </Card>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 14 }}>Recent Orders</div>
          {recentOrders.map((order, i) => (
            <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i > 0 ? `1px solid ${T.border}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.customerName}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{order.orderNumber}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: T.text, whiteSpace: 'nowrap' }}>GHS {order.amount}</div>
              <Tag s={toTitleCase(order.status)} />
            </div>
          ))}
        </Card>
      </div>
      {stockAlerts.count > 0 ? (
        <div style={{ background: T.redL, borderRadius: 14, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: T.red, marginBottom: 10 }}>⚠️ Stock Alerts - {stockAlerts.count} item{stockAlerts.count > 1 ? 's' : ''} need attention</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 8 }}>
            {stockAlerts.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: T.card, borderRadius: 9, fontSize: 13, border: `1px solid ${T.red}33` }}>
                <span style={{ fontWeight: 600, color: T.text }}>{item.name}</span>
                <span style={{ fontWeight: 700, color: item.status === 'out_of_stock' ? T.red : T.yellow }}>{item.status === 'out_of_stock' ? 'Out' : `Low(${item.stock})`}</span>
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
  const {
    data: user,
    isLoading: userLoading,
    isFetching: userFetching,
    error: userError
  } = useUser();
  const {
    data: dashboard,
    isLoading: dashboardLoading,
    isFetching: dashboardFetching,
    error: dashboardError
  } = useDashboard();
  const T = useT();

  const go = (page) => {
    const pathMap = {
      dash: ROUTES.DASHBOARD,
      orders: ROUTES.ORDERS,
      products: ROUTES.PRODUCTS,
      categories: ROUTES.CATEGORIES,
      customers: ROUTES.CUSTOMERS,
      payments: ROUTES.PAYMENTS,
      settings: ROUTES.SETTINGS
    };

    navigate({ to: pathMap[page] ?? ROUTES.DASHBOARD });
  };

  const isInitialLoad = (dashboardLoading && !dashboard) || (userLoading && !user);
  const isRefreshing = (dashboardFetching || userFetching) && !isInitialLoad;
  const hasError = !!dashboardError || !!userError;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {hasError ? (
        <Card style={{ padding: 12, border: `1px solid ${T.red}44`, background: T.redL }}>
          <div style={{ color: T.red, fontSize: 12, fontWeight: 600 }}>Failed to refresh dashboard. Showing latest available results.</div>
        </Card>
      ) : null}
      {isRefreshing ? (
        <div style={{ color: T.muted, fontSize: 12, fontWeight: 600, padding: '0 2px' }}>Updating dashboard...</div>
      ) : null}
      {isInitialLoad ? <DashboardSkeleton /> : <DashboardExtracted dashboard={dashboard} user={user} go={go} />}
    </div>
  );
}
