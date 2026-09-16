---
name: Image Labeler Redux API layer
slug: image-labeler-redux-api-layer
type: system
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
sources_digest: 67742f12abd899accce9eec3b60bd079b195375a33244369e9df70bc7b36d89d
links:
  - to: image-labeler-project-management-ui
    relation: uses
    description: >-
      ProjectsList and ProjectForm components consume the API hooks to fetch
      projects, create new projects, and edit existing ones
  - to: image-labeler-task-labeling-ui
    relation: uses
    description: >-
      Project and Task components use projectApi queries to fetch tasks and
      taskApi mutations to submit label assignments
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
---

<!-- context:generated:start -->

## Summary

Centralized Redux Toolkit Query services for image labeling operations. Five specialized API slices (projectsListApi, projectApi, projectEditApi, projectCreateApi, taskApi) manage server communication via shared gfwBaseQuery, which wraps GFWAPI.fetch and normalizes errors using parseAPIError. Each slice exports auto-generated React hooks (useGetLabellingProjectsListQuery, useGetLabellingProjectTasksQuery, useCreateProjectMutation, useEditProjectMutation, useSetTaskMutation) that handle loading/error/data states without manual Redux dispatch.

## Related

- uses [[image-labeler-project-management-ui]] — ProjectsList and ProjectForm components consume the API hooks to fetch projects, create new projects, and edit existing ones
- uses [[image-labeler-task-labeling-ui]] — Project and Task components use projectApi queries to fetch tasks and taskApi mutations to submit label assignments

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
