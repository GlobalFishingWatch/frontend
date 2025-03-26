#!/bin/bash

if [ -z "$PROJECT" ] || [ -z "$REPOSITORY" ] || [ -z "$LOCATION" ]; then
  echo "Error: Required environment variables PROJECT, REPOSITORY, and LOCATION must be set"
  exit 1
fi

cache_key=$(cat /workspace/cache-key)
if gcloud artifacts repositories describe ${REPOSITORY} \
   --project=${PROJECT} --location=${LOCATION} 2>/dev/null; then
  echo "Repository exists, checking for cache..."
  if gcloud artifacts versions describe ${cache_key} \
     --location=${LOCATION} \
     --project=${PROJECT} \
     --repository=${REPOSITORY} \
     --package=node-modules 2>/dev/null; then
    echo "Cache hit! Restoring node_modules..."
    mkdir -p /workspace/tmp
    gcloud artifacts generic download \
      --repository=${REPOSITORY} \
      --location=${LOCATION} \
      --project=${PROJECT} \
      --package=node-modules \
      --version=${cache_key} \
      --destination=/workspace/tmp \
      && mv /workspace/tmp/* /workspace/cache.tar.gz \
      && rm -rf /workspace/tmp \
      && tar -xzf /workspace/cache.tar.gz -C /workspace \
      && rm /workspace/cache.tar.gz
  else
    echo "Cache miss. Will create new cache after install."
  fi
else
  echo "Repository does not exist. Please ask and admin to generate the repository"
  echo "Cache miss. Will create new cache after install."
fi
