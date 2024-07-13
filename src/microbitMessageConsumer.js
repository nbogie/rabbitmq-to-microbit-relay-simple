import { connect } from "amqplib";
import { getEnvironmentVariableOrFail } from "./environmentVariableHelp.js";
import { microbitMessageSchema } from "./microbitMessageSchema.js";
import { drainOutput, sendStringToMicrobit } from "./microbitSerial.js";

async function main() {
    const exchangeURL = getEnvironmentVariableOrFail("AMQP_EXCHANGE_URL");
    const queueName = getEnvironmentVariableOrFail("AMQP_QUEUE_NAME");

    const conn = await connect(exchangeURL);

    const channel = await conn.createChannel();
    await channel.assertQueue(queueName, { durable: false });

    console.log("purging queue: " + queueName);
    channel.purgeQueue(queueName);

    // register a listener

    console.log("draining previous microbit output");

    await drainOutput();
    console.log("microbit output ready");
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

        const { error, value } = microbitMessageSchema.validate(
            JSON.parse(content)
        );
        if (error || !value) {
            log(`Bad order message on queue: `, content, error);
            channel.ack(msg);
        } else {
            log(`Received message: `, value);
            if (value.servoValue !== undefined) {
                await sendStringToMicrobit(35 + ":" + value.servoValue);
            }
            if (value.lightValue !== undefined) {
                await sendStringToMicrobit(21 + ":" + value.lightValue);
            }
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
