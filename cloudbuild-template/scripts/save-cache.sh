#!/bin/bash

if [ -z "$PROJECT" ] || [ -z "$REPOSITORY" ] || [ -z "$LOCATION" ]; then
  echo "Error: Required environment variables PROJECT, REPOSITORY, and LOCATION must be set"
  exit 1
fi

cache_key=$(cat /workspace/cache-key)
echo "Checking if cache version already exists..."
if ! gcloud artifacts versions describe ${cache_key} \
   --location=${LOCATION} \
   --project=${PROJECT} \
   --repository=${REPOSITORY} \
   --package=node-modules 2>/dev/null; then
  echo "Cache version does not exist. Saving caches to Artifact Registry..."

  # Use pigz for faster compression if available
  if command -v pigz >/dev/null 2>&1; then
    echo "Using pigz for faster compression..."
    tar -cf - \
      node_modules \
      /builder/home/.cache \
      .yarn/cache \
      .yarn/install-state.gz | pigz -9 > /workspace/cache.tar.gz
  else
    echo "Using standard gzip compression..."
    tar -czf /workspace/cache.tar.gz \
      node_modules \
      /builder/home/.cache \
      .yarn/cache \
      .yarn/install-state.gz
  fi

  gcloud artifacts generic upload \
    --location=${LOCATION} \
    --project=${PROJECT} \
    --repository=${REPOSITORY} \
    --source=/workspace/cache.tar.gz \
    --package=node-modules \
    --version=${cache_key}
  rm /workspace/cache.tar.gz
  echo "Cache saved successfully!"
else
  echo "Cache version already exists, skipping upload."
fi
