#!/bin/bash
# This script starts a container with the required environment variables to make the vda5050-to-inorbit-proxy work

if  [[ -z "${INORBIT_APP_KEY}" ]]; then
  echo "Please, set your INORBIT_APP_KEY environment variable"
  echo 'use: export INORBIT_APP_KEY="your-INORBIT_APP_KEY-here" and re-run this script' 
  exit
fi

if  [[ -z "${VDA5050_INTERFACE_NAME}" ]]; then
  echo "Your VDA5050_INTERFACE_NAME environment variable is not set"
  echo 'it will be setted with "uagv" value by default'
  export VDA5050_INTERFACE_NAME='uagv' 
fi

if  [[ -z "${VDA5050_BROKER_URL}" ]]; then
  echo "Please, set your VDA5050_BROKER_URL environment variable"
  echo 'use: export VDA5050_BROKER_URL="your-VDA5050_BROKER_URL-here" and re-run this script' 
  exit
fi

if  [[ -z "${VDA5050_BROKER_USERNAME}" ]]; then
  echo "Your VDA5050_BROKER_USERNAME environment variable is not set"
  echo 'Not using an username to connect to the vda5050 broker' 
fi

if  [[ -z "${VDA5050_BROKER_PASSWORD}" ]]; then
  echo "Your VDA5050_BROKER_PASSWORD environment variable is not set"
  echo 'Not using a password to connect to the vda5050 broker' 
fi

echo 'Starting container ...'
docker run --env INORBIT_APP_KEY --env VDA5050_INTERFACE_NAME --env VDA5050_BROKER_URL --env VDA5050_BROKER_USERNAME --env VDA5050_BROKER_PASSWORD -d --net='host' inorbit:vda5050-to-inorbit-proxy