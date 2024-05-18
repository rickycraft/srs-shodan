#!/bin/bash

BASE="http://localhost:7071"

if [ $# -lt 1 ]; then
  echo "Usage: $0 (produce|consume|start)"
  exit 1
fi

# Handle start
if [ $1 == "start" ]; then
  pushd terraform
  if [ -z "$EVENTGRID_ENDPOINT" ]; then
    export EVENTGRID_ENDPOINT=$(terraform output event_grid_endpoint | tr -d \")
  fi
  echo "EVENTGRID_ENDPOINT: $EVENTGRID_ENDPOINT"
  if [ -z "$EVENTGRID_KEY" ]; then
    export EVENTGRID_KEY=$(terraform output event_grid_key | tr -d \")
  fi
  echo "EVENTGRID_KEY: $EVENTGRID_KEY"
  popd
  pushd functions
  source env/bin/activate
  pip3 install -r requirements.txt >/dev/null
  source .env
  func host start
  popd
  exit 0
fi

# Handle produce and consume
if [ $# -ne 2 ]; then
  echo "Usage: $0 (produce|consume) json-file"
  exit 1
fi

if [[ "$1" != "produce" && "$1" != "consume" ]]; then
  echo "Second parameter should be one of: produce, consume"
  exit 1
fi

if [ ! -f "$2" ]; then
  echo "File not found: $2"
  exit 1
fi

# Checking if jq is installed
if ! command -v jq >/dev/null 2>&1; then
  echo "jq is not installed. Please install jq to proceed."
  exit 1
fi

jq empty "$2" >/dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Invalid JSON file: $2"
  exit 1
fi

file="$2"

function produce {
  URL="$BASE/publish"
  curl -X POST -H "Content-Type: application/json" -d "@$file" $URL
}

function consume {
  URL="$BASE/runtime/webhooks/EventGrid?functionName=ShodanConsumer"
  curl -X POST -H "Content-Type: application/json" -H "aeg-event-type: Notification" -d "@$file" $URL
}

$1