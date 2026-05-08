import { PageCard } from '../common/PageCard.jsx';
import { useAppStore } from '../../store/appStore.jsx';

export function CustomersPage() {
  const { customers } = useAppStore();

  return (
    <PageCard title="Customers" subtitle="Customer roster (mock)">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.status}</td>
                <td>GHS {customer.totalSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageCard>
  );
}
