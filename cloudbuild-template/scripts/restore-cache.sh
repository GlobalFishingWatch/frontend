#!/bin/bash

set -euo pipefail

if [ -z "$PROJECT" ] || [ -z "$REPOSITORY" ] || [ -z "$LOCATION" ]; then
  echo "Error: Required environment variables PROJECT, REPOSITORY, and LOCATION must be set"
  exit 1
fi

cache_key=$(cat /workspace/cache-key)

# Function to check if cache exists
check_cache_exists() {
  gcloud artifacts repositories describe ${REPOSITORY} \
    --project=${PROJECT} --location=${LOCATION} 2>/dev/null && \
  gcloud artifacts versions describe ${cache_key} \
    --location=${LOCATION} \
    --project=${PROJECT} \
    --repository=${REPOSITORY} \
    --package=node-modules 2>/dev/null
}

# Function to restore cache with streaming for maximum performance
restore_cache() {
  echo "Cache hit! Restoring node_modules with streaming extraction..."

  # Determine best decompression method available
  if command -v pigz >/dev/null 2>&1; then
    DECOMPRESS_CMD="pigz -dc"
    echo "Using pigz for parallel decompression"
  elif command -v gzip >/dev/null 2>&1; then
    DECOMPRESS_CMD="gzip -dc"
    echo "Using gzip for decompression"
  else
    echo "Warning: No decompression tool found"
    DECOMPRESS_CMD="cat"
  fi

  # Stream download directly to extraction - no temporary file needed
  echo "Downloading and extracting cache..."
  gcloud artifacts generic download \
    --repository=${REPOSITORY} \
    --location=${LOCATION} \
    --project=${PROJECT} \
    --package=node-modules \
    --version=${cache_key} \
    --destination=- 2>/dev/null | \
  ${DECOMPRESS_CMD} | \
  tar -xf - -C /workspace --strip-components=0

  echo "Cache restored successfully!"
}

# Main execution
if check_cache_exists; then
  restore_cache
else
  echo "Cache miss. Will create new cache after install."
fi
