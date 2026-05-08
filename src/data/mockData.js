export const mockCategories = [
  { id: 'cat-1', name: 'Vegetables', imageUrl: '' },
  { id: 'cat-2', name: 'Fruits', imageUrl: '' },
  { id: 'cat-3', name: 'Proteins', imageUrl: '' }
];

export const mockProducts = [
  { id: 'prd-1', name: 'Tomatoes', categoryId: 'cat-1', price: 18, unit: 'kg', stock: 14, image: '🍅' },
  { id: 'prd-2', name: 'Bananas', categoryId: 'cat-2', price: 12, unit: 'dozen', stock: 9, image: '🍌' },
  { id: 'prd-3', name: 'Chicken Thighs', categoryId: 'cat-3', price: 100, unit: 'kg', stock: 5, image: '🍗' }
];

export const mockCustomers = [
  { id: 'cus-1', name: 'Ama Mensah', phone: '+233200000001', email: 'ama@example.com', status: 'Active', totalSpent: 890 },
  { id: 'cus-2', name: 'Kojo Addo', phone: '+233200000002', email: 'kojo@example.com', status: 'Active', totalSpent: 410 },
  { id: 'cus-3', name: 'Nana Boateng', phone: '+233200000003', email: 'nana@example.com', status: 'Inactive', totalSpent: 0 }
];

export const mockOrders = [
  {
    id: 'ord-1',
    customerId: 'cus-1',
    status: 'Pending',
    paid: false,
    paymentMethod: 'Mobile Money',
    subtotal: 120,
    fee: 12,
    createdAt: '2026-05-01T09:15:00.000Z'
  },
  {
    id: 'ord-2',
    customerId: 'cus-2',
    status: 'Delivering',
    paid: true,
    paymentMethod: 'Card',
    subtotal: 220,
    fee: 12,
    createdAt: '2026-05-02T13:05:00.000Z'
  },
  {
    id: 'ord-3',
    customerId: 'cus-1',
    status: 'Delivered',
    paid: true,
    paymentMethod: 'Cash',
    subtotal: 80,
    fee: 12,
    createdAt: '2026-05-03T17:40:00.000Z'
  }
];
