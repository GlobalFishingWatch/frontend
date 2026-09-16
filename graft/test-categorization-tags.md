---
name: Test Categorization Tags
slug: test-categorization-tags
type: file
sources:
  - path: apps/platform-e2e/src/tags.ts
    hash: 3d3c2b4dd73ffdd751cb1a25ee196cbae5576becd9024e7d6f37f58fed397e11
sources_digest: 422b55e1c11f4a3cc15a24081ae4583fc7857b71a1cfcfaaca336ac18ea90ee1
links:
  - to: e2e-test-suite
    relation: uses
    description: >-
      Test cases decorate themselves with tag constants to control which
      scenarios execute in different CI stages or local runs
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Defines a constant TAGS object with SMOKE, EXTENDED, and REGRESSION Cucumber-style tag identifiers (as const string literals) that enable fine-grained test selection in CI/CD pipelines and local test runners.

## Related

- uses [[e2e-test-suite]] — Test cases decorate themselves with tag constants to control which scenarios execute in different CI stages or local runs

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
