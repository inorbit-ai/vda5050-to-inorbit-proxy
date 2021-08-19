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
 * This module provides the VDA5050ToInOrbitProxy class that takes care of the
 * translation between VDA 5050 and InOrbit
 */

/**
 * Processes VDA 5050 messages, sending the data to InOrbit
 */
export default class VDA5050ToInOrbitProxy {
  /**
   * InOrbit Cloud SDK instance
   *
   * @type {InOrbit}
   */
  #inorbit;

  /**
   * Initializes this instance
   * @param {InOrbit} inorbit Already initialized instance of InOrbit Cloud SDK.
   */
  constructor(inorbit) {
    this.#inorbit = inorbit;
  }

  /**
   * Generates a stable InOrbit robot id for a manufacturer and serial number pair.
   *
   * @param {string} manufacturer
   * @param {string} serialNumber
   * @returns {string}
   */
  generateInorbitId(manufacturer, serialNumber) {
    return `vda-${manufacturer}-${serialNumber}`;
  }

  /**
   * Generates a stable InOrbit robot name.
   *
   * @param {string} manufacturer
   * @param {string} serialNumber
   * @returns {string}
   */
  generateRobotName(manufacturer, serialNumber) {
    return `${manufacturer}-${serialNumber}`;
  }

  /**
   * Processes a VDA 5050 State message reporting pose, velocity and other
   * data to InOrbit.
   *
   * @param {import("vda-5050-lib").State} msg VDA 5050 state message
   */
  processStateMessage = async (msg) => {
    const { manufacturer, serialNumber, timestamp, agvPosition, batteryState,
      errors, loads, operatingMode, velocity } = msg;
    const { batteryCharge, batteryVoltage, batteryHealth } = batteryState;

    const robotId = this.generateInorbitId(manufacturer, serialNumber);
    const ts = new Date(timestamp).getTime();

    return Promise.all([
      this.reportPose(robotId, agvPosition, ts),
      this.reportVelocity(robotId, velocity, ts),
      this.#inorbit.publishCustomDataKV(robotId, {
        operatingMode,
        batteryCharge,
        batteryVoltage,
        batteryHealth,
        loads: JSON.stringify(loads),
        errors: JSON.stringify(errors)
      })
    ]);
  };

  /**
   * Processes a VDA 5050 Connection message reflecting the robot connection status
   * in InOrbit.
   *
   * @param {import("vda-5050-lib").Connection} msg VDA 5050 connection message
   */
  processConnectionMessage = async (msg) => {
    const { manufacturer, serialNumber } = msg;

    if (msg.connectionState == 'ONLINE') {
      return this.#inorbit.connectRobot({
        robotId: this.generateInorbitId(manufacturer, serialNumber),
        name: this.generateRobotName(manufacturer, serialNumber)
      });
    } else {
      return this.#inorbit.disconnectRobot(this.generateInorbitId(manufacturer, serialNumber));
    }
  };

  /**
   * Processes a VDA 5050 Visualization message reporting the pose and velocity
   * to InOrbit.
   *
   * @param {import("vda-5050-lib").Visualization} msg VDA 5050 visualization message
   */
  processVisualizationMessage = async (msg) => {
    const { manufacturer, serialNumber, timestamp, agvPosition, velocity } = msg;

    const robotId = this.generateInorbitId(manufacturer, serialNumber);
    const ts = new Date(timestamp).getTime();

    return Promise.all([
      this.reportPose(robotId, agvPosition, ts),
      this.reportVelocity(robotId, velocity, ts)
    ]);
  };

  /**
   * Reports VDA 5050 velocity to InOrbit
   *
   * @param {string} robotId InOrbit robot Id
   * @param {import("vda-5050-lib").Velocity} velocity VDA 5050 Velocity object
   * @param {number} ts Timestamp in milliseconds
   */
  reportVelocity = async (velocity, robotId, ts) => {
    if (velocity) {
      await this.#inorbit.publishOdometry(robotId, {
        tsStart: ts,
        ts,
        speed: {
          linear: Math.sqrt(velocity.vx ** 2 + velocity.vy ** 2),
          angular: velocity.omega,
        }
      });
    }
  }

  /**
   * Reports VDA 5050 velocity to InOrbit
   *
   * @param {string} robotId InOrbit robot Id
   * @param {import("vda-5050-lib").AgvPosition} agvPosition VDA 5050 position object
   * @param {number} ts Timestamp in milliseconds
   */
  reportPose = async (agvPosition, robotId, ts) => {
    if (agvPosition) {
      await this.#inorbit.publishPose(robotId, {
        ts,
        x: agvPosition.x,
        y: agvPosition.y,
        yaw: agvPosition.theta,
        frameId: agvPosition.mapId
      });
    }
  }
}
