
#!/usr/bin/env bash
set -euo pipefail

# Reset script: checkout main, pull, install deps, and build

echo "Clear working tree"
git clean -d -f

echo "Fetching..."
git fetch

echo "Checking out main branch..."
git checkout main

echo "Resetting..."
git reset --hard origin/main

# echo "Initializing submodules (shallow checkout)..."
# git submodule update --init --depth 1

echo "Installing dependencies..."
pnpm install

echo "Building all packages..."
pnpm turbo run build

echo "Reset complete!"
