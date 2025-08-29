#!/bin/bash
set -euo pipefail

if [ -z "${PROJECT:-}" ] || [ -z "${REPOSITORY:-}" ] || [ -z "${LOCATION:-}" ]; then
  echo "Error: Required environment variables PROJECT, REPOSITORY, and LOCATION must be set"
  exit 1
fi

cache_key=$(cat /workspace/cache-key)
echo "Using cache key: ${cache_key}"


if gcloud artifacts repositories describe "${REPOSITORY}" \
   --project="${PROJECT}" --location="${LOCATION}" >/dev/null 2>&1; then
  echo "Repository exists, checking for cache..."
  if gcloud artifacts versions describe "${cache_key}" \
     --location="${LOCATION}" \
     --project="${PROJECT}" \
     --repository="${REPOSITORY}" \
     --package=node-modules >/dev/null 2>&1; then
    echo "Cache hit! Restoring node_modules..."

    mkdir -p /workspace/cache
    if ! gcloud artifacts generic download \
      --repository="${REPOSITORY}" \
      --location="${LOCATION}" \
      --project="${PROJECT}" \
      --package=node-modules \
      --version="${cache_key}" \
      --destination=/workspace/cache \
      --quiet; then
      echo "Warning: failed to download cache from Artifact Registry. Continuing without cache."
      exit 0
    fi

    # Prefer zstd cache if present, otherwise fall back to gzip
    cache_file=$(find /workspace/cache -maxdepth 1 -type f -name "*.tar.zst" | head -n 1 || true)
    if [ -z "${cache_file}" ]; then
      cache_file=$(find /workspace/cache -maxdepth 1 -type f \( -name "*.tar.gz" -o -name "*.tgz" \) | head -n 1 || true)
    fi
    if [ -z "${cache_file}" ]; then
      echo "Warning: downloaded cache artifact not found in /workspace/cache. Continuing without cache."
      rm -rf /workspace/cache || true
      exit 0
    fi

    case "${cache_file}" in
      *.tar.zst)
        if ! command -v zstd >/dev/null 2>&1; then
          echo "zstd not found, attempting to install..."
          if ! bash -lc "export DEBIAN_FRONTEND=noninteractive; apt-get update -qq && apt-get install -y -qq --no-install-recommends zstd"; then
            echo "Warning: zstd installation failed. Continuing without cache."
            rm -rf /workspace/cache || true
            exit 0
          fi
        fi
        echo "Extracting zstd cache..."
        zstd -d -T0 -q "${cache_file}" -c | tar -xf -
        ;;
      *.tar.gz|*.tgz)
        echo "Extracting gzip cache..."
        tar -xzf "${cache_file}"
        ;;
      *)
        echo "Warning: Unknown cache format: ${cache_file}. Continuing without cache."
        rm -rf /workspace/cache || true
        exit 0
        ;;
    esac
    rm -rf /workspace/cache || true
    echo "Cache restored successfully!"
  else
    echo "Cache miss. Will create new cache after install."
  fi
else
  echo "Repository does not exist. Please ask an admin to generate the repository"
  echo "Cache miss. Will create new cache after install."
fi
