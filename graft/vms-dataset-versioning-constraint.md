---
name: VMS Dataset Versioning Constraint
slug: vms-dataset-versioning-constraint
type: concept
sources:
  - path: apps/platform/config/map/dataviews.ts
    hash: 983973c427a4bf7b4723e89070d937f741ec73a6a9226dde63dcc5287cdfe2e9
  - path: apps/platform/data/map/dataviews.ts
    hash: e71bb074f453f607456eca0fa1eb3b93477b7c58785177b67e03b844dff17850
sources_digest: 22473fd1a4915b473f84d6895fd3166f3c109881bdc8384602c6379ad8cf57b8
links:
  - to: map-dataview-registry
    relation: validates
    description: >-
      Registry must verify that Panama VMS slug matches expected v-4-1 version
      to catch versioning drift
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Panama's VMS dataset publishes independently on v-4-1 schedule, unlike other datasets versioned via PIPE_DATASET_VERSION constant. If API-returned slug mismatches the hardcoded v-4-1 identifier in dataview registry, vessels silently fall back to global templates and lose private event datasets. Requires manual updates when Panama publishes.

## Related

- validates [[map-dataview-registry]] — Registry must verify that Panama VMS slug matches expected v-4-1 version to catch versioning drift

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
