const { kafka } = require('../kafka-common/kafka-config');
const { User } = require('../e-commerce-users-services/models/users.model');


const consumer = kafka.consumer({ groupId: 'e-commerce-services-group' });

const runConsumerSoldProduct = async () => {
    await consumer.connect().then(() => {
        consumer.subscribe({ topic: 'product_sold', fromBeginning: true });
        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const dataFromMessage = JSON.parse(message.value);
                    const user = await User.findById();
                    const newDelivery = new Delivery({
                        userId: user._id,
                        productName: dataFromMessage.name,
                        received: false
                    });
                    await newDelivery.save();
                } catch (error) {
                    console.error('Error processing Kafka message:', error);
                }
            },
        });
    }).catch((error) => {
        console.error('Error starting Kafka consumer:', error);
    });

};


runConsumerSoldProduct();