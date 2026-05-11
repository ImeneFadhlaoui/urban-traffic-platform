const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize, connectWithRetry } = require('./database');
const notificationRoutes = require('./routes/notifications');
const notificationController = require('./controllers/notificationController');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true
}));

app.use('/api/notifications', notificationRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'notifications' }));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true
  }
});

notificationController.setIo(io);

io.on('connection', (socket) => {
  console.log(`🔌 Client WebSocket connecté : ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client déconnecté : ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3005;

const start = async () => {
  await connectWithRetry();
  await sequelize.sync({ alter: true });
  console.log('Tables notifications créées');
  httpServer.listen(PORT, () => {
    console.log(`Notification Service démarré sur le port ${PORT}`);
  });
};

start();