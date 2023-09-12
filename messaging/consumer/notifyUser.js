const { kafka } = require('../../kafka-configuration/kafka-config');
const { Notification } = require('../../e-commerce-services/models/notification.model');
const { User } = require('../../e-commerce-services/models/users.model');


const consumer = kafka.consumer({ groupId: 'e-commerce-services-group' });

const runConsumerNotify = async () => {
    await consumer.connect().then(() => {
        consumer.subscribe({ topic: 'product_created', fromBeginning: true });
        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const dataFromMessage = JSON.parse(message.value);
                    const users = await User.find();
                    const notifications = users.map((user) => ({
                        userId: user._id,
                        message: `A new product: ${dataFromMessage.name} has been added to our collection, check now`,
                        read: false,
                    }));
                    await Notification.insertMany(notifications);
                } catch (error) {
                    console.error('Error processing Kafka message:', error);
                    // middleware
                };
            },
        });
    }).catch((error) => {
        console.error('Error starting Kafka consumer:', error);
        // middleware
    });
};



module.exports = {
    runConsumerNotify,
};