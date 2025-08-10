require('dotenv').config();

const { app, initDb } = require('./app');
const logger = require('./src/config/logger');
const rabbit = require('./src/events/rabbitmq.publisher');
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    console.log('Step 1: Init DB...');
    await initDb();
    console.log('Step 2: Connect RabbitMQ...');
    await rabbit.connect();
    console.log('Step 3: Start server...');
    app.listen(PORT, () => logger.info(`Auth service listening on ${PORT}`));
  } catch (err) {
    logger.error('Startup error:', err);
    process.exit(1); // Quitte avec erreur si DB ou Rabbit échoue
  }
})();
