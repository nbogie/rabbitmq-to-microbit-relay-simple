import { connect } from "amqplib";
import { getEnvironmentVariableOrFail } from "./environmentVariableHelp.js";
import { orderSchema } from "./orderSchema.js";
import { sendValueToMicrobit } from "./microbitSerial.js";

async function main() {
    const exchangeURL = getEnvironmentVariableOrFail("AMQP_EXCHANGE_URL");
    const queueName = getEnvironmentVariableOrFail("AMQP_QUEUE_NAME");

    const conn = await connect(exchangeURL);

    const channel = await conn.createChannel();
    await channel.assertQueue(queueName, { durable: false });

    // register a listener

    channel.consume(queueName, handleReceivedMQMessageSimplest);

    /**
     *
     * @param {import ("amqplib").ConsumeMessage} msg
     */
    async function handleReceivedMQMessageSimplest(msg) {
        if (msg === null) {
            log("Consumer cancelled by server (got null msg)");
            return;
        }

        const content = msg.content.toString();

        const { error, value } = orderSchema.validate(JSON.parse(content));
        if (error || !value) {
            log(`Bad order message on queue: `, content, error);
            channel.ack(msg);
        } else {
            log(`Received and processed order: `, value);
            await sendValueToMicrobit(value.quantity);
            channel.ack(msg);
        }
    }
}

/** A function that returns a promise that resolves after the given number of milli-seconds.
 * @param {number} timeInMillis
 */
export function delay(timeInMillis) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeInMillis);
    });
}

/** a wrapper around console.log that will always print our process id first */
function log(...args) {
    console.log(process.pid, ...args);
}

main();
