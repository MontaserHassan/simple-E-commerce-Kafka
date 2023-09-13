import { producer } from '../../messaging/producer/producer';

// --------------------------------------------- create event ---------------------------------------------


async function publishEvent(topic: string, eventMessage: Record<string, any>): Promise<void> {
    try {
        await producer.connect();
        const result = {
            topic: topic,
            messages: [{ value: JSON.stringify(eventMessage) }]
        };
        await producer.send(result);
    } catch (error) {
        console.error(`Error publishing ${topic} event:`, error.message);
        // middleware
    } finally {
        await producer.disconnect();
    };
};


export {
    publishEvent
};