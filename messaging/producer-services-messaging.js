const { kafka } = require('../kafka-common/kafka-config');


const producer = kafka.producer();



module.exports = {
    producer
};