#!/usr/bin/env bash
CACHE_KEY=$( checksum yarn.lock )
save_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=node_modules-${CACHE_KEY} \
  --path=./node_modules \
  --no-clobber &
save_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=cypress-cache-${CACHE_KEY} \
  --path=/builder/home/.cache \
  --no-clobber &
save_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=yarn-${CACHE_KEY} \
  --path=.yarn/cache \
  --no-clobber &
save_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=yarn-install-state-${CACHE_KEY} \
  --path=.yarn/install-state.gz \
  --no-clobber &
wait
