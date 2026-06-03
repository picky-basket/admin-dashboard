export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/admin/dashboard',
  ORDERS: '/orders',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  CUSTOMERS: '/customers',
  PAYMENTS: '/payments',
  SETTINGS: '/settings'
};

export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊', path: ROUTES.DASHBOARD },
  { key: 'orders', label: 'Orders', icon: '📦', path: ROUTES.ORDERS },
  { key: 'products', label: 'Products', icon: '🛒', path: ROUTES.PRODUCTS },
  { key: 'categories', label: 'Categories', icon: '🗂️', path: ROUTES.CATEGORIES },
  { key: 'customers', label: 'Customers', icon: '👥', path: ROUTES.CUSTOMERS },
  { key: 'payments', label: 'Payments', icon: '💰', path: ROUTES.PAYMENTS }
];
