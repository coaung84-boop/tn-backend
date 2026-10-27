const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Clean Slate Initial Data Stores (No Sample Data)
let usersList = [
  { id: 'USR-001', username: "admin", password: "admin123", name: "System Admin", role: "Admin", vendorId: "" },
  { id: 'USR-002', username: "staff", password: "staff123", name: "Operations Staff", role: "Staff", vendorId: "" },
];

let vendors = [];

let deliveries = [
  { id: 'DEL-101', name: 'Royal Express', phone: '095000111', address: 'Yangon Main Hub', bankAccount: 'KBZPay: 095000111 (Royal)' },
  { id: 'DEL-102', name: 'Ninja Van', phone: '096000222', address: 'Mandalay Hub', bankAccount: 'KBZPay: 096000222 (Ninja)' },
];

let inventory = [];
let orders = [];
let returns = [];
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