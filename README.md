# VDA 5050 to InOrbit Proxy

This service translates messages from the VDA 5050 to InOrbit using the InOrbit
Cloud SDK.

When the service runs, it connects to the VDA 5050 MQTT broker and subscribes to
messages from any robot. The data in connection, state and visualization messages
is sent to InOrbit.


## Settings

The service reads its configuration from the following environment variables:

* `INORBIT_APP_KEY`: InOrbit App Key.
* `VDA5050_INTERFACE_NAME` VDA 5050 interface name, default is `uagv`.
* `VDA5050_BROKER_URL`: MQTT broker URL, default is `mqtt://localhost:1883`.

## Running locally

To run the service execute the following command:

```console
$ npm start
```
