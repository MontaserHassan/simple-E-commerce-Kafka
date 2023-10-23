import { Kafka, Partitioners, EachMessagePayload } from 'kafkajs'

const kafka = new Kafka({
    clientId: 'E-commerce-kafka',
    brokers: ['localhost:9093'],
});



export {
    Kafka,
    kafka,
    Partitioners,
    EachMessagePayload
};