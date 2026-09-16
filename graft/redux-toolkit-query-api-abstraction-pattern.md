---
name: Redux Toolkit Query API abstraction pattern
slug: redux-toolkit-query-api-abstraction-pattern
type: concept
sources:
  - path: apps/image-labeler/src/api/base.ts
    hash: 3efb7b49ef463f0b2bf0150cf2b89b543c928abb576a597cb4b974ce790d0c88
  - path: apps/image-labeler/src/api/index.ts
    hash: d827267c88a5ce2d04ae78056ae42de6c9edce1f67fd6d6f6c9519ff1d0a8473
  - path: apps/image-labeler/src/api/project-create.ts
    hash: 736dae788bc2ac6d92c7d9ff79b106fdd2ecd16b18c531f1ab14ced2be4e4882
  - path: apps/image-labeler/src/api/project-edit.ts
    hash: 7409ff6092020baa9b8c3f68cc7193d3ee7ce9ad82e7a0f3733aff38a14cf9bc
  - path: apps/image-labeler/src/api/project.ts
    hash: 4076916f9eaddd613884ba60f70b5f277777b4e784fdcdf50aa401644f00b984
  - path: apps/image-labeler/src/api/projects-list.ts
    hash: 98ac6e46da99423a20951208902b3148683894ca6dbe11b12ec2466ae9479ddc
  - path: apps/image-labeler/src/api/task.ts
    hash: 57aadfcaa3c69494e76b63bb1261e469712368bfda4db8111852a51b9150d16a
  - path: apps/image-labeler/src/main.tsx
    hash: fa949cc50c302eea780c318aee842f3a04c7f3913526c314dca27f9ccdfe2db2
sources_digest: c0ea44872c092a032ca9ab5de59e8b671d8b639200999fb1fe26949f9d12ca0f
links: []
generator:
  version: 1
covers:
  - symbol: gfwBaseQuery
    kind: function
    at: 'apps/image-labeler/src/api/base.ts:L6-L33'
  - symbol: LabellingProjectsApiParams
    kind: type
    at: 'apps/image-labeler/src/api/project.ts:L5-L8'
  - symbol: LabellingProjectsByIdApiParams
    kind: type
    at: 'apps/image-labeler/src/api/project.ts:L10-L13'
  - symbol: TaskParams
    kind: type
    at: 'apps/image-labeler/src/api/task.ts:L5-L9'
  - symbol: Register
    kind: interface
    at: 'apps/image-labeler/src/main.tsx:L19-L21'
---

<!-- context:generated:start -->

## Summary

Consistent server-state management across image-labeler. gfwBaseQuery wraps GFWAPI.fetch with error normalization via parseAPIError, serving as the base query for all API slices. Each slice (projectsListApi, projectApi, projectEditApi, projectCreateApi, taskApi) defines typed endpoints that auto-generate React hooks (useGetLabellingProjectsListQuery, useCreateProjectMutation, etc.). Hooks handle loading/error/data states declaratively, eliminating manual Redux dispatch logic in components. Mutation hooks enable optimistic updates and side effects, with POST/PATCH/GET routed through the base query configuration.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
