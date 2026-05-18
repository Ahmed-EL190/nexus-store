import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';

const router = express.Router();

const signToken = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role, name: user.name },
  process.env.JWT_SECRET || 'secret',
  { expiresIn: '7d' }
);

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email, password: hashed, role: 'customer', createdAt: new Date().toISOString() };
  db.users.push(user);
  res.status(201).json({ token: signToken(user), user: { id: user.id, name, email, role: user.role } });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: signToken(user), user: { id: user.id, name: user.name, email, role: user.role } });
});

export default router;
