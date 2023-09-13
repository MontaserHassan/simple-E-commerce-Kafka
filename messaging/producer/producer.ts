import { kafka, Partitioners } from '../../kafka-configuration/kafka-config';


const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});



export {
    producer,
};