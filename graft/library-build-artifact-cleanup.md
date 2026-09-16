---
name: Library build artifact cleanup
slug: library-build-artifact-cleanup
type: file
sources:
  - path: scripts/clean-lib-dist.sh
    hash: 705688b4880ccb77cb5a39fa0056cd3d7af6f4ec0d04c11dceed89d9f2d1dc07
sources_digest: fe5151ed6bda721739b3cb0a8f970a48cc863af4fe7915e14cfb03ee0e3a17d8
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Bash script automating removal of TypeScript build artifacts (dist directories and tsconfig.tsbuildinfo files) from /libs subdirectories. Locates workspace root, iterates through library directories, tracks item count for feedback. Uses bash native operations (rm -rf, rm -f) without external dependencies. Silently succeeds if no artifacts exist, preventing CI pipeline failures, but assumes monorepo structure with libraries directly under /libs/.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
