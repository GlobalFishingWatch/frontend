#!/bin/bash

set -euo pipefail

if [ -z "$PROJECT" ] || [ -z "$REPOSITORY" ] || [ -z "$LOCATION" ]; then
  echo "Error: Required environment variables PROJECT, REPOSITORY, and LOCATION must be set"
  exit 1
fi

cache_key=$(cat /workspace/cache-key)
echo "Checking if cache version already exists..."

# Check if cache already exists
if gcloud artifacts versions describe ${cache_key} \
   --location=${LOCATION} \
   --project=${PROJECT} \
   --repository=${REPOSITORY} \
   --package=node-modules 2>/dev/null; then
  echo "Cache version already exists, skipping upload."
  exit 0
fi

echo "Cache version does not exist. Saving caches to Artifact Registry..."

# Determine best compression method available
if command -v pigz >/dev/null 2>&1; then
  COMPRESS_CMD="pigz --fast"
  echo "Using pigz for parallel compression"
elif command -v gzip >/dev/null 2>&1; then
  COMPRESS_CMD="gzip"
  echo "Using gzip for compression"
else
  echo "Warning: No compression tool found, using uncompressed tar"
  COMPRESS_CMD="cat"
fi

# Create and upload cache in one pipeline
# Exclude unnecessary files to reduce size
tar -czf - \
  --exclude='node_modules/.cache' \
  --exclude='node_modules/.yarn-integrity' \
  --exclude='**/node_modules/.cache' \
  --exclude='**/*.log' \
  --exclude='**/*.tmp' \
  --use-compress-program="$COMPRESS_CMD" \
  node_modules \
  /builder/home/.cache \
  .yarn/cache \
  .yarn/install-state.gz 2>/dev/null | \
gcloud artifacts generic upload \
  --location=${LOCATION} \
  --project=${PROJECT} \
  --repository=${REPOSITORY} \
  --source=- \
  --package=node-modules \
  --version=${cache_key}

echo "Cache upload completed successfully."
