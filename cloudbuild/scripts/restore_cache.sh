#!/usr/bin/env bash
CACHE_KEY=$( checksum yarn.lock )
restore_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=node_modules-${CACHE_KEY} \
  --key=cypress-cache-${CACHE_KEY} \
  --key=yarn-${CACHE_KEY} \
  --key=yarn-install-state-${CACHE_KEY}
