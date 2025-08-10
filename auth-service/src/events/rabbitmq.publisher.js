const amqp = require('amqplib');
const logger = require('../config/logger');

let channel = null;
const EXCHANGE = 'user_events';

async function connect() {
  const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
  const conn = await amqp.connect(url);
  channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE, 'fanout', { durable: false });
  logger.info('Connected to RabbitMQ');
}

function publishUserCreated(payload) {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  const message = Buffer.from(JSON.stringify(payload));
  channel.publish(EXCHANGE, '', message);
  logger.info('Published user.created', payload);
}

module.exports = { connect, publishUserCreated };
