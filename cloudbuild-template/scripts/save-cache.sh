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

# Create a temporary cache file
temp_cache="/tmp/cache-${cache_key}.tar.gz"

echo "Creating gzipped tar archive of node_modules and caches..."

# Create gzipped tar archive with proper exclusions
tar -czf "${temp_cache}" \
  --exclude='node_modules/.cache' \
  --exclude='node_modules/.yarn-integrity' \
  --exclude='**/node_modules/.cache' \
  --exclude='**/*.log' \
  --exclude='**/*.tmp' \
  --exclude='**/*.tmp.*' \
  --exclude='**/.DS_Store' \
  --exclude='**/Thumbs.db' \
  node_modules \
  .yarn/cache \
  .yarn/install-state.gz

# Verify the archive was created successfully
if [ ! -f "${temp_cache}" ] || [ ! -s "${temp_cache}" ]; then
  echo "Error: Failed to create cache archive"
  exit 1
fi

echo "Cache archive created successfully. Uploading to Artifact Registry..."

# Upload the cache file
if gcloud artifacts generic upload \
  --location=${LOCATION} \
  --project=${PROJECT} \
  --repository=${REPOSITORY} \
  --source="${temp_cache}" \
  --package=node-modules \
  --version=${cache_key}; then
  echo "Cache upload completed successfully."
  rm -f "${temp_cache}"
else
  echo "Error: Failed to upload cache"
  rm -f "${temp_cache}"
  exit 1
fi
