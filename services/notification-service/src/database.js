const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: { max: 5, min: 0, acquire: 60000, idle: 10000 }
  }
);

const connectWithRetry = async (retries = 10) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('Connecté à MySQL (db_notifications)');
      return;
    } catch {
      console.log(`Tentative ${i + 1}/${retries}...`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }
  throw new Error('Impossible de se connecter à MySQL');
};

module.exports = { sequelize, connectWithRetry };