//@ts-check
import { SerialPort } from "serialport";
console.log("started");
import { getEnvironmentVariableOrFail } from "./environmentVariableHelp.js";
const MICROBIT_DEVICE_PATH = getEnvironmentVariableOrFail(
    "MICROBIT_DEVICE_PATH"
);
const serialport = new SerialPort({
    path: MICROBIT_DEVICE_PATH,
    baudRate: 115600,
});

console.log("serial port setup: ", serialport.settings);
/**
 *
 * @param {*} num
 * @returns {Promise<void>} a promise which resolves once the value is completely sent to the microbit. (waits for drain)
 */
export async function sendValueToMicrobit(num) {
    const promiseToWriteAndDrain = new Promise((resolve) => {
        console.log(`Tx: ${num} -> microbit`);
        serialport.write(num + "\r\n");
        serialport.drain(() => resolve);
    });
    await promiseToWriteAndDrain;
    //wait another 50ms
    await delay(50);
    return;
}

export async function testSomeSends() {
    for (let i = 0; i < 10; i++) {
        const num = Math.round(Math.random() * 255);
        await sendValueToMicrobit(num);
    }
}

function delay(timeInMillis) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeInMillis);
    });
}
