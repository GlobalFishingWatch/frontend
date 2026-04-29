import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/$category/$workspaceId')({
  component: lazyRouteComponent(() => import('features/workspace/WorkspaceLayout')),
})
