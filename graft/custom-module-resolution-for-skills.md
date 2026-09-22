---
name: Custom Module Resolution for Skills
slug: custom-module-resolution-for-skills
type: system
sources:
  - path: libs/skills/src/decode-url/scripts/register-gfw-resolver.mjs
    hash: a2ec8d862fc91a5d40eb4ab79ecb1399d0361b6e95fd5b499eb330ec44171e07
  - path: libs/skills/src/encode-url/scripts/register-gfw-resolver.mjs
    hash: a2ec8d862fc91a5d40eb4ab79ecb1399d0361b6e95fd5b499eb330ec44171e07
sources_digest: d2970a7bdf6e754adbcb999798997187282e51294e564e6c4e32e061645fb0a0
links: []
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

Node.js module resolution hooks that enable consistent import of GFW skills regardless of deployment context. Both encode-url and decode-url scripts use register-gfw-resolver.mjs, which checks two filesystem layouts (distributed dist/ and monorepo source) and redirects imports to the matching bundled entry point.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
