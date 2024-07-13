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
 * @param {string} str
 * @returns {Promise<void>} a promise which resolves once the value is completely sent to the microbit. (waits for drain)
 */
export async function sendStringToMicrobit(str) {
    const promiseToWriteAndDrain = new Promise((resolve) => {
        console.log(`Tx: ${str} -> microbit at ${performance.now()}`);
        const readyToContinue = serialport.write(str + "\r\n");
        if (!readyToContinue) {
            serialport.drain(resolve);
        } else {
            resolve();
        }
    });
    await promiseToWriteAndDrain;
    //wait another 50ms
    await delay(50);
    return;
}

export async function testSomeSends() {
    for (let i = 0; i < 10; i++) {
        const num = pick([130, 131, 132]);
        await sendStringToMicrobit("21:" + num);
    }
}

function delay(timeInMillis) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeInMillis);
    });
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr)];
}

export async function drainOutput() {
    return new Promise((resolve) => {
        console.log(`Draining out to microbit serial`);
        serialport.drain(resolve);
    });
}
