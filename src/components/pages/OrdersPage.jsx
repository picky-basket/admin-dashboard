import { PageCard } from '../common/PageCard.jsx';
import { useAppStore } from '../../store/appStore.jsx';

export function OrdersPage() {
  const { orders, customers } = useAppStore();

  return (
    <PageCard title="Orders" subtitle="Current order queue (mock)">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Paid</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const customer = customers.find((item) => item.id === order.customerId);
              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{customer?.name || 'Unknown'}</td>
                  <td>{order.status}</td>
                  <td>{order.paid ? 'Yes' : 'No'}</td>
                  <td>GHS {order.subtotal + order.fee}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageCard>
  );
}
