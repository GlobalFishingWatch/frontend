import { createLazyFileRoute } from '@tanstack/react-router'

import Projects from '../features/projects-list/ProjectsList'

export const Route = createLazyFileRoute('/')({
  component: Projects,
})
