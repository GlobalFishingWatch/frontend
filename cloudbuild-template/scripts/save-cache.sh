#!/bin/bash
set -euo pipefail

if [ -z "${PROJECT:-}" ] || [ -z "${REPOSITORY:-}" ] || [ -z "${LOCATION:-}" ]; then
  echo "Error: Required environment variables PROJECT, REPOSITORY, and LOCATION must be set"
  exit 1
fi

cache_key=$(cat /workspace/cache-key)
echo "Checking if cache version already exists..."
if ! gcloud artifacts versions describe "${cache_key}" \
   --location="${LOCATION}" \
   --project="${PROJECT}" \
   --repository="${REPOSITORY}" \
   --package=node-modules >/dev/null 2>&1; then
  echo "Cache version does not exist. Saving caches to Artifact Registry..."

  # Prefer zstd; install only if needed
  if ! command -v zstd >/dev/null 2>&1; then
    echo "zstd not found, attempting to install..."
    if ! bash -lc "export DEBIAN_FRONTEND=noninteractive; apt-get update -qq && apt-get install -y -qq --no-install-recommends zstd"; then
      echo "Warning: zstd installation failed. Will use gzip."
    fi
  fi

  if command -v zstd >/dev/null 2>&1; then
    echo "Using zstd for faster compression..."
    tar -cf - \
      node_modules \
      /builder/home/.cache \
      .yarn/cache \
      .yarn/install-state.gz | zstd -T0 -5 -q -o /workspace/cache.tar.zst
    cache_ext="zst"
  else
    echo "zstd not available; falling back to gzip"
    tar -czf /workspace/cache.tar.gz \
      node_modules \
      /builder/home/.cache \
      .yarn/cache \
      .yarn/install-state.gz
    cache_ext="gz"
  fi

  if ! gcloud artifacts generic upload \
    --location="${LOCATION}" \
    --project="${PROJECT}" \
    --repository="${REPOSITORY}" \
    --source=/workspace/cache.tar.${cache_ext} \
    --package=node-modules \
    --version="${cache_key}"; then
    echo "Warning: failed to upload cache. Continuing without saving cache."
  fi
  rm -f /workspace/cache.tar.zst /workspace/cache.tar.gz || true
  echo "Cache saved successfully!"
else
  echo "Cache version already exists, skipping upload."
fi
