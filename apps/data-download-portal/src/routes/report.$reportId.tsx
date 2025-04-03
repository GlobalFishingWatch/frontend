import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const Report = lazy(() => import('../pages/report/report'))

export const Route = createFileRoute('/report/$reportId')({
  component: Report,
})
