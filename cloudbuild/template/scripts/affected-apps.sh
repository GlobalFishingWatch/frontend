#!/bin/bash
apt-get update && apt-get install -y git jq

cat > /tmp/package-template.jq <<'TEMPLATE_EOF'
{
  name: "@globalfishingwatch/nx",
  version: "0.0.1",
  repository: "git@github.com:GlobalFishingWatch/frontend.git",
  license: "MIT",
  author: "satellitestudio <contact@satellitestud.io>",
  private: true,
  scripts: {
    affected: ("node scripts/nx-minimal.js \"npx " + $affected_script + "\""),
    "affected:libs": ("node scripts/nx-minimal.js \"npx " + $affected_libs_script + "\"")
  },
  dependencies: {
    nx: $nx_version
  }
}
TEMPLATE_EOF

NX_VERSION=$(jq -r '.devDependencies.nx // .dependencies.nx' package.json) && \
AFFECTED_SCRIPT=$(jq -r '.scripts.affected' package.json) && \
AFFECTED_LIBS_SCRIPT=$(jq -r '.scripts."affected:libs"' package.json) && \
jq -n \
  --arg nx_version "$NX_VERSION" \
  --arg affected_script "$AFFECTED_SCRIPT" \
  --arg affected_libs_script "$AFFECTED_LIBS_SCRIPT" \
  -f /tmp/package-template.jq > package.json

npm install && npm run affected
