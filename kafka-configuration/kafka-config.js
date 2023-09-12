const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9093'],
});



module.exports = {
    kafka,
    Partitioners
};