/**
 * Copyright 2021 InOrbit
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

import { 
    AgvClient,
    Topic,
    OperatingMode,
    EStop,
    ActionStatus,
} from 'vda-5050-lib'

const demo_data = [
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w:0.707}, status: ActionStatus.Waiting, battery: {charge: 100.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Waiting, battery: {charge: 100.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Waiting, battery: {charge: 100.0, charging: true}},
    {position: {x: 7, y: 7, z: 0}, rotation: {x: 0.653, y: 0.271, z: 0.271, w: 0.653}, status: ActionStatus.Running, battery: {charge: 95.0, charging: false}},
    {position: {x: 9, y: 9, z: 0}, rotation: {x: 0.653, y: 0.271, z: 0.271, w: 0.653}, status: ActionStatus.Running, battery: {charge: 85.0, charging: false}},
    {position: {x: 11, y: 11, z: 0}, rotation: {x: 0.653, y: 0.271, z: 0.271, w: 0.653}, status: ActionStatus.Running, battery: {charge: 80.0, charging: false}},
    {position: {x: 13, y: 13, z: 0}, rotation: {x: 0.653, y: 0.271, z: 0.271, w: 0.653}, status: ActionStatus.Running, battery: {charge: 80.0, charging: false}},
    {position: {x: 15, y: 15, z: 0}, rotation: {x: 0.653, y: 0.271, z: 0.271, w: 0.653}, status: ActionStatus.Running, battery: {charge: 75.0, charging: false}},
    {position: {x: 15, y: 15, z: 0}, rotation: {x: 0.683, y: 0.183, z: 0.183, w: 0.683}, status: ActionStatus.Running, battery: {charge: 70.0, charging: false}},
    {position: {x: 15, y: 15, z: 0}, rotation: {x: 0.701, y: 0.092, z: 0.092, w: 0.701}, status: ActionStatus.Running, battery: {charge: 70.0, charging: false}},
    {position: {x: 15, y: 15, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Running, battery: {charge: 65.0, charging: false}},
    {position: {x: 17, y: 15, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Running, battery: {charge: 65.0, charging: false}},
    {position: {x: 19, y: 15, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Running, battery: {charge: 55.0, charging: false}},
    {position: {x: 21, y: 15, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Running, battery: {charge: 55.0, charging: false}},
    {position: {x: 23, y: 15, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Running, battery: {charge: 50.0, charging: false}},
    {position: {x: 25, y: 15, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Running, battery: {charge: 50.0, charging: false}},
    {position: {x: 25, y: 15, z: 0}, rotation: {x: 0.683, y: 0.183, z: 0.183, w: 0.683}, status: ActionStatus.Running, battery: {charge: 45.0, charging: false}},
    {position: {x: 25, y: 15, z: 0}, rotation: {x: 0.612, y: 0.354, z: 0.354, w: 0.612}, status: ActionStatus.Running, battery: {charge: 45.0, charging: false}},
    {position: {x: 25, y: 15, z: 0}, rotation: {x: 0.5, y: 0.5, z: 0.5, w: 0.5}, status: ActionStatus.Running, battery: {charge: 45.0, charging: false}},
    {position: {x: 25, y: 17, z: 0}, rotation: {x: 0.5, y: 0.5, z: 0.5, w: 0.5}, status: ActionStatus.Running, battery: {charge: 45.0, charging: false}},
    {position: {x: 25, y: 19, z: 0}, rotation: {x: 0.5, y: 0.5, z: 0.5, w: 0.5}, status: ActionStatus.Running, battery: {charge: 42.0, charging: false}},
    {position: {x: 25, y: 21, z: 0}, rotation: {x: 0.5, y: 0.5, z: 0.5, w: 0.5}, status: ActionStatus.Running, battery: {charge: 42.0, charging: false}},
    {position: {x: 25, y: 23, z: 0}, rotation: {x: 0.5, y: 0.5, z: 0.5, w: 0.5}, status: ActionStatus.Running, battery: {charge: 40.0, charging: false}},
    {position: {x: 25, y: 25, z: 0}, rotation: {x: 0.5, y: 0.5, z: 0.5, w: 0.5}, status: ActionStatus.Running, battery: {charge: 38.0, charging: false}},
    {position: {x: 25, y: 25, z: 0}, rotation: {x: 0.354, y: 0.612, z: 0.612, w: 0.354}, status: ActionStatus.Running, battery: {charge: 38.0, charging: false}},
    {position: {x: 25, y: 25, z: 0}, rotation: {x: 0.183, y: 0.683, z: 0.683, w: 0.183}, status: ActionStatus.Running, battery: {charge: 38.0, charging: false}},
    {position: {x: 25, y: 25, z: 0}, rotation: {x: 0, y: 0.707, z: 0.707, w: 0}, status: ActionStatus.Running, battery: {charge: 35.0, charging: false}},
    {position: {x: 23, y: 25, z: 0}, rotation: {x: 0, y: 0.707, z: 0.707, w: 0}, status: ActionStatus.Running, battery: {charge: 35.0, charging: false}},
    {position: {x: 21, y: 25, z: 0}, rotation: {x: 0, y: 0.707, z: 0.707, w: 0}, status: ActionStatus.Running, battery: {charge: 35.0, charging: false}},
    {position: {x: 19, y: 25, z: 0}, rotation: {x: 0, y: 0.707, z: 0.707, w: 0}, status: ActionStatus.Running, battery: {charge: 33.0, charging: false}},
    {position: {x: 17, y: 25, z: 0}, rotation: {x: 0, y: 0.707, z: 0.707, w: 0}, status: ActionStatus.Running, battery: {charge: 32.0, charging: false}},
    {position: {x: 15, y: 25, z: 0}, rotation: {x: 0.183, y: -0.683, z: -0.683, w: 0.183}, status: ActionStatus.Running, battery: {charge: 30.0, charging: false}},
    {position: {x: 15, y: 25, z: 0}, rotation: {x: 0.354, y: -0.612, z: -0.612, w: 0.354}, status: ActionStatus.Running, battery: {charge: 29.0, charging: false}},
    {position: {x: 15, y: 25, z: 0}, rotation: {x: 0.500, y: -0.500, z: -0.500, w: 0.500}, status: ActionStatus.Running, battery: {charge: 28.0, charging: false}},
    {position: {x: 15, y: 25, z: 0}, rotation: {x: 0.500, y: -0.500, z: -0.500, w: 0.500}, status: ActionStatus.Running, battery: {charge: 27.0, charging: false}},
    {position: {x: 15, y: 23, z: 0}, rotation: {x: 0.500, y: -0.500, z: -0.500, w: 0.500}, status: ActionStatus.Running, battery: {charge: 26.0, charging: false}},
    {position: {x: 15, y: 21, z: 0}, rotation: {x: 0.500, y: -0.500, z: -0.500, w: 0.500}, status: ActionStatus.Running, battery: {charge: 25.0, charging: false}},
    {position: {x: 15, y: 19, z: 0}, rotation: {x: 0.500, y: -0.500, z: -0.500, w: 0.500}, status: ActionStatus.Running, battery: {charge: 24.0, charging: false}},
    {position: {x: 15, y: 17, z: 0}, rotation: {x: 0.500, y: -0.500, z: -0.500, w: 0.500}, status: ActionStatus.Running, battery: {charge: 23.0, charging: false}},
    {position: {x: 15, y: 15, z: 0}, rotation: {x: 0.500, y: -0.500, z: -0.500, w: 0.500}, status: ActionStatus.Running, battery: {charge: 22.0, charging: false}},
    {position: {x: 15, y: 15, z: 0}, rotation: {x: 0.271, y: -0.653, z: -0.653, w: 0.271}, status: ActionStatus.Running, battery: {charge: 21.0, charging: false}},
    {position: {x: 13, y: 13, z: 0}, rotation: {x: 0.271, y: -0.653, z: -0.653, w: 0.271}, status: ActionStatus.Running, battery: {charge: 20.0, charging: false}},
    {position: {x: 11, y: 11, z: 0}, rotation: {x: 0.271, y: -0.653, z: -0.653, w: 0.271}, status: ActionStatus.Running, battery: {charge: 14.0, charging: false}},
    {position: {x: 9, y: 9, z: 0}, rotation: {x: 0.271, y: -0.653, z: -0.653, w: 0.271}, status: ActionStatus.Running, battery: {charge: 12.0, charging: false}},
    {position: {x: 7, y: 7, z: 0}, rotation: {x: 0.271, y: -0.653, z: -0.653, w: 0.271}, status: ActionStatus.Running, battery: {charge: 10.0, charging: false}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.271, y: -0.653, z: -0.653, w: 0.271}, status: ActionStatus.Running, battery: {charge: 8.0, charging: false}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.500, y: -0.500, z: -0.500, w: 0.500}, status: ActionStatus.Running, battery: {charge: 6.0, charging: false}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.653, y: -0.271, z: -0.271, w: 0.653}, status: ActionStatus.Running, battery: {charge: 5.0, charging: false}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Finished, battery: {charge: 10.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Finished, battery: {charge: 20.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Finished, battery: {charge: 30.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Finished, battery: {charge: 40.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Finished, battery: {charge: 50.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Finished, battery: {charge: 60.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Finished, battery: {charge: 70.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Finished, battery: {charge: 80.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Finished, battery: {charge: 90.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Finished, battery: {charge: 100.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, rotation: {x: 0.707, y: 0, z: 0, w: 0.707}, status: ActionStatus.Waiting, battery: {charge: 100.0, charging: true}}
]

/**
 * Extract the yaw from a quaternion
 *
 * @typedef Quaternion
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {number} w
 *
 * @param {Quaternion} q
 * @returns {number} Yaw
 */
 export function quaternionToYaw(q) {
    const yaw = Math.atan2(2.0 * (q.z * q.w + q.x * q.y), -1.0 + 2.0 * (q.w * q.w + q.x * q.x));
    return yaw;
  }

async function main () {

    // Read configuration from environment
    const {
        VDA5050_AVG_MANUFACTURER: avg_manufacturer = "RobotCompany",
        VDA5050_AVG_SERIAL_NUMBER: avg_serial_number = "001",
        VDA5050_INTERFACE_NAME: interfaceName = 'uagv',
        VDA5050_BROKER_URL: brokerUrl = 'mqtt://localhost:1883'
    } = process.env;

    // The target AGV.
    const agvId = { manufacturer: avg_manufacturer, serialNumber: avg_serial_number };
    
    // Create instance of AGV Client with minimal options: communication namespace and broker endpoint address.
    const agvClient = new AgvClient(agvId, { interfaceName: interfaceName, transport: { brokerUrl: brokerUrl } });
    
    // Start client interaction, connect to MQTT broker.
    await agvClient.start();
    
    // Send Visualization and State messages using synthetic data
    demo_data.forEach((element, index) => {
        setTimeout(async function() {
            console.log(`Using synthetic data point number ${index}`);
            await agvClient.publish(Topic.Visualization, { 
                agvPosition: { 
                    x: element.position.x,
                    y: element.position.y,
                    theta: quaternionToYaw(element.rotation) ,
                    positionInitialized: true,
                    mapId: "local"
                },
                velocity: {}}, { dropIfOffline: true });
            await agvClient.publish(Topic.State, {
                batteryState: { batteryCharge: element.battery.charge, charging: element.battery.charging },
                orderId: "1",
                orderUpdateId: 0,
                lastNodeId: "0",
                lastNodeSequenceId: 0,
                nodeStates: [],
                edgeStates: [],
                driving: true,
                actionStates: [
                    {actionId: element.status, actionStatus: element.status}
                ],
                operatingMode: OperatingMode.Automatic,
                errors: [],
                safetyState: { eStop: EStop.None, fieldViolation: false }
            });
        }, index*1000)}
    )
};

main();
