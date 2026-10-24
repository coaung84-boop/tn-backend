const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Supabase Connection ချိတ်ဆက်ခြင်း
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Test Route
app.get('/', (req, res) => {
  res.send('T&N Fulfillment Backend API is running successfully!');
});

// 2. GET: Users
app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 3. GET: Inventory / Items
app.get('/api/inventory', async (req, res) => {
  const { data, error } = await supabase.from('items').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.get('/api/items', async (req, res) => {
  const { data, error } = await supabase.from('items').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 5. POST: Item အသစ်ထည့်ရန် (camelCase ကို snake_case သို့ Map လုပ်ခြင်း)
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

// 6. GET: Orders
app.get('/api/orders', async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 7. POST: Order အသစ်ထည့်ရန် (camelCase ကို snake_case သို့ Map လုပ်ခြင်း)
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});