#!/bin/bash

if [ -z "$PROJECT" ] || [ -z "$REPOSITORY" ] || [ -z "$LOCATION" ]; then
  echo "Error: Required environment variables PROJECT, REPOSITORY, and LOCATION must be set"
  exit 1
fi

cache_key=$(cat /workspace/cache-key)
echo "Using cache key: ${cache_key}"

if gcloud artifacts repositories describe ${REPOSITORY} \
   --project=${PROJECT} --location=${LOCATION} 2>/dev/null; then
  echo "Repository exists, checking for cache..."
  if gcloud artifacts versions describe ${cache_key} \
     --location=${LOCATION} \
     --project=${PROJECT} \
     --repository=${REPOSITORY} \
     --package=node-modules 2>/dev/null; then
    echo "Cache hit! Restoring node_modules..."

    # Use faster extraction with pigz if available, fallback to tar
    if command -v pigz >/dev/null 2>&1; then
      echo "Using pigz for faster extraction..."
      gcloud artifacts generic download \
        --repository=${REPOSITORY} \
        --location=${LOCATION} \
        --project=${PROJECT} \
        --package=node-modules \
        --version=${cache_key} \
        --destination=/workspace/cache.tar.gz \
        --quiet \
        && pigz -dc /workspace/cache.tar.gz | tar -xf - \
        && rm /workspace/cache.tar.gz
    else
      echo "Using standard tar extraction..."
      gcloud artifacts generic download \
        --repository=${REPOSITORY} \
        --location=${LOCATION} \
        --project=${PROJECT} \
        --package=node-modules \
        --version=${cache_key} \
        --destination=/workspace/cache.tar.gz \
        --quiet \
        && tar -xzf /workspace/cache.tar.gz \
        && rm /workspace/cache.tar.gz
    fi

    echo "Cache restored successfully!"
  else
    echo "Cache miss. Will create new cache after install."
  fi
else
  echo "Repository does not exist. Please ask an admin to generate the repository"
  echo "Cache miss. Will create new cache after install."
fi
