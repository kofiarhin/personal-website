const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z, ZodError } = require('zod');

const router = express.Router();

// In-memory user store
const users = new Map();

const credentialsSchema = z.object({
  username: z.string().min(1, 'username required'),
  password: z.string().min(6, 'password must be at least 6 characters'),
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = credentialsSchema.parse(req.body);
    if (users.has(username)) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    users.set(username, { username, passwordHash: hash });
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });
    return res.status(201).json({ token });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = credentialsSchema.parse(req.body);
    const user = users.get(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });
    return res.json({ token });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

function resetUsers() {
  users.clear();
}

module.exports = { router, resetUsers };
