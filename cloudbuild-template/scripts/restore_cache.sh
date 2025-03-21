#!/usr/bin/env bash
CACHE_KEY=$( checksum yarn.lock )
restore_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=node_modules-${CACHE_KEY}
restore_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=cypress-cache-${CACHE_KEY}
restore_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=yarn-${CACHE_KEY}
restore_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=yarn-install-state-${CACHE_KEY}
