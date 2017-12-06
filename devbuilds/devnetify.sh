#!/usr/bin/env bash
sed -ie '/WS_PROTOCOL/s/wss:/ws:/' node_modules/byteballcore/conf.js
