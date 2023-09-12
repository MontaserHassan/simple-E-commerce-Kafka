const { kafka } = require('../kafka-common/kafka-config');
const { User } = require('../e-commerce-users-services/models/users.model');
const { Delivery } = require('../e-commerce-users-services/models/delivery.model');
const { Product } = require('../e-commerce-users-services/models/product.model');
const { Notification } = require('../e-commerce-users-services/models/notification.model');


const consumer = kafka.consumer({ groupId: 'e-commerce-services-group' });

const runConsumerSoldProduct = async () => {
    await consumer.connect().then(() => {
        consumer.subscribe({ topic: 'product_sold', fromBeginning: true });
        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const dataFromMessage = JSON.parse(message.value);
                    console.log('dataFromMessage: ', dataFromMessage);
                    if (!dataFromMessage) return 'error in sold operation';
                    const user = await User.findById(dataFromMessage.user);
                    const product = await Product.findById(dataFromMessage.product);
                    const newDelivery = new Delivery({
                        userId: user._id,
                        productName: product.name,
                        received: false
                    });
                    console.log('newDelivery: ', newDelivery);
                    const savedDelivery = await newDelivery.save();
                    if (savedDelivery) {
                        const notification = new Notification({
                            userId: user._id,
                            message: `The order is on its way to you, product: ${product.name}`,
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
    runConsumerSoldProduct,
};