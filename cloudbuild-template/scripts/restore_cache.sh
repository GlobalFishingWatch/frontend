#!/usr/bin/env bash
restore_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=node_modules-$( checksum yarn.lock )
restore_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=yarn-$( checksum yarn.lock )
restore_cache \
  --bucket=gs://frontend-ui-cache-dependencies \
  --key=yarn-install-state-$( checksum yarn.lock )
