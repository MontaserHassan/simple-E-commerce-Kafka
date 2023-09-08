const { kafka, Partitioners } = require('../kafka-common/kafka-config');

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});

module.exports = {
    producer
};