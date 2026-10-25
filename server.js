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

// Users
app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Vendors
app.get('/api/vendors', async (req, res) => {
  const { data, error } = await supabase.from('vendors').select('*');
  if (error) {
    // Fallback if table not created yet
    return res.json([]);
  }
  const formattedVendors = (data || []).map(v => ({
    id: v.id,
    name: v.name,
    phone: v.phone,
    address: v.address,
    bankAccount: v.bank_account || v.bankAccount,
    handlingFee: Number(v.handling_fee) || 500,
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
    handling_fee: v.handlingFee || 500,
    free_storage_days: v.freeStorageDays || 7,
    daily_store_fee: v.dailyStoreFee || 200
  };
  const { data, error } = await supabase.from('vendors').insert([dbVendor]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Vendor added successfully', data });
});

// Inventory / Items
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

app.post('/api/items', async (req, res) => {
  const item = req.body;
  const dbItem = {
    id: item.id,
    vendor_id: item.vendorId,
    name: item.name,
    category: item.category,
    price: item.price,
    cost: item.cost,
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

// Orders
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

  const { data, error } = await supabase
    .from('orders')
    .update(dbOrder)
    .eq('id', orderId);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Order updated successfully', data });
});

// Returns
app.get('/api/returns', async (req, res) => {
  const { data, error } = await supabase.from('returns').select('*');
  if (error) return res.json([]);
  const formattedReturns = (data || []).map(r => ({
    id: r.id,
    orderId: r.order_id,
    itemId: r.item_id,
    vendorId: r.vendor_id,
    itemName: r.item_name,
    qty: Number(r.qty) || 0,
    type: r.type,
    reason: r.reason,
    status: r.status,
    date: r.date
  }));
  res.json(formattedReturns);
});

app.post('/api/returns', async (req, res) => {
  const r = req.body;
  const dbReturn = {
    id: r.id,
    order_id: r.orderId || '',
    item_id: r.itemId || '',
    vendor_id: r.vendorId,
    item_name: r.itemName,
    qty: r.qty,
    type: r.type,
    reason: r.reason,
    status: r.status,
    date: r.date
  };
  const { data, error } = await supabase.from('returns').insert([dbReturn]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Return recorded successfully', data });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});