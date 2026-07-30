import { createFileRoute } from '@tanstack/react-router'

import WorkspaceLayout from 'features/_map/workspace/WorkspaceLayout'

export const Route = createFileRoute('/_platform/_map/map/$category/$workspaceId')({
  component: WorkspaceLayout,
})
