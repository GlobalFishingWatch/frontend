#!/usr/bin/env bash
save_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=node_modules-$( checksum yarn.lock ) \
  --path=./node_modules \
  --no-clobber
save_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=yarn-$( checksum yarn.lock ) \
  --path=.yarn/cache \
  --no-clobber
save_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=yarn-install-state-$( checksum yarn.lock ) \
  --path=.yarn/install-state.gz \
  --no-clobber
