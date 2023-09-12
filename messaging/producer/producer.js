const { kafka, Partitioners } = require('../../kafka-configuration/kafka-config');

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});

module.exports = {
    producer
};