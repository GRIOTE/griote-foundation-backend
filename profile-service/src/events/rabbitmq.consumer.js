const amqp = require('amqplib');
const profileService = require('../services/profile.service');
const logger = require('../config/logger');

async function startConsumer() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    const queue = 'user.events';
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const event = JSON.parse(msg.content.toString());
          logger.info(`Received event: ${event.type}`);

          switch (event.type) {
            case 'USER_CREATED':
              await profileService.createProfile(event.data.id, {});
              logger.info(`Profile created for userId: ${event.data.id}`);
              break;

            case 'USER_UPDATED':
              await profileService.updateProfile(event.data.id, event.data);
              logger.info(`Profile updated for userId: ${event.data.id}`);
              break;

            default:
              logger.warn(`Unhandled event type: ${event.type}`);
          }

          channel.ack(msg);
        } catch (error) {
          logger.error('Error processing message:', error);
          channel.nack(msg, false, false);
        }
      }
    });

    logger.info('RabbitMQ consumer started on queue user.events');
  } catch (err) {
    logger.error('RabbitMQ consumer error:', err);
  }
}

module.exports = { startConsumer };
