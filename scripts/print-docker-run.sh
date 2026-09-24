#!/usr/bin/env bash
# Prints the docker run command for an image built with print-docker-build.sh.
# Usage: ./scripts/print-docker-run.sh [development|staging|production] [port]

set -euo pipefail

ENV_NAME="${1:-development}"
PORT="${2:-3003}"

echo "docker run -d --name platform-local -p ${PORT}:3000 platform:${ENV_NAME}"
