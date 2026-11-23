#!/usr/bin/env bash
# Prints the build commands for platform in a given environment.
# Usage: ./scripts/print-docker-build.sh [development|staging|production]

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

ENV_NAME="${1:-development}"
CONFIG=".github/apps/${ENV_NAME}.yml"
[[ -f "$CONFIG" ]] || { echo "Unknown environment: $ENV_NAME (use development|staging|production)" >&2; exit 1; }

python3 -c "
import yaml
app = yaml.safe_load(open('$CONFIG'))['platform']
env = app['build']['env_vars']
lines = [f'{k}={v} \\\\' for k, v in env.items()]
lines.append('NODE_ENV=production pnpm nx run platform:build')
lines += ['docker build \\\\', f'  --target {app[\"target\"]} \\\\', '  --build-arg APP_NAME=platform \\\\']
lines.append(f'  --build-arg VITE_WORKSPACE_ENV={env.get(\"VITE_WORKSPACE_ENV\", \"\")} \\\\')
lines.append('  -t platform:$ENV_NAME .')
print('\n'.join(lines))
"
