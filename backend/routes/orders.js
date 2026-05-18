import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  const { items, customer, shippingAddress, paymentMethod, totalAmount } = req.body;
  if (!items?.length || !customer || !shippingAddress) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const order = {
    id: uuidv4(),
    orderNumber: `ORD-${Date.now()}`,
    items,
    customer,
    shippingAddress,
    paymentMethod,
    totalAmount,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.orders.push(order);
  res.status(201).json(order);
});

// Get order by ID
router.get('/:id', (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Admin: Get all orders
router.get('/', protect, adminOnly, (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  let orders = [...db.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (status) orders = orders.filter(o => o.status === status);
  const total = orders.length;
  const paginated = orders.slice((page - 1) * limit, page * limit);
  res.json({ orders: paginated, total });
});

// Admin: Update order status
router.put('/:id/status', protect, adminOnly, (req, res) => {
  const idx = db.orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  db.orders[idx].status = req.body.status;
  db.orders[idx].updatedAt = new Date().toISOString();
  res.json(db.orders[idx]);
});

export default router;
