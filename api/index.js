const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Use /tmp for Vercel (ephemeral storage) or fallback to api/data.json
const DATA_PATH = process.env.NODE_ENV === 'production' 
  ? '/tmp/data.json' 
  : path.join(__dirname, 'data.json');

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

async function readDB() {
  try {
    const txt = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(txt);
  } catch (err) {
    return { bookings: [], staff: [], notifications: [], packages: [], menu: {} };
  }
}

async function writeDB(data) {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write DB:', err);
  }
}

app.get('/api/ping', (req, res) => res.json({ ok: true }));

app.get('/api/state', async (req, res) => {
  const db = await readDB();
  res.json(db);
});

['bookings', 'staff', 'notifications'].forEach(resource => {
  app.get(`/api/${resource}`, async (req, res) => {
    const db = await readDB();
    res.json(db[resource] || []);
  });

  app.post(`/api/${resource}`, async (req, res) => {
    const db = await readDB();
    const list = db[resource] || [];
    const item = { ...req.body, id: req.body.id || Date.now() };
    list.push(item);
    db[resource] = list;
    await writeDB(db);
    res.json(item);
  });

  app.put(`/api/${resource}/:id`, async (req, res) => {
    const id = req.params.id;
    const db = await readDB();
    const list = db[resource] || [];
    const idx = list.findIndex(i => String(i.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    list[idx] = { ...list[idx], ...req.body };
    db[resource] = list;
    await writeDB(db);
    res.json(list[idx]);
  });

  app.delete(`/api/${resource}/:id`, async (req, res) => {
    const id = req.params.id;
    const db = await readDB();
    db[resource] = (db[resource] || []).filter(i => String(i.id) !== String(id));
    await writeDB(db);
    res.json({ ok: true });
  });
});

app.get('/api/packages', async (req, res) => {
  const db = await readDB();
  res.json(db.packages || []);
});

app.get('/api/menu', async (req, res) => {
  const db = await readDB();
  res.json(db.menu || {});
});

// SPA fallback for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

module.exports = app;