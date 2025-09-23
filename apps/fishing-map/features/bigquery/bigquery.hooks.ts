import { useState } from 'react'
import { useSelector } from 'react-redux'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import type { Dataset } from '@globalfishingwatch/api-types'
import type { FourwingsAggregationOperation } from '@globalfishingwatch/deck-layers'

import { useAppDispatch } from 'features/app/app.hooks'
import {
  getBigQuery4WingsDataviewInstance,
  getBigQueryEventsDataviewInstance,
} from 'features/dataviews/dataviews.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

import type { CreateBigQueryDataset } from './bigquery.slice'
import {
  createBigQueryDatasetThunk,
  fetchBigQueryRunCostThunk,
  selectCreationStatus,
  selectRunCost,
  selectRunCostStatus,
  setBigQueryMode,
} from './bigquery.slice'

export function useBigQueryModal() {
  const dispatch = useAppDispatch()
  const runCost = useSelector(selectRunCost)
  const runCostStatus = useSelector(selectRunCostStatus)
  const creationStatus = useSelector(selectCreationStatus)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()

  const [runCostChecked, setRunCostChecked] = useState(false)
  const [createAsPublic, setCreateAsPublic] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  const onRunCostClick = async () => {
    setRunCostChecked(false)
    if (error) {
      setError('')
    }
    const action = await dispatch(fetchBigQueryRunCostThunk({ query }))
    if (fetchBigQueryRunCostThunk.fulfilled.match(action)) {
      setRunCostChecked(true)
    } else {
      const error = action.payload as ParsedAPIError
      setError(error.message)
    }
  }

  const onCreateClick = async ({
    name,
    unit,
    createAsPublic,
    query,
    visualisationMode,
    aggregationOperation,
  }: CreateBigQueryDataset & { aggregationOperation?: FourwingsAggregationOperation | null }) => {
    const action = await dispatch(
      createBigQueryDatasetThunk({ name, unit, createAsPublic, query, visualisationMode })
    )
    if (
      (visualisationMode === '4wings' ? aggregationOperation !== null : true) &&
      createBigQueryDatasetThunk.fulfilled.match(action)
    ) {
      const dataset = action.payload.payload as Dataset
      const dataviewInstance =
        visualisationMode === '4wings'
          ? getBigQuery4WingsDataviewInstance(dataset.id, {
              aggregationOperation: aggregationOperation as FourwingsAggregationOperation,
            })
          : getBigQueryEventsDataviewInstance(dataset.id)
      addNewDataviewInstances([dataviewInstance])
      dispatch(setBigQueryMode({ active: false }))
    } else {
      const error = action.payload as ParsedAPIError
      setError(error.message)
    }
  }

  return {
    error,
    setError,
    runCostChecked,
    setRunCostChecked,
    createAsPublic,
    setCreateAsPublic,
    query,
    setQuery,
    runCost,
    runCostStatus,
    creationStatus,
    onRunCostClick,
    onCreateClick,
  }
}
