---
name: Workspace Panel Organization
slug: workspace-panel-organization
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/Section.tsx
    hash: d44c5247f51206c8008dd4f7401d55dd1407013778784d8a7f088a905ba782b5
sources_digest: 664e480e8b3a5d96e4850d23a7a9ca6269b7be1ad0fdc25de7f77ff83fe76d71
links:
  - to: workspace-dataview-instance-management
    relation: uses
    description: >-
      Uses replaceQueryParams hook to persist collapsed/expanded state to URL
      query string
generator:
  version: 1
covers:
  - symbol: SectionProps
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/Section.tsx:L18-L26'
  - symbol: Section
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/Section.tsx:L28-L98'
---

<!-- context:generated:start -->

## Summary

Section component that renders collapsible card containers for organizing workspace content into logical groups (dataview categories). Manages expand/collapse state via Redux collapsedSections list and URL query parameters, with automatic expansion during screenshot modal to show all content. Respects inert attribute to disable interaction on collapsed sections.

## Related

- uses [[workspace-dataview-instance-management]] — Uses replaceQueryParams hook to persist collapsed/expanded state to URL query string

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
