const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z, ZodError } = require('zod');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Persisted user store
const usersFile = path.join(__dirname, '..', 'users.json');

function loadUsers() {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    const parsed = JSON.parse(data);
    return new Map(Object.entries(parsed));
  } catch (err) {
    return new Map();
  }
}

function saveUsers(map) {
  fs.writeFileSync(usersFile, JSON.stringify(Object.fromEntries(map)));
}

const users = loadUsers();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET must be set');
}

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
    saveUsers(users);
    const token = jwt.sign({ username }, jwtSecret, {
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
    const token = jwt.sign({ username }, jwtSecret, {
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
  saveUsers(users);
}

module.exports = { router, resetUsers };
