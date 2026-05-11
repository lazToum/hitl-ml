#!/usr/bin/env bash
# deploy/limen-osio/deploy.sh
# Build shell SPA, push to dev VM, rebuild limen-serve, reload Caddy.
#
# Usage:
#   ./deploy/limen-osio/deploy.sh                  # build + deploy
#   ./deploy/limen-osio/deploy.sh --skip-build     # deploy without rebuilding (faster, use existing dist/)
#   ./deploy/limen-osio/deploy.sh --hash-password  # just generate a bcrypt hash

set -euo pipefail

VM=dev
REMOTE_DEPLOY=/home/tam/p/main/deploy/limen-osio
CADDY_FILE=/etc/caddy/Caddyfile
ENV_FILE=~/p/main/deploy/limen-osio/.env
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# ── Hash-password helper ───────────────────────────────────────────────────────
if [[ "${1:-}" == "--hash-password" ]]; then
  echo "Generating bcrypt hash (you will be prompted for the password):"
  docker run --rm -it caddy:2-alpine caddy hash-password
  echo ""
  echo "Add the output to your .env as INDEX_PASS_HASH=\$2a\$..."
  exit 0
fi

# ── Build shell SPA locally ────────────────────────────────────────────────────
SHELL_DIR="$REPO_ROOT/limen-os/apps/shell"
if [[ "${1:-}" != "--skip-build" ]]; then
  echo "→ Building JS workspace packages"
  for pkg in voice-client ai-client ui smart-cities-client; do
    (cd "$REPO_ROOT/limen-os/packages/$pkg" && bun run build)
  done
  echo "→ Building shell SPA (bun run build)"
  (cd "$SHELL_DIR" && bun run build)
  echo "✓ Shell built → $SHELL_DIR/dist/"
else
  echo "→ Skipping build (--skip-build)"
fi

echo "→ Rsyncing deploy/limen-osio to $VM:$REMOTE_DEPLOY"
rsync -avz --delete --exclude='.DS_Store' \
  "$SCRIPT_DIR/" \
  "$VM:$REMOTE_DEPLOY/"

echo "→ Rsyncing shell dist (includes player) to $VM"
ssh "$VM" "mkdir -p ~/p/main/limen-os/apps/shell/dist"
rsync -avz --delete --exclude='.DS_Store' \
  "$SHELL_DIR/dist/" \
  "$VM:~/p/main/limen-os/apps/shell/dist/"

echo "→ Rsyncing dist/site (limen-os.io static pages) to $VM"
ssh "$VM" "mkdir -p ~/p/main/dist/site"
rsync -avz --delete \
  "$REPO_ROOT/dist/site/" \
  "$VM:~/p/main/dist/site/"
ssh "$VM" "sudo rsync -a --delete ~/p/main/dist/site/ /srv/site/ && sudo chown -R caddy:caddy /srv/site"

echo "→ Copying Caddyfile + index page to system paths"
ssh "$VM" "sudo cp $REMOTE_DEPLOY/Caddyfile $CADDY_FILE && sudo mkdir -p /srv/index && sudo cp -r $REMOTE_DEPLOY/index/. /srv/index/ && sudo chown -R caddy:caddy /srv/index"

echo "→ Installing file browser service (Python http.server on :8099)"
ssh "$VM" bash <<'REMOTE'
sudo tee /etc/systemd/system/limen-filebrowser.service > /dev/null <<EOF
[Unit]
Description=Limen file browser (/index/files/)
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 -m http.server 8099 --bind 127.0.0.1 --directory /srv/site
Restart=on-failure
User=caddy

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable --now limen-filebrowser
echo "✓ limen-filebrowser running"
REMOTE

echo "→ Injecting env vars into Caddy systemd unit"
ssh "$VM" bash <<'REMOTE'
set -euo pipefail
ENV_FILE=~/p/main/deploy/limen-osio/.env

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found. Copy .env.example → .env and fill in secrets."
  exit 1
fi

# Load the .env (skip comments and blanks)
export $(grep -v '^\s*#' "$ENV_FILE" | grep -v '^\s*$' | xargs)

# Write a systemd drop-in with the vars Caddy needs
DROPIN=/etc/systemd/system/caddy.service.d/env.conf
sudo mkdir -p "$(dirname $DROPIN)"
sudo tee "$DROPIN" > /dev/null <<EOF
[Service]
Environment="ACME_EMAIL=${ACME_EMAIL:-admin@example.com}"
Environment="LANDING_DOMAIN=${LANDING_DOMAIN:-limen-os.io}"
Environment="SHELL_DOMAIN=${SHELL_DOMAIN:-io.limen-os.io}"
Environment="INDEX_USER=${INDEX_USER:-admin}"
Environment="INDEX_PASS_HASH=${INDEX_PASS_HASH:-}"
EOF

sudo systemctl daemon-reload
sudo systemctl restart caddy
echo "✓ Caddy restarted"
REMOTE

echo "→ Rebuilding + restarting limen-serve Docker container"
ssh "$VM" bash <<'REMOTE'
set -euo pipefail
cd ~/p/main/deploy/limen-osio
docker compose build limen-serve
docker compose up -d limen-serve
echo "✓ limen-serve restarted"
REMOTE

echo "✓ Done — https://${LANDING_DOMAIN:-limen-os.io}/index"
