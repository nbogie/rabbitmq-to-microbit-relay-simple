import { connect } from "amqplib";
import { getEnvironmentVariableOrFail } from "./environmentVariableHelp.js";

export async function setupAMQPConnection(queueName) {
    const exchangeURL = getEnvironmentVariableOrFail("AMQP_EXCHANGE_URL");
    const conn = await connect(exchangeURL);

    const orderChannel = await conn.createChannel();

    //will only create the queue if it doesn't already exist
    await orderChannel.assertQueue(queueName, { durable: false });
    console.log("Connection to channel established: ");
    return orderChannel;
}

export function sendOrderToMQ(orderChannel, queueName, order) {
    const messageText = JSON.stringify(order);
    const msgToSend = Buffer.from(messageText);
    return orderChannel.sendToQueue(queueName, msgToSend);
}
