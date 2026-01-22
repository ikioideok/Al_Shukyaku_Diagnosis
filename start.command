#!/bin/zsh
set -e
SCRIPT_DIR="${0:A:h}"
cd "$SCRIPT_DIR"

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting dev server..."
npm run dev
