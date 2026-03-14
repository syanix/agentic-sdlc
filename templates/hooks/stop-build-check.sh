#!/usr/bin/env bash
# Stop hook: verify build integrity before session ends
#
# This hook runs when a Claude session ends (Stop event).
# It executes the project's build command to ensure that all
# changes made during the session still produce a successful build.
#
# Usage: Called automatically via Stop hook in settings.json
# Exit code: 0 if build passes, 1 if build fails

set -euo pipefail

# Configuration — these are replaced by the CLI scaffolder
BUILD_COMMAND="${CLAUDE_BUILD_COMMAND:-npm run build}"
PROJECT_ROOT="${CLAUDE_PROJECT_ROOT:-.}"

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No colour

echo -e "${YELLOW}[stop-build-check]${NC} Verifying build integrity..."

# Change to project root
cd "${PROJECT_ROOT}"

# Check if package.json or equivalent build config exists
if [[ ! -f "package.json" && ! -f "Cargo.toml" && ! -f "go.mod" && ! -f "pyproject.toml" ]]; then
    echo -e "${YELLOW}[stop-build-check]${NC} No recognised build configuration found. Skipping build check."
    exit 0
fi

# Run the build command and capture output
BUILD_OUTPUT=$(eval "${BUILD_COMMAND}" 2>&1) || {
    BUILD_EXIT_CODE=$?
    echo -e "${RED}[stop-build-check]${NC} Build FAILED with exit code ${BUILD_EXIT_CODE}"
    echo -e "${RED}[stop-build-check]${NC} Build output:"
    echo "${BUILD_OUTPUT}" | tail -20
    echo ""
    echo -e "${RED}[stop-build-check]${NC} The build is broken. Please review the changes made during this session."
    exit 1
}

echo -e "${GREEN}[stop-build-check]${NC} Build passed successfully."
exit 0
