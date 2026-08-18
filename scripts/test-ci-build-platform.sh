#!/usr/bin/env bash
# Mirrors .github/actions/build-and-push for platform locally.
# Default: build + load into local Docker (no push). Use --push to match CI fully.
#
# Usage:
#   ./scripts/test-ci-build-platform.sh
#   ./scripts/test-ci-build-platform.sh --push
#   ./scripts/test-ci-build-platform.sh --env staging
#   NX_CLOUD_ACCESS_TOKEN=... ./scripts/test-ci-build-platform.sh
#
# Prerequisites: docker (buildx), jq, python3 + PyYAML
# Optional: gcloud (to fetch SENTRY_AUTH_TOKEN from Secret Manager)

set -euo pipefail

APP=platform
ENV_NAME=development
PUSH=false
SKIP_SECRETS=false

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

usage() {
  cat <<EOF
Usage: $(basename "$0") [options]

Build the platform Docker image the same way GitHub Actions does
(.github/actions/build-and-push + root Dockerfile).

Options:
  --env <name>     development (default) | staging | production
  --push           Push to Artifact Registry (CI default). Without this, loads locally.
  --skip-secrets   Do not fetch Secret Manager secrets (Sentry upload will be skipped)
  -h, --help       Show this help

Environment:
  NX_CLOUD_ACCESS_TOKEN   Optional; empty is fine for a local smoke build
  SENTRY_AUTH_TOKEN       Used if set; otherwise fetched from GCP when not --skip-secrets
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)
      ENV_NAME="${2:?--env requires a value}"
      shift 2
      ;;
    --push)
      PUSH=true
      shift
      ;;
    --skip-secrets)
      SKIP_SECRETS=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

case "$ENV_NAME" in
  development) IMAGE_SUFFIX=dev; CONFIG=.github/apps/development.yml ;;
  staging)     IMAGE_SUFFIX=sta; CONFIG=.github/apps/staging.yml ;;
  production)  IMAGE_SUFFIX=pro; CONFIG=.github/apps/production.yml ;;
  *)
    echo "Unknown --env: $ENV_NAME (use development|staging|production)" >&2
    exit 1
    ;;
esac

IMAGE="us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/${APP}:latest-${IMAGE_SUFFIX}"
LOCAL_TAG="${APP}:ci-local-${ENV_NAME}"
COMMIT_SHA="$(git rev-parse HEAD)"

for cmd in docker jq python3; do
  command -v "$cmd" >/dev/null || { echo "Missing required command: $cmd" >&2; exit 1; }
done

python3 -c 'import yaml' 2>/dev/null || {
  echo "Missing PyYAML. Install with: pip3 install pyyaml" >&2
  exit 1
}

echo "==> Config: $CONFIG"
echo "==> App:    $APP"
echo "==> Commit: $COMMIT_SHA"

APP_CONFIG=$(python3 -c "
import yaml, json, sys
config = yaml.safe_load(open('${CONFIG}'))
app = config.get('${APP}')
if not app:
  sys.exit(f'Unknown app: ${APP} — no config in ${CONFIG}')
print(json.dumps(app))
")

TARGET=$(echo "$APP_CONFIG" | jq -r '.target')
echo "==> Target: $TARGET"

BUILD_ARGS=(
  --build-arg "APP_NAME=${APP}"
  --build-arg "COMMIT_SHA=${COMMIT_SHA}"
)
while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  BUILD_ARGS+=(--build-arg "$line")
done < <(echo "$APP_CONFIG" | jq -r '.build.env_vars | to_entries[] | "\(.key)=\(.value)"')

# Fetch build secrets from Secret Manager (same mappings as CI)
if [[ "$SKIP_SECRETS" == false ]]; then
  while IFS= read -r mapping; do
    [[ -z "$mapping" ]] && continue
    name="${mapping%%:*}"
    resource="${mapping#*:}"
    # resource: projects/PROJECT/secrets/NAME/versions/VERSION
    if [[ -n "${!name:-}" ]]; then
      echo "==> Using existing env for secret: $name"
      continue
    fi
    if ! command -v gcloud >/dev/null; then
      echo "gcloud not found; set $name or pass --skip-secrets" >&2
      exit 1
    fi
    secret_name=$(echo "$resource" | sed -E 's|.*/secrets/([^/]+)/.*|\1|')
    project=$(echo "$resource" | sed -E 's|projects/([^/]+)/.*|\1|')
    version=$(echo "$resource" | sed -E 's|.*/versions/([^/]+)$|\1|')
    echo "==> Fetching secret: $name ($secret_name@$project)"
    export "$name"="$(gcloud secrets versions access "$version" --secret="$secret_name" --project="$project")"
  done < <(echo "$APP_CONFIG" | jq -r '(.build.secrets // {}) | to_entries[] | "\(.key):\(.value)"')
else
  echo "==> Skipping Secret Manager (--skip-secrets)"
fi

# NX token is always mounted in the Dockerfile; empty is ok for a smoke build
export NX_CLOUD_ACCESS_TOKEN="${NX_CLOUD_ACCESS_TOKEN:-}"

SECRET_FLAGS=(
  --secret id=NX_CLOUD_ACCESS_TOKEN,env=NX_CLOUD_ACCESS_TOKEN
)
while IFS= read -r name; do
  [[ -z "$name" ]] && continue
  if [[ -n "${!name:-}" ]]; then
    SECRET_FLAGS+=(--secret "id=${name},env=${name}")
  else
    echo "==> Warning: build secret $name is empty (Sentry upload may be skipped)"
  fi
done < <(echo "$APP_CONFIG" | jq -r '(.build.secrets // {}) | keys[]')

OUTPUT_FLAGS=(--load --tag "$LOCAL_TAG")
if [[ "$PUSH" == true ]]; then
  echo "==> Configuring Docker for Artifact Registry"
  gcloud auth configure-docker us-central1-docker.pkg.dev --quiet
  OUTPUT_FLAGS=(--push --tag "$IMAGE")
fi

echo "==> Building (Docker BuildKit)…"
DOCKER_BUILDKIT=1 docker buildx build \
  --target "$TARGET" \
  "${OUTPUT_FLAGS[@]}" \
  "${BUILD_ARGS[@]}" \
  "${SECRET_FLAGS[@]}" \
  -f Dockerfile \
  .

echo
if [[ "$PUSH" == true ]]; then
  echo "Pushed: $IMAGE"
else
  echo "Loaded locally: $LOCAL_TAG"
  echo "Run:  docker run --rm -p 3000:3000 $LOCAL_TAG"
fi
