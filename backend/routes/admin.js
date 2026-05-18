import express from 'express';
import { db } from '../config/db.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

// Dashboard stats
router.get('/stats', (req, res) => {
  const totalRevenue = db.orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = db.orders.filter(o => new Date(o.createdAt) >= today).length;

  const statusCounts = db.orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // Revenue last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayOrders = db.orders.filter(o => {
      const od = new Date(o.createdAt);
      return od.toDateString() === d.toDateString() && o.paymentStatus === 'paid';
    });
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: dayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0),
      orders: dayOrders.length
    };
  });

  res.json({
    totalRevenue,
    totalOrders: db.orders.length,
    totalProducts: db.products.length,
    totalCustomers: db.users.filter(u => u.role === 'customer').length,
    todayOrders,
    statusCounts,
    revenueChart: last7,
    topProducts: db.products.sort((a, b) => b.reviews - a.reviews).slice(0, 5)
  });
});

// Get all customers
router.get('/customers', (req, res) => {
  const customers = db.users
    .filter(u => u.role === 'customer')
    .map(({ password, ...u }) => u);
  res.json(customers);
});

export default router;
