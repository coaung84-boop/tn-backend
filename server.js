const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory initial data stores matching App.tsx
let usersList = [
  { id: 'USR-001', username: "admin", password: "admin123", name: "System Admin", role: "Admin", vendorId: "" },
  { id: 'USR-002', username: "staff", password: "staff123", name: "Operations Staff", role: "Staff", vendorId: "" },
  { id: 'USR-003', username: "vendor_a", password: "vendor123", name: "Aung Cosmetic Shop", role: "Vendor", vendorId: "VND-101" },
  { id: 'USR-004', username: "vendor_b", password: "vendor123", name: "Trendy Fashion Hub", role: "Vendor", vendorId: "VND-102" },
];

let vendors = [
  { id: 'VND-101', name: 'Aung Cosmetic Shop', phone: '09250001122', address: 'Kamayut, Yangon', bankAccount: 'KBZ Pay: 09250001122 (U Aung)', freeStorageDays: 7, dailyStoreFee: 200 },
  { id: 'VND-102', name: 'Trendy Fashion Hub', phone: '09450003344', address: 'Mandalay', bankAccount: 'AYA Bank: 00123456789 (Daw Mya)', freeStorageDays: 5, dailyStoreFee: 300 },
];

let deliveries = [
  { id: 'DEL-101', name: 'Royal Express', phone: '095000111', address: 'Yangon Main Hub', bankAccount: 'KBZPay: 095000111 (Royal)' },
  { id: 'DEL-102', name: 'Ninja Van', phone: '096000222', address: 'Mandalay Hub', bankAccount: 'KBZPay: 096000222 (Ninja)' },
  { id: 'DEL-103', name: 'Britium Express', phone: '097000333', address: 'Naypyitaw Hub', bankAccount: 'KBZPay: 097000333 (Britium)' },
];

let inventory = [
  { id: 'ITM-001', vendorId: 'VND-101', name: 'Matte Lipstick (Red)', category: 'Beauty', price: 12000, cost: 0, quantity: 45, damagedQty: 2, stockInDate: '2026-10-01', sku: 'SKU-VND-A001', handlingFee: 500, storeChargePerDay: 50, freeDays: 7 },
  { id: 'ITM-002', vendorId: 'VND-101', name: 'Hydrating Serum 50ml', category: 'Skincare', price: 28000, cost: 0, quantity: 18, damagedQty: 0, stockInDate: '2026-09-15', sku: 'SKU-VND-A002', handlingFee: 500, storeChargePerDay: 50, freeDays: 7 },
  { id: 'ITM-003', vendorId: 'VND-102', name: 'Oversized Cotton Tee', category: 'Apparel', price: 18000, cost: 0, quantity: 30, damagedQty: 1, stockInDate: '2026-10-10', sku: 'SKU-VND-B001', handlingFee: 600, storeChargePerDay: 60, freeDays: 5 },
];

let orders = [
  {
    id: 'TN-ORD-8801',
    vendorId: 'VND-101',
    customerName: 'Daw Mya Mya',
    customerPhone: '09790001234',
    deliveryAddress: 'No. 45, Pyay Road, Mayangone, Yangon',
    deliveryService: 'Royal Express',
    trackingNo: 'REX-998234',
    status: 'Delivered',
    cancelled: false,
    items: [{ itemId: 'ITM-001', name: 'Matte Lipstick (Red)', qty: 2, price: 12000, discount: 1000, status: 'Delivered' }],
    itemTotal: 23000,
    deliveryFee: 0,
    totalCod: 23000,
    tnHandlingFee: 500,
    tnStoreFee: 0,
    codCollected: true,
    settlementStatus: 'Settled',
    createdAt: '2026-10-18 10:30 AM',
    updatedBy: 'Staff_Aung'
  },
  {
    id: 'TN-ORD-8802',
    vendorId: 'VND-102',
    customerName: 'U Kyaw Swar',
    customerPhone: '09960005678',
    deliveryAddress: '78th St, Mandalay',
    deliveryService: 'Ninja Van',
    trackingNo: 'NV-334112',
    status: 'In-Transit',
    cancelled: false,
    items: [{ itemId: 'ITM-003', name: 'Oversized Cotton Tee', qty: 1, price: 18000, discount: 0, status: 'Pending' }],
    itemTotal: 18000,
    deliveryFee: 0,
    totalCod: 18000,
    tnHandlingFee: 600,
    tnStoreFee: 600,
    codCollected: false,
    settlementStatus: 'Pending',
    createdAt: '2026-10-21 02:15 PM',
    updatedBy: 'Staff_Su'
  }
];

let returns = [
  { id: 'RET-001', orderId: 'TN-ORD-8800', vendorId: 'VND-101', itemName: 'Hydrating Serum', qty: 1, type: 'Delivery Return', reason: 'Customer Refused', status: 'In Warehouse', date: '2026-10-19' },
  { id: 'RET-002', itemId: 'ITM-001', vendorId: 'VND-101', itemName: 'Matte Lipstick (Red)', qty: 2, type: 'Vendor Return (Damage)', reason: 'Expired packaging', status: 'Returned to Vendor', date: '2026-10-20' }
];

let cashLedger = [];
let notifications = [];

// --- API Endpoints ---

// 1. Users
app.get('/api/users', (req, res) => res.json(usersList));
app.post('/api/users', (req, res) => {
  usersList.push(req.body);
  res.status(201).json(req.body);
});
app.put('/api/users/:id', (req, res) => {
  usersList = usersList.map(u => u.id === req.params.id ? { ...u, ...req.body } : u);
  res.json({ success: true });
});
app.delete('/api/users/:id', (req, res) => {
  usersList = usersList.filter(u => u.id !== req.params.id);
  res.json({ success: true });
});

// 2. Vendors
app.get('/api/vendors', (req, res) => res.json(vendors));
app.post('/api/vendors', (req, res) => {
  vendors.push(req.body);
  res.status(201).json(req.body);
});
app.put('/api/vendors/:id', (req, res) => {
  vendors = vendors.map(v => v.id === req.params.id ? { ...v, ...req.body } : v);
  res.json({ success: true });
});
app.delete('/api/vendors/:id', (req, res) => {
  vendors = vendors.filter(v => v.id !== req.params.id);
  res.json({ success: true });
});

// 3. Deliveries
app.get('/api/deliveries', (req, res) => res.json(deliveries));
app.post('/api/deliveries', (req, res) => {
  deliveries.push(req.body);
  res.status(201).json(req.body);
});
app.put('/api/deliveries/:id', (req, res) => {
  deliveries = deliveries.map(d => d.id === req.params.id ? { ...d, ...req.body } : d);
  res.json({ success: true });
});
app.delete('/api/deliveries/:id', (req, res) => {
  deliveries = deliveries.filter(d => d.id !== req.params.id);
  res.json({ success: true });
});

// 4. Inventory / Items
app.get('/api/inventory', (req, res) => res.json(inventory));
app.post('/api/inventory', (req, res) => {
  inventory.push(req.body);
  res.status(201).json(req.body);
});
app.post('/api/items', (req, res) => {
  inventory.unshift(req.body);
  res.status(201).json(req.body);
});
app.put('/api/items/:id', (req, res) => {
  inventory = inventory.map(i => i.id === req.params.id ? { ...i, ...req.body } : i);
  res.json({ success: true });
});

// 5. Orders
app.get('/api/orders', (req, res) => res.json(orders));
app.post('/api/orders', (req, res) => {
  orders.unshift(req.body);
  res.status(201).json(req.body);
});
app.put('/api/orders/:id', (req, res) => {
  orders = orders.map(o => o.id === req.params.id ? { ...o, ...req.body } : o);
  res.json({ success: true });
});
app.delete('/api/orders/:id', (req, res) => {
  orders = orders.filter(o => o.id !== req.params.id);
  res.json({ success: true });
});

// 6. Returns
app.get('/api/returns', (req, res) => res.json(returns));
app.post('/api/returns', (req, res) => {
  returns.unshift(req.body);
  res.status(201).json(req.body);
});

// 7. Cash Ledger (Cash Management)
app.get('/api/cash-ledger', (req, res) => res.json(cashLedger));
app.post('/api/cash-ledger', (req, res) => {
  cashLedger.unshift(req.body);
  res.status(201).json(req.body);
});

// 8. Notifications
app.get('/api/notifications', (req, res) => res.json(notifications));
app.post('/api/notifications', (req, res) => {
  notifications.unshift(req.body);
  res.status(201).json(req.body);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`T&N Backend Server running on port ${PORT}`));