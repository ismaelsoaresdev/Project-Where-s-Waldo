const express = require('express');
const cors = require('cors');
const targetRoutes = require('./routes/targetRoutes');
const scoreRoutes = require('./routes/scoreRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/targets', targetRoutes);
app.use('/api/scores', scoreRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Where's Waldo API is running!" });
});

module.exports = app;