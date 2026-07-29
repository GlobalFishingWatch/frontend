import { createFileRoute } from '@tanstack/react-router'

import WorkspaceLayout from 'features/map/workspace/WorkspaceLayout'

export const Route = createFileRoute('/_platform/_map/map/$category/$workspaceId')({
  component: WorkspaceLayout,
})
