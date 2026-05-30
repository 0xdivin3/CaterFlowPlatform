const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

// Serve frontend static files from project root so the API and app are on the same origin
const STATIC_ROOT = path.join(__dirname, '..');
app.use(express.static(STATIC_ROOT));

const DATA_PATH = path.join(__dirname, 'data.json');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

async function readDB() {
  const txt = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(txt);
}

async function writeDB(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/ping', (req, res) => res.json({ ok: true }));

// Friendly root response so visiting / in a browser is informative
app.get('/', (req, res) => res.send('CaterFlow API running — try /api/state'));

// For any non-API route, serve index.html (SPA fallback)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(STATIC_ROOT, 'index.html'));
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`));
