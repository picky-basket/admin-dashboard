import { createContext, useContext, useMemo, useState } from 'react';
import { mockCategories, mockCustomers, mockOrders, mockProducts } from '../data/mockData.js';
import { clearTokens, hasTokens, setTokens as storeSetTokens } from '../api/tokenStore.js';

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  // Initialize loggedIn from persisted tokens so page refresh keeps session alive
  const [loggedIn, setLoggedIn] = useState(() => hasTokens());
  const [darkMode, setDarkMode] = useState(false);

  const [categories, setCategories] = useState(mockCategories);
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [customers, setCustomers] = useState(mockCustomers);
  const [ordersView, setOrdersView] = useState({
    tab: 'All',
    search: '',
    sortBy: 'newest'
  });
  const [productsView, setProductsView] = useState({
    catFilter: 'All',
    search: '',
    stockFilter: 'All',
    viewMode: 'grid'
  });
  const [customersView, setCustomersView] = useState({
    search: '',
    statusFilter: 'All',
    sortBy: 'spent'
  });
  const [categoriesView, setCategoriesView] = useState({
    search: ''
  });
  const [paymentsView, setPaymentsView] = useState({
    search: '',
    methodFilter: 'All'
  });

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === 'Pending').length,
    [orders]
  );

  const revenue = useMemo(
    () => orders.filter((order) => order.paid).reduce((total, order) => total + order.subtotal + order.fee, 0),
    [orders]
  );

  const setTokens = (tokens) => {
    storeSetTokens(tokens);
    setLoggedIn(true);
  };

  const signOut = () => {
    clearTokens();
    setLoggedIn(false);
  };

  const value = {
    loggedIn,
    setLoggedIn,
    setTokens,
    signOut,
    darkMode,
    setDarkMode,
    categories,
    setCategories,
    products,
    setProducts,
    orders,
    setOrders,
    ordersView,
    setOrdersView,
    productsView,
    setProductsView,
    customersView,
    setCustomersView,
    categoriesView,
    setCategoriesView,
    paymentsView,
    setPaymentsView,
    customers,
    setCustomers,
    pendingOrders,
    revenue
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }
  return context;
}
