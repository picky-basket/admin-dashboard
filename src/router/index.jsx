import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect
} from '@tanstack/react-router';
import { AppLayout } from '../components/layout/AppLayout.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import OrdersPage from '../pages/OrdersPage.jsx';
import ProductsPage from '../pages/ProductsPage.jsx';
import DishesPage from '../pages/DishesPage.jsx';
import CategoriesPage from '../pages/CategoriesPage.jsx';
import CustomersPage from '../pages/CustomersPage.jsx';
import PaymentsPage from '../pages/PaymentsPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';
import { ROUTES } from '../types/routes.js';

const rootRoute = createRootRoute({
  component: Outlet
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.LOGIN,
  component: LoginPage
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  beforeLoad: ({ context, location }) => {
    if (!context.store.loggedIn) {
      throw redirect({
        to: ROUTES.LOGIN,
        search: { redirect: location.href }
      });
    }
  },
  component: AppLayout
});

const rootRedirectRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: ROUTES.DASHBOARD }); }
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: ROUTES.DASHBOARD,
  component: DashboardPage
});

const ordersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: ROUTES.ORDERS,
  component: OrdersPage
});

const productsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: ROUTES.PRODUCTS,
  component: ProductsPage
});

const dishesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: ROUTES.DISHES,
  component: DishesPage
});

const categoriesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: ROUTES.CATEGORIES,
  component: CategoriesPage
});

const customersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: ROUTES.CUSTOMERS,
  component: CustomersPage
});

const paymentsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: ROUTES.PAYMENTS,
  component: PaymentsPage
});

const settingsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: ROUTES.SETTINGS,
  component: SettingsPage
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRoute.addChildren([
    rootRedirectRoute,
    dashboardRoute,
    ordersRoute,
    productsRoute,
    dishesRoute,
    categoriesRoute,
    customersRoute,
    paymentsRoute,
    settingsRoute
  ])
]);

export const router = createRouter({
  routeTree,
  context: {
    store: {
      loggedIn: false
    }
  }
});
