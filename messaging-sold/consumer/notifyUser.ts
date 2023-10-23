import { EachMessagePayload, kafka } from '../../kafka-configuration/kafka-config';

import Notification from '../models/notification.model';


const consumer = kafka.consumer({ groupId: 'e-commerce-services-notifyUser' });
let isConsumerRunning = false;


const runConsumerNotify = async (): Promise<void> => {
    if (isConsumerRunning) {
        console.log('Consumer is already running');
        return;
    };
    try {
        await consumer.connect().then(() => {
            consumer.subscribe({ topic: 'product_created', fromBeginning: true });
            consumer.run({
                eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                    try {
                        if (message.value instanceof Buffer) {
                            const messageString = message.value.toString('utf-8');
                            const dataFromMessage = JSON.parse(messageString);
                            console.log('dataFromMessage2: ', dataFromMessage)
                            const notifications = dataFromMessage.users.map((user) => ({
                                userId: user._id,
                                message: `A new product: ${dataFromMessage.name} has been added to our collection, check now`,
                                read: false,
                            }));
                            await Notification.insertMany(notifications);
                        } else {
                            console.error('Invalid message format. Expected a Buffer.');
                        }
                    } catch (error) {
                        console.error('Error processing Kafka message:', error);
                    };
                },
            });
        });
        isConsumerRunning = true;
    } catch (error) {
        console.error('Error starting Kafka consumer:', error);
    };
};



runConsumerNotify();