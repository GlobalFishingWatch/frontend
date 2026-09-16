---
name: Environment Resolution
slug: environment-resolution
type: file
sources:
  - path: libs/api-client/src/utils/env.ts
    hash: 39c64bd2fe921cbbfc6b3fe5587f98832725ca74df0f728f7ab93431dd0e4679
sources_digest: d1435777e9518b589be050bbdd1374c19206077a0b2f1bd6b53d50375d5aad9a
links: []
generator:
  version: 1
covers:
  - symbol: getEnv
    kind: function
    at: 'libs/api-client/src/utils/env.ts:L3-L15'
---

<!-- context:generated:start -->

## Summary

Isomorphic environment variable accessor implementing three-tier lookup: Vite build-time variables, Node.js process.env, and fallback defaults. Safely coexists in browser and server contexts via defensive typeof checks on process object, enabling same code to run in both frontend and backend without conditional compilation.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
