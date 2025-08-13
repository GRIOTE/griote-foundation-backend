const amqp = require('amqplib');
const logger = require('../config/logger');

let channel = null;
const EXCHANGE = 'user_events';

async function connect(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
      logger.info(`Connecting to RabbitMQ (attempt ${i + 1}/${retries}) with URL: ${url}`);
      const conn = await amqp.connect(url);
      channel = await conn.createChannel();
      await channel.assertExchange(EXCHANGE, 'fanout', { durable: false });
      logger.info('Connected to RabbitMQ');
      return channel;
    } catch (error) {
      logger.error(`RabbitMQ connection failed (attempt ${i + 1}):`, error.message, error.stack);
      if (i < retries - 1) {
        logger.info(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        logger.error('Max retries reached for RabbitMQ connection');
        throw error;
      }
    }
  }
}

function publishUserCreated(payload) {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  const message = Buffer.from(JSON.stringify(payload));
  channel.publish(EXCHANGE, '', message);
  logger.info('Published user.created', payload);
}

module.exports = { connect, publishUserCreated };