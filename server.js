const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Supabase Connection ချိတ်ဆက်ခြင်း (.env ထဲက URL နဲ့ Key ကို ယူသုံးပါမည်)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Test Route (Server အလုပ်လုပ်မလုပ် စစ်ရန်)
app.get('/', (req, res) => {
  res.send('T&N Fulfillment Backend API is running successfully!');
});

// 2. GET: Users အားလုံးကို ယူရန်
app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 3. GET: Items (Stock) အားလုံးကို ယူရန်
app.get('/api/items', async (req, res) => {
  const { data, error } = await supabase.from('items').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 4. POST: Item အသစ်ထည့်ရန် (Add Stock)
app.post('/api/items', async (req, res) => {
  const newItem = req.body;
  const { data, error } = await supabase.from('items').insert([newItem]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Item added successfully', data });
});

// 5. GET: Orders အားလုံးကို ယူရန်
app.get('/api/orders', async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 6. POST: Order အသစ်ထည့်ရန် (New Order)
app.post('/api/orders', async (req, res) => {
  const newOrder = req.body;
  const { data, error } = await supabase.from('orders').insert([newOrder]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Order created successfully', data });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});