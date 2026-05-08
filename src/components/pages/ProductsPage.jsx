import { PageCard } from '../common/PageCard.jsx';
import { useAppStore } from '../../store/appStore.jsx';

export function ProductsPage() {
  const { products, categories } = useAppStore();

  return (
    <PageCard title="Products" subtitle="Catalog from mock data">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const category = categories.find((item) => item.id === product.categoryId);
              return (
                <tr key={product.id}>
                  <td>{product.image} {product.name}</td>
                  <td>{category?.name || '-'}</td>
                  <td>{product.unit}</td>
                  <td>GHS {product.price}</td>
                  <td>{product.stock}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageCard>
  );
}
