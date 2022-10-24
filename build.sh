#!/bin/bash

USER=ngthotuan
IMAGE=em-fe
VERSION=1.0
yarn build:prod
docker build -t $USER/$IMAGE:$VERSION .
