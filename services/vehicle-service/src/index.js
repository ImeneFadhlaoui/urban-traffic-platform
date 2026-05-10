const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { sequelize, connectWithRetry } = require('./database');
const vehicleRoutes = require('./routes/vehicles');

require('./models/GpsPosition');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true
}));

app.use('/api/vehicles', vehicleRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'vehicles' }));

const PORT = process.env.PORT || 3002;

const start = async () => {
  await connectWithRetry();
  await sequelize.sync({ alter: true });
  console.log('Tables vehicles créées');
  app.listen(PORT, () => console.log(`Vehicle Service démarré sur le port ${PORT}`));
};

start();