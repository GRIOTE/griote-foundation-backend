const express = require('express');
const profileRoutes = require('./src/routes/profile.route');
const sequelize = require('./src/config/db.config');
const logger = require('./src/config/logger');

const app = express();
app.use(express.json());
app.use('/api/profile', profileRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

async function initDb() {
  try {
    console.log('DB: Starting authenticate...');
    await sequelize.authenticate();
    console.log('DB: Authenticate succeeded.');
    
    console.log('DB: Starting sync...');
    await sequelize.sync({ alter: true });
    console.log('DB: Sync succeeded.');

    logger.info('Database connected and synced');
  } catch (error) {
    logger.error('Database connection failed', error);
    throw error;
  }
}

module.exports = { app, initDb };
