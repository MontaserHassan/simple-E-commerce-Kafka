const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9093']
});



// console.log(kafka);
// console.log('------------------------------------------------------------------------\n');
// console.log('Kafka configuration:', kafka.config);
// console.log('------------------------------------------------------------------------\n');
// console.log('Kafka brokers:', kafka.brokers);
// console.log('------------------------------------------------------------------------\n');



module.exports = {
    kafka
};