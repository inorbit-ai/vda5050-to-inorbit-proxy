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
import { MasterController, Topic } from 'vda-5050-lib';
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
    INORBIT_APP_KEY: appKey,
    INORBIT_ENDPOINT: endpoint,
    VDA5050_INTERFACE_NAME: interfaceName = 'uagv',
    VDA5050_BROKER_URL: brokerUrl = 'mqtt://localhost:1883'
  } = process.env;

  // Setup InOrbit
  const inorbit = new InOrbit({ appKey, endpoint });

  // Create the proxy object that takes care of translating VDA 5050 messages
  // to InOrbit
  const proxy = new VDA5050ToInOrbitProxy(inorbit);

  // Start a VDA 5050 Master that can subscribe to interesting topics
  const mcClient = new MasterController({ interfaceName, transport: { brokerUrl } });
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

  console.log(`Proxy service started: Listening to VDA 5050 messages on ${anonymizeUri(brokerUrl)} interface name ${interfaceName}`);
}

main();
