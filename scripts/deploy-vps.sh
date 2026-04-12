#!/usr/bin/env bash
# Reference deploy steps for Hostinger VPS — customize DEPLOY_HOST and paths.
set -euo pipefail

: "${DEPLOY_HOST:?Set DEPLOY_HOST=user@your-vps-ip}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/fleet-flows}"

echo "==> Syncing repo to ${DEPLOY_HOST}:${REMOTE_DIR}/releases/build-$(date +%Y%m%d%H%M)"
rsync -az --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  ./ "${DEPLOY_HOST}:${REMOTE_DIR}/releases/build-$(date +%Y%m%d%H%M)/"

echo "==> On the server, run: cd releases/build-* && npm ci && npx prisma migrate deploy && npm run build && sudo systemctl restart fleet-flows"
echo "    (Or update the 'current' symlink first, then restart — see VPS-DEPLOYMENT.md)"
