const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { sequelize, connectWithRetry } = require('./database');
const incidentRoutes = require('./routes/incidents');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:4000'], credentials: true }));

app.use('/api/incidents', incidentRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'incidents' }));

const PORT = process.env.PORT || 3004;

const start = async () => {
  await connectWithRetry();
  await sequelize.sync({ alter: true });
  console.log('Tables incidents créées');
  app.listen(PORT, () => console.log(`Incident Service démarré sur le port ${PORT}`));
};

start();