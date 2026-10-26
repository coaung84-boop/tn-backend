const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
  res.send('T&N Fulfillment Backend API is running successfully!');
});

// Users API
app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(400).json({ error: error.message });

  const formattedUsers = (data || []).map(u => ({
    id: u.id,
    username: u.username,
    password: u.password,
    name: u.name,
    role: u.role,
    vendorId: u.vendor_id || ''
  }));

  res.json(formattedUsers);
});

app.post('/api/users', async (req, res) => {
  const u = req.body;
  const dbUser = {
    id: u.id,
    username: u.username,
    password: u.password,
    name: u.name,
    role: u.role,
    vendor_id: u.vendorId || ''
  };

  const { data, error } = await supabase.from('users').insert([dbUser]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'User created successfully', data });
});

app.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const u = req.body;
  const dbUser = {
    username: u.username,
    name: u.name,
    role: u.role,
    vendor_id: u.vendorId || ''
  };
  if (u.password) dbUser.password = u.password;

  const { data, error } = await supabase.from('users').update(dbUser).eq('id', userId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'User updated successfully', data });
});

app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { data, error } = await supabase.from('users').delete().eq('id', userId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'User deleted successfully', data });
});

// Vendors API
app.get('/api/vendors', async (req, res) => {
  const { data, error } = await supabase.from('vendors').select('*');
  if (error) return res.status(400).json({ error: error.message });

  const formattedVendors = (data || []).map(v => ({
    id: v.id,
    name: v.name,
    phone: v.phone,
    address: v.address,
    bankAccount: v.bank_account,
    freeStorageDays: Number(v.free_storage_days) || 7,
    dailyStoreFee: Number(v.daily_store_fee) || 200
  }));

  res.json(formattedVendors);
});

app.post('/api/vendors', async (req, res) => {
  const v = req.body;
  const dbVendor = {
    id: v.id,
    name: v.name,
    phone: v.phone,
    address: v.address,
    bank_account: v.bankAccount,
    free_storage_days: v.freeStorageDays,
    daily_store_fee: v.dailyStoreFee
  };

  const { data, error } = await supabase.from('vendors').insert([dbVendor]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Vendor added successfully', data });
});

// Deliveries API
app.get('/api/deliveries', async (req, res) => {
  const { data, error } = await supabase.from('deliveries').select('*');
  if (error) return res.status(400).json({ error: error.message });

  const formattedDeliveries = (data || []).map(d => ({
    id: d.id,
    name: d.name,
    phone: d.phone,
    address: d.address,
    bankAccount: d.bank_account
  }));

  res.json(formattedDeliveries);
});

app.post('/api/deliveries', async (req, res) => {
  const d = req.body;
  const dbDelivery = {
    id: d.id,
    name: d.name,
    phone: d.phone,
    address: d.address,
    bank_account: d.bankAccount
  };

  const { data, error } = await supabase.from('deliveries').insert([dbDelivery]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Delivery added successfully', data });
});

app.put('/api/deliveries/:id', async (req, res) => {
  const delId = req.params.id;
  const d = req.body;
  const dbDelivery = {
    name: d.name,
    phone: d.phone,
    address: d.address,
    bank_account: d.bankAccount
  };

  const { data, error } = await supabase.from('deliveries').update(dbDelivery).eq('id', delId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Delivery updated successfully', data });
});

app.delete('/api/deliveries/:id', async (req, res) => {
  const delId = req.params.id;
  const { data, error } = await supabase.from('deliveries').delete().eq('id', delId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Delivery deleted successfully', data });
});

// Inventory / Items API
app.get('/api/inventory', async (req, res) => {
  const { data, error } = await supabase.from('items').select('*');
  if (error) return res.status(400).json({ error: error.message });

  const formattedItems = (data || []).map(item => ({
    id: item.id,
    vendorId: item.vendor_id,
    name: item.name,
    category: item.category,
    price: Number(item.price) || 0,
    cost: Number(item.cost) || 0,
    quantity: Number(item.quantity) || 0,
    damagedQty: Number(item.damaged_qty) || 0,
    stockInDate: item.stock_in_date,
    sku: item.sku,
    handlingFee: Number(item.handling_fee) || 0,
    storeChargePerDay: Number(item.store_charge_per_day) || 0,
    freeDays: Number(item.free_days) || 0
  }));

  res.json(formattedItems);
});

app.get('/api/items', async (req, res) => {
  const { data, error } = await supabase.from('items').select('*');
  if (error) return res.status(400).json({ error: error.message });

  const formattedItems = (data || []).map(item => ({
    id: item.id,
    vendorId: item.vendor_id,
    name: item.name,
    category: item.category,
    price: Number(item.price) || 0,
    cost: Number(item.cost) || 0,
    quantity: Number(item.quantity) || 0,
    damagedQty: Number(item.damaged_qty) || 0,
    stockInDate: item.stock_in_date,
    sku: item.sku,
    handlingFee: Number(item.handling_fee) || 0,
    storeChargePerDay: Number(item.store_charge_per_day) || 0,
    freeDays: Number(item.free_days) || 0
  }));

  res.json(formattedItems);
});

app.post('/api/items', async (req, res) => {
  const item = req.body;
  const dbItem = {
    id: item.id,
    vendor_id: item.vendorId,
    name: item.name,
    category: item.category,
    price: item.price,
    cost: 0,
    quantity: item.quantity,
    damaged_qty: item.damagedQty || 0,
    stock_in_date: item.stockInDate,
    sku: item.sku,
    handling_fee: item.handlingFee,
    store_charge_per_day: item.storeChargePerDay,
    free_days: item.freeDays
  };

  const { data, error } = await supabase.from('items').insert([dbItem]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Item added successfully', data });
});

app.put('/api/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const item = req.body;
  const dbItem = {};
  if (item.quantity !== undefined) dbItem.quantity = item.quantity;
  if (item.price !== undefined) dbItem.price = item.price;
  if (item.name !== undefined) dbItem.name = item.name;

  const { data, error } = await supabase
    .from('items')
    .update(dbItem)
    .eq('id', itemId);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Item updated successfully', data });
});

// Orders API
app.get('/api/orders', async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) return res.status(400).json({ error: error.message });

  const formattedOrders = (data || []).map(order => ({
    id: order.id,
    vendorId: order.vendor_id,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    deliveryAddress: order.delivery_address,
    deliveryService: order.delivery_service,
    trackingNo: order.tracking_no,
    status: order.status,
    cancelled: order.cancelled,
    items: order.items || [],
    itemTotal: Number(order.item_total) || 0,
    deliveryFee: Number(order.delivery_fee) || 0,
    totalCod: Number(order.total_cod) || 0,
    tnHandlingFee: Number(order.tn_handling_fee) || 0,
    tnStoreFee: Number(order.tn_store_fee) || 0,
    codCollected: order.cod_collected,
    settlementStatus: order.settlement_status,
    createdAt: order.created_at,
    updatedBy: order.updated_by
  }));

  res.json(formattedOrders);
});

app.post('/api/orders', async (req, res) => {
  const order = req.body;
  const dbOrder = {
    id: order.id,
    vendor_id: order.vendorId,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    delivery_address: order.deliveryAddress,
    delivery_service: order.deliveryService,
    tracking_no: order.trackingNo,
    status: order.status,
    cancelled: order.cancelled,
    items: order.items,
    item_total: order.itemTotal,
    delivery_fee: order.deliveryFee,
    total_cod: order.totalCod,
    tn_handling_fee: order.tnHandlingFee,
    tn_store_fee: order.tnStoreFee,
    cod_collected: order.codCollected,
    settlement_status: order.settlementStatus,
    created_at: order.createdAt,
    updated_by: order.updatedBy
  };

  const { data, error } = await supabase.from('orders').insert([dbOrder]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Order created successfully', data });
});

app.put('/api/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  const order = req.body;
  const dbOrder = {
    status: order.status,
    tracking_no: order.trackingNo,
    cancelled: order.cancelled,
    cod_collected: order.codCollected,
    updated_by: order.updatedBy
  };

  if (order.items !== undefined) dbOrder.items = order.items;
  if (order.itemTotal !== undefined) dbOrder.item_total = order.itemTotal;
  if (order.totalCod !== undefined) dbOrder.total_cod = order.totalCod;

  const { data, error } = await supabase
    .from('orders')
    .update(dbOrder)
    .eq('id', orderId);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Order updated successfully', data });
});

app.delete('/api/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  const { data, error } = await supabase.from('orders').delete().eq('id', orderId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Order deleted successfully', data });
});

// Returns API
app.get('/api/returns', async (req, res) => {
  const { data, error } = await supabase.from('returns').select('*');
  if (error) return res.status(400).json({ error: error.message });

  const formattedReturns = (data || []).map(ret => ({
    id: ret.id,
    orderId: ret.order_id,
    itemId: ret.item_id,
    vendorId: ret.vendor_id,
    itemName: ret.item_name,
    qty: Number(ret.qty) || 0,
    type: ret.type,
    reason: ret.reason,
    status: ret.status,
    date: ret.date
  }));

  res.json(formattedReturns);
});

app.post('/api/returns', async (req, res) => {
  const ret = req.body;
  const dbRet = {
    id: ret.id,
    order_id: ret.orderId || '',
    item_id: ret.itemId || '',
    vendor_id: ret.vendorId,
    item_name: ret.itemName,
    qty: ret.qty,
    type: ret.type,
    reason: ret.reason,
    status: ret.status,
    date: ret.date
  };

  const { data, error } = await supabase.from('returns').insert([dbRet]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Return recorded successfully', data });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});