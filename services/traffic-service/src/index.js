const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { sequelize, connectWithRetry } = require('./database');
const trafficRoutes = require('./routes/traffic');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:4000'], credentials: true }));

app.use('/api/traffic', trafficRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'traffic' }));

const PORT = process.env.PORT || 3003;

const start = async () => {
  await connectWithRetry();
  await sequelize.sync({ alter: true });
  console.log('Tables traffic créées');
  app.listen(PORT, () => console.log(`Traffic Service démarré sur le port ${PORT}`));
};

start();