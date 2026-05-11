#!/bin/bash
# Double-click this file on macOS to open the HITL ML Summer Reader.
# Serves locally so all features (TTS, games, ambient) work correctly.

DIR="$(cd "$(dirname "$0")" && pwd)"

# Try to find a free port starting at 3030
PORT=3030
while lsof -i :$PORT &>/dev/null; do PORT=$((PORT+1)); done

cd "$DIR"
python3 -m http.server "$PORT" --bind 127.0.0.1 &
SERVER_PID=$!

sleep 0.4
open "http://127.0.0.1:$PORT"

echo "HITL ML Reader running at http://127.0.0.1:$PORT"
echo "Press Ctrl+C to stop."
wait $SERVER_PID
