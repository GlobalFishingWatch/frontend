---
name: Track Labeler Test Infrastructure
slug: track-labeler-test-infrastructure
type: system
sources:
  - path: apps/track-labeler/src/features/vessels/__mocks__/selectedtracks.mock.ts
    hash: d02f96e307f201658bd92cd97106fd64e6ba914f4206410c02ccec58ddcea40d
  - path: apps/track-labeler/src/features/vessels/__mocks__/vessels.slice.ts
    hash: 9c6798f0e97d97556b6e05ad35eb2de8e1ae0110b1bc21564433a0299ddcbb2b
  - path: apps/track-labeler/src/routes/__mocks__/routes.selectors.ts
    hash: 30abbc7318aaa734733c5b1e5d62ea3a2951edb3626164fed67a2b326f1e5ed8
  - path: apps/track-labeler/src/routes/routes.selectors.test.ts
    hash: 48bfecb4e14e7f3a93d1edf3024f7e3485c9cfce0a50a1cab073271d805a705e
  - path: apps/track-labeler/src/setupTests.ts
    hash: b4fbf1982443c640d761d82b98f02e104be222689664a522a5e1c4ba1854e324
sources_digest: 54e2052aa8388c251a1c55d527e960dfb485612a1a16cd8e01431988667f00a4
links:
  - to: workspace-and-project-configuration
    relation: validates
    description: >-
      Test for selectProjectColors verifies color merging logic between global
      defaults and project-specific overrides
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Jest configuration and mock modules for testing track-labeler components and logic. Provides mock Redux selectors and realistic vessel tracking data fixtures.

## Related

- validates [[workspace-and-project-configuration]] — Test for selectProjectColors verifies color merging logic between global defaults and project-specific overrides

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
