const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { sequelize, connectWithRetry } = require('./database');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000'],  
  credentials: true 
}));

app.use('/api/auth', authRoutes);

// Route de santé (pour vérifier que le service est vivant)
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth' }));

const PORT = process.env.PORT || 3001;

const start = async () => {
  await connectWithRetry();
  // sync({ alter: true }) = crée ou met à jour les tables automatiquement
  await sequelize.sync({ alter: true });
  console.log('Tables créées/mises à jour');

  app.listen(PORT, () => {
    console.log(`Auth Service démarré sur le port ${PORT}`);
  });
};

start();