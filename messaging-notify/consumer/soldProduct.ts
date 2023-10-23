import { EachMessagePayload, kafka } from '../../kafka-configuration/kafka-config';

import Delivery from '../models/delivery.model';
import Notification from '../models/notification.model'


const consumer = kafka.consumer({ groupId: 'e-commerce-services-group' });
let isConsumerRunning = false;


const runConsumerSoldProduct = async () => {
    if (isConsumerRunning) {
        console.log('Consumer is already running');
        return;
    }
    try {
        await consumer.connect().then(() => {
            consumer.subscribe({ topic: 'product_sold', fromBeginning: true });
            consumer.run({
                eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                    try {
                        if (message.value instanceof Buffer) {
                            const messageString = message.value.toString('utf-8');
                            const dataFromMessage = JSON.parse(messageString);
                            console.log('dataFromMessage: ', dataFromMessage);
                            const newDelivery = new Delivery({
                                userId: dataFromMessage.user?._id,
                                productName: dataFromMessage.product?.name,
                                received: false
                            });
                            const savedDelivery = await newDelivery.save();
                            if (savedDelivery) {
                                const notification = new Notification({
                                    userId: dataFromMessage.user?._id,
                                    message: `The order is on its way to you, product: ${dataFromMessage.product?.name}`,
                                    read: false
                                });
                                await notification.save();
                            };
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



runConsumerSoldProduct();