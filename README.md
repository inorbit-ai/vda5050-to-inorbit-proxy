# VDA 5050 to InOrbit Proxy

This service translates messages from the VDA 5050 to InOrbit using the [InOrbit
Edge SDK](https://www.npmjs.com/package/@inorbit/edge-sdk).

When the service runs, it connects to the VDA 5050 MQTT broker and subscribes to
messages from any robot. The data in connection, state and visualization messages
is sent to InOrbit.

## Settings

The service reads its configuration from the following environment variables:

* `INORBIT_API_KEY`: InOrbit API Key.
* `VDA5050_INTERFACE_NAME` VDA 5050 interface name, default is `uagv`.
* `VDA5050_BROKER_URL`: MQTT broker URL, default is `mqtt://localhost:1883`.

## Running locally

To run the service execute the following command:

```console
npm start
```

## Simulating a VDA 5050 robot

The `demo/` folder includes a script with a set of synthetic data points for simulating a `VDA5050` compatible `AVG`. In order to run the simulation execute the following commands:

```console
export VDA5050_AVG_MANUFACTURER = "RobotCompany",
export VDA5050_AVG_SERIAL_NUMBER = "001",
npm run robot-sim-demo
```

Additionally, an image that serves as a map is provided. It can be uploaded by using the [InOrbit API](https://api.inorbit.ai/docs/index.html#operation/postMap). Run the following commands to upload the map to InOrbit:

```bash
export INORBIT_API_URL="http://api.inorbit.ai"
export INORBIT_APP_KEY="abcd1234abcd1234"
export INORBIT_ROBOT_ID="vda-RobotCompany-001"

cd demo/

$ curl --location --request POST "${INORBIT_API_URL}/robots/${INORBIT_ROBOT_ID}/maps" \
  --header "x-auth-inorbit-app-key: ${INORBIT_APP_KEY}" \
  --form 'metadata="{\"mapId\":\"map\", \"label\": \"map\", \"resolution\": 0.1, \"x\": 0, \"y\": 0}"' \
  --form 'image=@"./map.png"'
""
```
