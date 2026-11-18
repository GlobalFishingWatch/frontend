#!/usr/bin/env bash
# Prints the commands that build the platform image for a given environment:
# the Nx build with that environment's env, then the docker build that packages its output.
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
lines = ['NODE_ENV=production \\\\']
lines += [f'{k}={v} \\\\' for k, v in env.items()]
lines.append('  pnpm exec nx run platform:build')
lines.append('')
lines += ['docker build \\\\', f'  --target {app[\"target\"]} \\\\', '  --build-arg APP_NAME=platform \\\\']
lines.append(f'  --build-arg VITE_WORKSPACE_ENV={env.get(\"VITE_WORKSPACE_ENV\", \"\")} \\\\')
lines.append('  -t platform:$ENV_NAME .')
print('\\n'.join(lines))
"
