#!/bin/bash
# VibeCheck launcher
# Run from your terminal: ./launch.sh
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "⚡ VibeCheck — Launch Script"
echo "───────────────────────────"

# 1. Push to GitHub (safe to re-run, won't double-push)
echo ""
echo "→ Pushing to GitHub (robbytsmith/vibecheck)..."
git push -u origin main && echo "✓ Pushed to https://github.com/robbytsmith/vibecheck" || echo "⚠ Push skipped (may already be up to date)"

# 2. Ensure pnpm is available
if ! command -v pnpm &> /dev/null; then
  echo ""
  echo "→ pnpm not found — installing via npm..."
  npm install -g pnpm
  echo "✓ pnpm installed"
fi
echo "✓ pnpm $(pnpm --version) ready"

# 3. Install all workspace dependencies
echo ""
echo "→ Installing dependencies..."
pnpm install
echo "✓ Dependencies installed"

# 4. Start both dev servers
echo ""
echo "✓ Starting VibeCheck..."
echo "  Dashboard  →  http://localhost:5173"
echo "  API        →  http://localhost:3001"
echo "  Signal Bus →  http://localhost:3001/api/signal/default"
echo ""
pnpm dev
