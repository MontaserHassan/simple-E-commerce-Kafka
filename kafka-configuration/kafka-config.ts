import { Kafka, Partitioners, EachMessagePayload } from 'kafkajs'

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9093'],
});



export {
    Kafka,
    kafka,
    Partitioners,
    EachMessagePayload
};