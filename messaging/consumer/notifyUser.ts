import { EachMessagePayload, kafka } from '../../kafka-configuration/kafka-config';

import Notification from '../../e-commerce-services/models/notification.model'
import User from '../../e-commerce-services/models/users.model'


const consumer = kafka.consumer({ groupId: 'e-commerce-services-group' });

const runConsumerNotify = async (): Promise<void> => {
    await consumer.connect().then(() => {
        consumer.subscribe({ topic: 'product_created', fromBeginning: true });
        consumer.run({
            eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                try {
                    if (message.value instanceof Buffer) {
                        const messageString = message.value.toString('utf-8');
                        const dataFromMessage = JSON.parse(messageString);
                        const users = await User.find();
                        const notifications = users.map((user) => ({
                            userId: user._id,
                            message: `A new product: ${dataFromMessage.name} has been added to our collection, check now`,
                            read: false,
                        }));
                        await Notification.insertMany(notifications);
                    } else {
                        // Handle the case when message.value is not a Buffer
                        console.error('Invalid message format. Expected a Buffer.');
                    }
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



export {
    runConsumerNotify,
};