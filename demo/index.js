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

// List of data points for simulating a VDA5050 AGV
const demo_data = [
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Waiting, battery: {charge: 100.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Waiting, battery: {charge: 100.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Waiting, battery: {charge: 100.0, charging: true}},
    {position: {x: 7, y: 7, z: 0}, yaw: 0.78696, status: ActionStatus.Running, battery: {charge: 95.0, charging: false}},
    {position: {x: 9, y: 9, z: 0}, yaw: 0.78696, status: ActionStatus.Running, battery: {charge: 85.0, charging: false}},
    {position: {x: 11, y: 11, z: 0}, yaw: 0.78696, status: ActionStatus.Running, battery: {charge: 80.0, charging: false}},
    {position: {x: 13, y: 13, z: 0}, yaw: 0.78696, status: ActionStatus.Running, battery: {charge: 80.0, charging: false}},
    {position: {x: 15, y: 15, z: 0}, yaw: 0.78696, status: ActionStatus.Running, battery: {charge: 75.0, charging: false}},
    {position: {x: 15, y: 15, z: 0}, yaw: 0.52359, status: ActionStatus.Running, battery: {charge: 70.0, charging: false}},
    {position: {x: 15, y: 15, z: 0}, yaw: 0.26106, status: ActionStatus.Running, battery: {charge: 70.0, charging: false}},
    {position: {x: 15, y: 15, z: 0}, yaw: 0, status: ActionStatus.Running, battery: {charge: 65.0, charging: false}},
    {position: {x: 17, y: 15, z: 0}, yaw: 0, status: ActionStatus.Running, battery: {charge: 65.0, charging: false}},
    {position: {x: 19, y: 15, z: 0}, yaw: 0, status: ActionStatus.Running, battery: {charge: 55.0, charging: false}},
    {position: {x: 21, y: 15, z: 0}, yaw: 0, status: ActionStatus.Running, battery: {charge: 55.0, charging: false}},
    {position: {x: 23, y: 15, z: 0}, yaw: 0, status: ActionStatus.Running, battery: {charge: 50.0, charging: false}},
    {position: {x: 25, y: 15, z: 0}, yaw: 0, status: ActionStatus.Running, battery: {charge: 50.0, charging: false}},
    {position: {x: 25, y: 15, z: 0}, yaw: 0.52359, status: ActionStatus.Running, battery: {charge: 45.0, charging: false}},
    {position: {x: 25, y: 15, z: 0}, yaw: 1.04906, status: ActionStatus.Running, battery: {charge: 45.0, charging: false}},
    {position: {x: 25, y: 15, z: 0}, yaw: 1.57079, status: ActionStatus.Running, battery: {charge: 45.0, charging: false}},
    {position: {x: 25, y: 17, z: 0}, yaw: 1.57079, status: ActionStatus.Running, battery: {charge: 45.0, charging: false}},
    {position: {x: 25, y: 19, z: 0}, yaw: 1.57079, status: ActionStatus.Running, battery: {charge: 42.0, charging: false}},
    {position: {x: 25, y: 21, z: 0}, yaw: 1.57079, status: ActionStatus.Running, battery: {charge: 42.0, charging: false}},
    {position: {x: 25, y: 23, z: 0}, yaw: 1.57079, status: ActionStatus.Running, battery: {charge: 40.0, charging: false}},
    {position: {x: 25, y: 25, z: 0}, yaw: 1.57079, status: ActionStatus.Running, battery: {charge: 38.0, charging: false}},
    {position: {x: 25, y: 25, z: 0}, yaw: 2.09301, status: ActionStatus.Running, battery: {charge: 38.0, charging: false}},
    {position: {x: 25, y: 25, z: 0}, yaw: 2.61804, status: ActionStatus.Running, battery: {charge: 38.0, charging: false}},
    {position: {x: 25, y: 25, z: 0}, yaw: 3.14159, status: ActionStatus.Running, battery: {charge: 35.0, charging: false}},
    {position: {x: 23, y: 25, z: 0}, yaw: 3.14159, status: ActionStatus.Running, battery: {charge: 35.0, charging: false}},
    {position: {x: 21, y: 25, z: 0}, yaw: 3.14159, status: ActionStatus.Running, battery: {charge: 35.0, charging: false}},
    {position: {x: 19, y: 25, z: 0}, yaw: 3.14159, status: ActionStatus.Running, battery: {charge: 33.0, charging: false}},
    {position: {x: 17, y: 25, z: 0}, yaw: 3.14159, status: ActionStatus.Running, battery: {charge: 32.0, charging: false}},
    {position: {x: 15, y: 25, z: 0}, yaw: -2.61804, status: ActionStatus.Running, battery: {charge: 30.0, charging: false}},
    {position: {x: 15, y: 25, z: 0}, yaw: -2.09301, status: ActionStatus.Running, battery: {charge: 29.0, charging: false}},
    {position: {x: 15, y: 25, z: 0}, yaw: -1.57079, status: ActionStatus.Running, battery: {charge: 28.0, charging: false}},
    {position: {x: 15, y: 25, z: 0}, yaw: -1.57079, status: ActionStatus.Running, battery: {charge: 27.0, charging: false}},
    {position: {x: 15, y: 23, z: 0}, yaw: -1.57079, status: ActionStatus.Running, battery: {charge: 26.0, charging: false}},
    {position: {x: 15, y: 21, z: 0}, yaw: -1.57079, status: ActionStatus.Running, battery: {charge: 25.0, charging: false}},
    {position: {x: 15, y: 19, z: 0}, yaw: -1.57079, status: ActionStatus.Running, battery: {charge: 24.0, charging: false}},
    {position: {x: 15, y: 17, z: 0}, yaw: -1.57079, status: ActionStatus.Running, battery: {charge: 23.0, charging: false}},
    {position: {x: 15, y: 15, z: 0}, yaw: -1.57079, status: ActionStatus.Running, battery: {charge: 22.0, charging: false}},
    {position: {x: 15, y: 15, z: 0}, yaw: -2.35505, status: ActionStatus.Running, battery: {charge: 21.0, charging: false}},
    {position: {x: 13, y: 13, z: 0}, yaw: -2.35505, status: ActionStatus.Running, battery: {charge: 20.0, charging: false}},
    {position: {x: 11, y: 11, z: 0}, yaw: -2.35505, status: ActionStatus.Running, battery: {charge: 14.0, charging: false}},
    {position: {x: 9, y: 9, z: 0}, yaw: -2.35505, status: ActionStatus.Running, battery: {charge: 12.0, charging: false}},
    {position: {x: 7, y: 7, z: 0}, yaw: -2.35505, status: ActionStatus.Running, battery: {charge: 10.0, charging: false}},
    {position: {x: 5, y: 5, z: 0}, yaw: -2.35505, status: ActionStatus.Running, battery: {charge: 8.0, charging: false}},
    {position: {x: 5, y: 5, z: 0}, yaw: -1.57079, status: ActionStatus.Running, battery: {charge: 6.0, charging: false}},
    {position: {x: 5, y: 5, z: 0}, yaw: -0.78696, status: ActionStatus.Running, battery: {charge: 5.0, charging: false}},
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Finished, battery: {charge: 10.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Finished, battery: {charge: 20.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Finished, battery: {charge: 30.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Finished, battery: {charge: 40.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Finished, battery: {charge: 50.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Finished, battery: {charge: 60.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Finished, battery: {charge: 70.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Finished, battery: {charge: 80.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Finished, battery: {charge: 90.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Finished, battery: {charge: 100.0, charging: true}},
    {position: {x: 5, y: 5, z: 0}, yaw: 0, status: ActionStatus.Waiting, battery: {charge: 100.0, charging: true}}
]


function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
  
async function main () {

    // Read configuration from environment
    const {
        VDA5050_AVG_MANUFACTURER: avg_manufacturer = "RobotCompany",
        VDA5050_AVG_SERIAL_NUMBER: avg_serial_number = "001",
        VDA5050_INTERFACE_NAME: interfaceName = 'uagv',
        VDA5050_BROKER_URL: brokerUrl = 'mqtt://localhost:1883',
        VDA5050_BROKER_USERNAME: username,
        VDA5050_BROKER_PASSWORD: password
    } = process.env;

    // The target AGV.
    const agvId = { manufacturer: avg_manufacturer, serialNumber: avg_serial_number };
    
    // Create instance of AGV Client with minimal options: communication namespace, broker endpoint address, broker username and password.
    const agvClient = new AgvClient(agvId, { interfaceName: interfaceName, transport: { brokerUrl: brokerUrl, username, password } });
    
    // Start client interaction, connect to MQTT broker.
    await agvClient.start();
    
    // Send Visualization and State messages using synthetic data
    for (const element of demo_data){
        console.log(`Sending data point`);
        await agvClient.publish(Topic.Visualization, { 
            agvPosition: { 
                x: element.position.x,
                y: element.position.y,
                theta: element.yaw,
                positionInitialized: true,
                mapId: "local"
            },
            velocity: {}}, { dropIfOffline: true });
        await agvClient.publish(Topic.State, {
            batteryState: { batteryCharge: element.battery.charge, charging: element.battery.charging, batteryVoltage: 12.2 },
            orderId: "1",
            orderUpdateId: 0,
            lastNodeId: "0",
            lastNodeSequenceId: 0,
            nodeStates: [],
            edgeStates: [
                // Example trajectory that translates to a path
                {
                    edgeId: '0',
                    sequenceId: 0,
                    released: true,
                    trajectory: {
                        degree: 1,
                        knotVector: [0],
                        controlPoints: [
                            { x: 0, y: 0, weight: 1 },
                            { x: 10, y: 30, weight: 1},
                        ]
                    }
                }
            ],
            driving: true,
            actionStates: [
                { actionId: element.status, actionStatus: element.status }
            ],
            operatingMode: OperatingMode.Automatic,
            errors: [],
            loads: [],
            safetyState: { eStop: EStop.None, fieldViolation: false }
        });
        await sleep(1000);
    }
    
};

main();
