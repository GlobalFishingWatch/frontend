#!/usr/bin/env bash
# Prints the docker build command for platform in a given environment.
# Usage: ./scripts/print-docker-build.sh [development|staging|production]

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

ENV_NAME="${1:-development}"
CONFIG=".github/apps/${ENV_NAME}.yml"
[[ -f "$CONFIG" ]] || { echo "Unknown environment: $ENV_NAME (use development|staging|production)" >&2; exit 1; }

python3 -c "
import yaml
app = yaml.safe_load(open('$CONFIG'))['platform']
lines = ['docker build \\\\', f'  --target {app[\"target\"]} \\\\', '  --build-arg APP_NAME=platform \\\\']
lines += [f'  --build-arg {k}={v} \\\\' for k, v in app['build']['env_vars'].items()]
lines.append('  -t platform:$ENV_NAME .')
print('\n'.join(lines))
"
