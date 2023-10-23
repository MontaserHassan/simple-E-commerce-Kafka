import { kafka, Partitioners } from '../kafka-config';


const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});



export {
    producer,
};