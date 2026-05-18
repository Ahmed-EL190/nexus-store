import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET all products with filters
router.get('/', (req, res) => {
  let { category, gender, search, featured, sort, page = 1, limit = 12 } = req.query;
  let products = [...db.products];

  if (category) products = products.filter(p => p.category === category);
  if (gender) products = products.filter(p => p.gender === gender);
  if (featured === 'true') products = products.filter(p => p.featured);
  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(s) || p.nameAr.includes(s) || p.category.includes(s)
    );
  }
  if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);
  if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);
  if (sort === 'newest') products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = products.length;
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + parseInt(limit));

  res.json({ products: paginated, total, page: parseInt(page), pages: Math.ceil(total / limit) });
});

// GET single product
router.get('/:id', (req, res) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// CREATE product (admin)
router.post('/', protect, adminOnly, (req, res) => {
  const product = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
  db.products.push(product);
  res.status(201).json(product);
});

// UPDATE product (admin)
router.put('/:id', protect, adminOnly, (req, res) => {
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.products[idx] = { ...db.products[idx], ...req.body };
  res.json(db.products[idx]);
});

// DELETE product (admin)
router.delete('/:id', protect, adminOnly, (req, res) => {
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.products.splice(idx, 1);
  res.json({ message: 'Deleted' });
});

export default router;
