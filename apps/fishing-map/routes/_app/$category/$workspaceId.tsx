import { createFileRoute } from '@tanstack/react-router'

import WorkspaceLayout from 'features/workspace/WorkspaceLayout'

export const Route = createFileRoute('/_app/$category/$workspaceId')({
  component: WorkspaceLayout,
})
