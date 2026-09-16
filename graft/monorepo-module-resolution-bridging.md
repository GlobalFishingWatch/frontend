---
name: Monorepo Module Resolution Bridging
slug: monorepo-module-resolution-bridging
type: concept
sources:
  - path: libs/skills/src/decode-url/scripts/register-gfw-resolver.mjs
    hash: a2ec8d862fc91a5d40eb4ab79ecb1399d0361b6e95fd5b499eb330ec44171e07
  - path: libs/skills/src/encode-url/scripts/register-gfw-resolver.mjs
    hash: a2ec8d862fc91a5d40eb4ab79ecb1399d0361b6e95fd5b499eb330ec44171e07
sources_digest: d2970a7bdf6e754adbcb999798997187282e51294e564e6c4e32e061645fb0a0
links:
  - to: custom-module-resolution-for-skills
    relation: implements
    description: Both register-gfw-resolver modules implement this pattern
generator:
  version: 1
covers:
  - symbol: resolve
    kind: method
    at: 'libs/skills/src/decode-url/scripts/register-gfw-resolver.mjs:L18-L23'
  - symbol: resolve
    kind: method
    at: 'libs/skills/src/encode-url/scripts/register-gfw-resolver.mjs:L18-L23'
---

<!-- context:generated:start -->

## Summary

Custom Node.js module resolution hooks enable imports of `@globalfishingwatch/skills/<skillName>` to resolve to actual bundled code regardless of deployment context (packaged vs. monorepo source). The resolver checks two filesystem layouts and short-circuits after finding a match, allowing consistent import syntax across development and production.

## Related

- implements [[custom-module-resolution-for-skills]] — Both register-gfw-resolver modules implement this pattern

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
