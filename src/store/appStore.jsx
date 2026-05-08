import { createContext, useContext, useMemo, useState } from 'react';
import { mockCategories, mockCustomers, mockOrders, mockProducts } from '../data/mockData.js';

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [categories, setCategories] = useState(mockCategories);
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [customers, setCustomers] = useState(mockCustomers);

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === 'Pending').length,
    [orders]
  );

  const revenue = useMemo(
    () => orders.filter((order) => order.paid).reduce((total, order) => total + order.subtotal + order.fee, 0),
    [orders]
  );

  const value = {
    loggedIn,
    setLoggedIn,
    darkMode,
    setDarkMode,
    categories,
    setCategories,
    products,
    setProducts,
    orders,
    setOrders,
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
