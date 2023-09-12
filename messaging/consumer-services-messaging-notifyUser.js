const { kafka } = require('../kafka-common/kafka-config');
const { Notification } = require('../e-commerce-users-services/models/notification.model');
const { User } = require('../e-commerce-users-services/models/users.model');


const consumer = kafka.consumer({ groupId: 'e-commerce-services-group' });

const runConsumerNotify = async () => {
    await consumer.connect().then(() => {
        consumer.subscribe({ topic: 'product_created', fromBeginning: true });
        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const dataFromMessage = JSON.parse(message.value);
                    // message for special user
                    const users = await User.find();
                    for (const user of users) {
                        const notification = new Notification({
                            userId: user._id,
                            message: dataFromMessage.name, // product name
                            read: false
                        });
                        await notification.save();
                    };
                } catch (error) {
                    console.error('Error processing Kafka message:', error);
                };
            },
        });
    }).catch((error) => {
        console.error('Error starting Kafka consumer:', error);
    });
};



module.exports = {
    runConsumerNotify,
};