#!/bin/bash

USER=ngthotuan
IMAGE=em-fe
VERSION=1.0
echo "Run docker run --rm -p 9001:80 $USER/$IMAGE:$VERSION"
docker run --rm -p 9001:80 $USER/$IMAGE:$VERSION
