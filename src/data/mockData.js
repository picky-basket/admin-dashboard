export const mockCategories = [
  { id: 1, name: 'Vegetables', icon: '🥦', color: '#22c55e' },
  { id: 2, name: 'Fruits', icon: '🍎', color: '#f97316' },
  { id: 3, name: 'Grains & Flour', icon: '🌾', color: '#eab308' },
  { id: 4, name: 'Fish & Seafood', icon: '🐟', color: '#06b6d4' },
  { id: 5, name: 'Herbs & Spices', icon: '🌿', color: '#10b981' },
  { id: 6, name: 'Dairy & Eggs', icon: '🥚', color: '#f59e0b' },
  { id: 7, name: 'Meats', icon: '🥩', color: '#ef4444' },
  { id: 8, name: 'Essentials', icon: '🧄', color: '#8b5cf6' }
];

export const mockProducts = [
  { id: 1, name: 'Fresh Tilapia', catId: 4, price: 45, unit: 'kg', stock: 24, image: null, description: 'Daily catch from Tema' },
  { id: 2, name: 'Asparagus', catId: 1, price: 12, unit: 'bundle', stock: 8, image: null, description: 'Organic fresh bundles' },
  { id: 3, name: 'Scotch Bonnet', catId: 5, price: 4, unit: 'pack', stock: 0, image: null, description: 'Hot scotch bonnet peppers' },
  { id: 4, name: 'Long Grain Rice', catId: 3, price: 8, unit: '500g', stock: 45, image: null, description: 'Premium white rice' },
  { id: 5, name: 'Free Range Eggs', catId: 6, price: 18, unit: 'dozen', stock: 32, image: null, description: 'Farm fresh eggs' },
  { id: 6, name: 'Organic Mango', catId: 2, price: 15, unit: 'kg', stock: 20, image: null, description: 'Sweet seasonal mangoes' },
  { id: 7, name: 'Chicken Thighs', catId: 7, price: 35, unit: 'kg', stock: 15, image: null, description: 'Fresh boneless thighs' },
  { id: 8, name: 'Ginger', catId: 5, price: 6, unit: 'pack', stock: 60, image: null, description: 'Fresh root, 200g' }
];

export const mockOrders = [
  {
    id: '#PB-4825',
    customer: 'Akosua Mensah',
    phone: '0241112222',
    address: '12 Cantonments Rd',
    items: [
      { name: 'Fresh Tilapia', qty: 1, price: 45 },
      { name: 'Asparagus', qty: 2, price: 12 }
    ],
    subtotal: 69,
    fee: 15,
    status: 'Pending',
    paid: true,
    method: 'MTN MoMo',
    time: '5 min ago'
  },
  {
    id: '#PB-4824',
    customer: 'Kwame Asante',
    phone: '0203334444',
    address: '45 Airport Res.',
    items: [{ name: 'Long Grain Rice', qty: 3, price: 8 }],
    subtotal: 24,
    fee: 12,
    status: 'Packing',
    paid: true,
    method: 'Card',
    time: '18 min ago'
  },
  {
    id: '#PB-4823',
    customer: 'Ama Boateng',
    phone: '0275556666',
    address: '8 Osu Rd',
    items: [
      { name: 'Free Range Eggs', qty: 2, price: 18 },
      { name: 'Ginger', qty: 1, price: 6 }
    ],
    subtotal: 42,
    fee: 10,
    status: 'Delivering',
    paid: true,
    method: 'MTN MoMo',
    time: '35 min ago'
  },
  {
    id: '#PB-4822',
    customer: 'Yaw Darko',
    phone: '0557778888',
    address: '22 Labone St',
    items: [{ name: 'Scotch Bonnet', qty: 2, price: 4 }],
    subtotal: 8,
    fee: 12,
    status: 'Delivered',
    paid: true,
    method: 'Vodafone',
    time: '1 hr ago'
  },
  {
    id: '#PB-4821',
    customer: 'Abena Frimpong',
    phone: '0309990000',
    address: '5 Ring Rd',
    items: [{ name: 'Chicken Thighs', qty: 2, price: 35 }],
    subtotal: 70,
    fee: 18,
    status: 'Delivered',
    paid: true,
    method: 'Card',
    time: '2 hr ago'
  },
  {
    id: '#PB-4820',
    customer: 'Nana Agyei',
    phone: '0241231231',
    address: '17 Tema Rd',
    items: [{ name: 'Organic Mango', qty: 3, price: 15 }],
    subtotal: 45,
    fee: 15,
    status: 'Cancelled',
    paid: false,
    method: 'MTN MoMo',
    time: '3 hr ago'
  }
];

export const mockCustomers = [
  { id: 1, name: 'Akosua Mensah', email: 'akosua@email.com', phone: '0241112222', orders: 14, spent: 842, joined: 'Jan 2024', lastSeen: '2 min ago', status: 'Active' },
  { id: 2, name: 'Kwame Asante', email: 'kwame@email.com', phone: '0203334444', orders: 7, spent: 390, joined: 'Mar 2024', lastSeen: '18 min ago', status: 'Active' },
  { id: 3, name: 'Ama Boateng', email: 'ama@email.com', phone: '0275556666', orders: 22, spent: 1430, joined: 'Nov 2023', lastSeen: '1 hr ago', status: 'Active' },
  { id: 4, name: 'Yaw Darko', email: 'yaw@email.com', phone: '0557778888', orders: 3, spent: 120, joined: 'Feb 2024', lastSeen: '3 days ago', status: 'Inactive' },
  { id: 5, name: 'Abena Frimpong', email: 'abena@email.com', phone: '0309990000', orders: 18, spent: 980, joined: 'Dec 2023', lastSeen: '2 hr ago', status: 'Active' }
];
