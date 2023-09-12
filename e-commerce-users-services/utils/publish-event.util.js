const { producer } = require("../../messaging/producer/producer");


// --------------------------------------------- create user event ---------------------------------------------


async function publishUserEvent(topic, eventMessage) {
    try {
        await producer.connect();
        const result = {
            topic: topic,
            messages: [{ value: JSON.stringify(eventMessage) }]
        };
        await producer.send(result);
    } catch (error) {
        console.error(`Error publishing ${topic} event:`, error.message);
    } finally {
        await producer.disconnect();
    };
};



module.exports = {
    publishUserEvent
};