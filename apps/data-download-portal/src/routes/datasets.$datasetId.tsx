import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const Dataset = lazy(() => import('../pages/dataset/dataset'))

export const Route = createFileRoute('/datasets/$datasetId')({
  component: Dataset,
})
