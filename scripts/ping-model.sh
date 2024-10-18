#! /bin/bash

MODEL_NAME="phi3:medium"

curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"model\": \"$MODEL_NAME\", \"prompt\": \"Hello, how are you?\", \"stream\": false }" \
  http://localhost:11434/api/generate
