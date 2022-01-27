#!/bin/bash
#This script builds the docker image and tags it "inorbit:vda5050-to-inorbit-proxy"
MY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DOCKER_IMAGE="inorbit:vda5050-to-inorbit-proxy"
docker build $MY_DIR -t $DOCKER_IMAGE