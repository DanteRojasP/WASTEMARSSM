const express = require('express');
const cors = require('cors');
const path = require('path');
const { nanoid } = require('nanoid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// db setup (lowdb v1)
const file = path.join(__dirname, 'data', 'db.json');
const adapter = new FileSync(file);
const db = low(adapter);

// inicializa estructura si no existe
db.defaults({ wastes: [], users: [], inventory: [], scores: [] }).write();

// seed inicial
if (db.get('wastes').value().length === 0) {
  db.get('wastes')
    .push(
      { id: nanoid(), name: "Envase plástico", type: "Plástico", percentage: 35, description: "Botellas y envases plásticos", recycling: ["Reciclado mecánico", "Upcycle"] },
      { id: nanoid(), name: "Lata de aluminio", type: "Metal", percentage: 10, description: "Latas y piezas metálicas", recycling: ["Reciclado", "Fundición"] },
      { id: nanoid(), name: "Restos orgánicos", type: "Orgánico", percentage: 30, description: "Residuos biodegradables", recycling: ["Compost"] },
      { id: nanoid(), name: "Vidrio", type: "Vidrio", percentage: 15, description: "Botellas y frascos", recycling: ["Reciclado"] }
    )
    .write();
  console.log("DB seeded");
}

// API: listar wastes
app.get('/api/waste', (req, res) => {
  res.json(db.get('wastes').value());
});

// API: obtener por id
app.get('/api/waste/:id', (req, res) => {
  const w = db.get('wastes').find({ id: req.params.id }).value();
  if (!w) return res.status(404).json({ error: "Not found" });
  res.json(w);
});

// crear waste
app.post('/api/waste', (req, res) => {
  const newW = { id: nanoid(), ...req.body };
  db.get('wastes').push(newW).write();
  res.json(newW);
});

// recoger item
app.post('/api/collect', (req, res) => {
  const { userName = "anon", wasteId, qty = 1 } = req.body;
  const invKey = `${userName}:${wasteId}`;

  const inv = db.get('inventory').find({ key: invKey }).value();
  if (inv) {
    db.get('inventory').find({ key: invKey }).assign({ qty: inv.qty + qty }).write();
  } else {
    db.get('inventory').push({ id: nanoid(), key: invKey, userName, wasteId, qty }).write();
  }

  // puntuación
  const pts = qty;
  const userScore = db.get('scores').find({ userName }).value();
  if (userScore) {
    db.get('scores').find({ userName }).assign({ score: userScore.score + pts }).write();
  } else {
    db.get('scores').push({ id: nanoid(), userName, score: pts }).write();
  }

  res.json({ ok: true });
});

// leaderboard
app.get('/api/leaderboard', (req, res) => {
  const sorted = db.get('scores').sortBy('score').reverse().value();
  res.json(sorted);
});

// post score manual
app.post('/api/score', (req, res) => {
  const { userName = "anon", score = 0 } = req.body;
  db.get('scores').push({ id: nanoid(), userName, score }).write();
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
