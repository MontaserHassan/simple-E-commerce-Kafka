const { kafka } = require('../kafka-common/kafka-config');


const consumer = kafka.consumer({ groupId: 'e-commerce-services-group' });

const runConsumer = async () => {
    await consumer.connect();
    // user 
    await consumer.subscribe({ topic: 'user_created', fromBeginning: true });
    await consumer.subscribe({ topic: 'user_logged', fromBeginning: true });
    await consumer.subscribe({ topic: 'user_details', fromBeginning: true });
    await consumer.subscribe({ topic: 'user_updated', fromBeginning: true });
    await consumer.subscribe({ topic: 'user_updated_password', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message that has topic --> ${topic} and message --> ${message.value}`);
        },
    });
};
runConsumer().catch(error => {
    console.error('Consumer error:', error);
});


runConsumer();