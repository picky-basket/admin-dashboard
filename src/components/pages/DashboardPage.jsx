import { Link } from 'react-router-dom';
import { PageCard } from '../common/PageCard.jsx';
import { ROUTES } from '../../types/routes.js';
import { useAppStore } from '../../store/appStore.jsx';

export function DashboardPage() {
  const { revenue, pendingOrders, products, customers, orders } = useAppStore();

  const deliveredOrders = orders.filter((order) => order.status === 'Delivered').length;
  const lowStockProducts = products.filter((product) => product.stock <= 5).length;

  return (
    <div className="page-stack">
      <PageCard
        title="Dashboard"
        subtitle="Overview of current activity"
        action={<Link to={ROUTES.ORDERS}>View orders</Link>}
      >
        <div className="stats-grid">
          <div className="stat-box"><span>Revenue</span><strong>GHS {revenue}</strong></div>
          <div className="stat-box"><span>Pending</span><strong>{pendingOrders}</strong></div>
          <div className="stat-box"><span>Delivered</span><strong>{deliveredOrders}</strong></div>
          <div className="stat-box"><span>Low stock</span><strong>{lowStockProducts}</strong></div>
        </div>
      </PageCard>

      <PageCard title="Quick Counts" subtitle="Mock-data snapshot">
        <ul className="simple-list">
          <li>Products: {products.length}</li>
          <li>Categories: {new Set(products.map((product) => product.categoryId)).size}</li>
          <li>Customers: {customers.length}</li>
          <li>Total orders: {orders.length}</li>
        </ul>
      </PageCard>
    </div>
  );
}
