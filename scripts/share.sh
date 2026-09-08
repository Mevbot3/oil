#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-43147}"
BIN="${CLOUDFLARED_BIN:-$HOME/.local/bin/cloudflared}"

mkdir -p "$(dirname "$BIN")"

if [[ ! -x "$BIN" ]]; then
  echo "Downloading cloudflared…"
  curl -fsSL "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64" -o "$BIN"
  chmod +x "$BIN"
fi

echo "Opening a public tunnel to http://127.0.0.1:${PORT}"
echo "Leave this running. Send your friend the https://*.trycloudflare.com URL it prints."
exec "$BIN" tunnel --url "http://127.0.0.1:${PORT}"
