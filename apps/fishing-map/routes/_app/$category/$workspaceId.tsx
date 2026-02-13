import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const WorkspaceLayout = lazy(() => import('features/workspace/WorkspaceLayout'))

export const Route = createFileRoute('/_app/$category/$workspaceId')({
  component: WorkspaceLayout,
})
