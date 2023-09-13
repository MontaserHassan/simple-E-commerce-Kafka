import { EachMessagePayload, kafka } from '../../kafka-configuration/kafka-config';

import User from '../../e-commerce-services/models/users.model';
import Delivery from '../../e-commerce-services/models/delivery.model';
import Product from '../../e-commerce-services/models/product.model';
import Notification from '../../e-commerce-services/models/notification.model'


const consumer = kafka.consumer({ groupId: 'e-commerce-services-group' });

const runConsumerSoldProduct = async () => {
    await consumer.connect().then(() => {
        consumer.subscribe({ topic: 'product_sold', fromBeginning: true });
        consumer.run({
            eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                try {
                    if (message.value instanceof Buffer) {
                        const messageString = message.value.toString('utf-8');
                        const dataFromMessage = JSON.parse(messageString);
                        const user = await User.findById(dataFromMessage.user);
                        const product = await Product.findById(dataFromMessage.product);
                        const newDelivery = new Delivery({
                            userId: user?._id,
                            productName: product?.name,
                            received: false
                        });
                        const savedDelivery = await newDelivery.save();
                        if (savedDelivery) {
                            const notification = new Notification({
                                userId: user?._id,
                                message: `The order is on its way to you, product: ${product?.name}`,
                                read: false
                            });
                            await notification.save();
                        };
                    } else {
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
    runConsumerSoldProduct,
};