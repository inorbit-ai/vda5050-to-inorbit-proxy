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

/**
 * This service translates messages from the VDA 5050 to InOrbit using the InOrbit
 * Edge SDK.
 */
import { MasterController, Topic, BlockingType, Order, AgvId } from 'vda-5050-lib';
import { InOrbit } from '@inorbit/edge-sdk';

import VDA5050ToInOrbitProxy from './vda5050ToIOProxy';

/**
 * Replaces sensitive information in a URI
 *
 * @param {string} uri
 * @returns {string}
 */
function anonymizeUri(uri) {
  if (uri.indexOf('@') == -1) {
    return uri;
  }
  const match = (uri || '').match('([a-z]+://[^:]*:).*(@.*)');
  return match ? match[1] + '...' + match[2] : '(anonymized url)';
}

/**
 * Main entry point
 */
async function main() {
  // Read configuration from environment
  const {
    INORBIT_API_KEY: apiKey,
    INORBIT_ENDPOINT: endpoint,
    VDA5050_INTERFACE_NAME: interfaceName = 'uagv',
    VDA5050_BROKER_URL: brokerUrl = 'mqtt://localhost:1883',
    VDA5050_BROKER_USERNAME: username,
    VDA5050_BROKER_PASSWORD: password
  } = process.env;

  // Setup InOrbit
  const inorbit = new InOrbit({ apiKey, endpoint });

  // Create the proxy object that takes care of translating VDA 5050 messages
  // to InOrbit
  const proxy = new VDA5050ToInOrbitProxy(inorbit);

  // Start a VDA 5050 Master that can subscribe to interesting topics
  const mcClient = new MasterController({ interfaceName, transport: { brokerUrl, username, password } },);
  await mcClient.start();

  // Subscribe to connection, state and visualization messages from any AGV and
  // pass the messages to the proxy object.
  await mcClient.subscribe(Topic.Connection, { }, async (msg) => {
    try {
      await proxy.processConnectionMessage(msg);
    } catch (e) {
      console.warn('Error processing connection message', e, msg);
    }
  });

  await mcClient.subscribe(Topic.State, { }, async (msg) => {
    try {
      await proxy.processStateMessage(msg);
    } catch (e) {
      console.warn('Error processing state message', e, msg);
    }
  });

  await mcClient.subscribe(Topic.Visualization, { }, async (msg) => {
    try {
      await proxy.processVisualizationMessage(msg);
    } catch (e) {
      console.warn('Error processing visualization message', e, msg);
    }
  });

  proxy.registerInOrbitCallback('ros/loc/nav_goal', async (topic, message) => {
    console.log(message.toString());
    const agvId_ = { manufacturer: "OTTO", serialNumber: "SN111" };

    // Define a pick & drop order with two base nodes and one base edge.
    const order_ = {
      orderId: mcClient.createUuid(),
      orderUpdateId: 0,
      nodes: [
        {
          nodeId: "productionunit_1", sequenceId: 0, released: true, nodePosition: { x: 0, y: 0, mapId: "map" },
          actions: [{ actionId: "a001", actionType: "pick", blockingType: BlockingType.Hard, actionParameters: [{ key: "stationType", value: "floor" }, { key: "loadType", value: "EPAL" }] }],
        },
        {
          nodeId: "productionunit_2", sequenceId: 2, released: true, nodePosition: { x: 100, y: 200, mapId: "map" },
          actions: [{ actionId: "a002", actionType: "drop", blockingType: BlockingType.Hard, actionParameters: [{ key: "stationType", value: "floor" }, { key: "loadType", value: "EPAL" }] }],
        },
      ],
      edges: [
        { edgeId: "productionunit_1_2", sequenceId: 1, startNodeId: "productionunit_1", endNodeId: "productionunit_2", released: true, actions: [] },
      ],
    };

    const orderWithHeader = await mcClient.publish(Topic.Order, agvId_, order_);
    console.log("Published order %o", orderWithHeader);
  });

  console.log(`Proxy service started: Listening to VDA 5050 messages on ${anonymizeUri(brokerUrl)} interface name ${interfaceName}`);
}

main();
