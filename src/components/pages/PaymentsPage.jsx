import { PageCard } from '../common/PageCard.jsx';
import { useAppStore } from '../../store/appStore.jsx';

export function PaymentsPage() {
  const { orders } = useAppStore();

  return (
    <PageCard title="Payments" subtitle="Derived from orders (mock)">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.paymentMethod}</td>
                <td>GHS {order.subtotal + order.fee}</td>
                <td>{order.paid ? 'Paid' : 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageCard>
  );
}
