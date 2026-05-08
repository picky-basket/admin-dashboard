import { PageCard } from '../common/PageCard.jsx';
import { useAppStore } from '../../store/appStore.jsx';

export function CategoriesPage() {
  const { categories, products } = useAppStore();

  return (
    <PageCard title="Categories" subtitle="Product grouping (mock)">
      <ul className="simple-list">
        {categories.map((category) => {
          const count = products.filter((product) => product.categoryId === category.id).length;
          return <li key={category.id}>{category.name} ({count} products)</li>;
        })}
      </ul>
    </PageCard>
  );
}
