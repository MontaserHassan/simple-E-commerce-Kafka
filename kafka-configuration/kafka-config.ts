import { Kafka, Partitioners } from 'kafkajs'

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9093'],
});


// export {
//     kafka,
//     Partitioners 
// }
module.exports = {
    kafka,
    Partitioners
};