import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Button, InputText, Select, SwitchRow } from '@globalfishingwatch/ui-components'
import { Dataset } from '@globalfishingwatch/api-types'
import { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import { ResponseError } from '@globalfishingwatch/api-client'
import { useAppDispatch } from 'features/app/app.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getBigQueryDataviewInstance } from 'features/dataviews/dataviews.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  createBigQueryDatasetThunk,
  fetchBigQueryRunCostThunk,
  selectCreationStatus,
  selectRunCost,
  selectRunCostStatus,
  toggleBigQueryMenu,
} from './bigquery.slice'
import styles from './BigQuery.module.css'

const AggregationOptions = [
  {
    id: AggregationOperation.Avg,
    label: 'Average',
  },
  {
    id: AggregationOperation.Sum,
    label: 'Sum',
  },
]

const BigQueryMenu: React.FC = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const runCost = useSelector(selectRunCost)
  const runCostStatus = useSelector(selectRunCostStatus)
  const creationStatus = useSelector(selectCreationStatus)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [aggregationOperation, setAggregationOperation] = useState<AggregationOperation | null>(
    null
  )
  console.log(aggregationOperation)
  const [runCostChecked, setRunCostChecked] = useState(false)
  const [createAsPublic, setCreateAsPublic] = useState(true)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()
  const [query, setQuery] = useState('')

  const onRunCostClick = async () => {
    if (error) {
      setError('')
    }
    const action = await dispatch(fetchBigQueryRunCostThunk({ query }))
    if (fetchBigQueryRunCostThunk.fulfilled.match(action)) {
      setRunCostChecked(true)
    } else {
      setError((action.payload as ResponseError).message)
    }
  }

  const onCreateClick = async () => {
    const action = await dispatch(createBigQueryDatasetThunk({ name, createAsPublic, query }))
    if (createBigQueryDatasetThunk.fulfilled.match(action)) {
      const dataset = action.payload.payload as Dataset
      const dataviewInstance = getBigQueryDataviewInstance(dataset.id, { aggregationOperation })
      addNewDataviewInstances([dataviewInstance])
      dispatch(toggleBigQueryMenu())
    } else {
      const error = (action.payload as ResponseError).message || 'There was an unexpected error'
      setError(error)
    }
  }

  const hasQuery = query !== ''
  const disableCreation = !runCostChecked || name === '' || !hasQuery || !aggregationOperation

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <InputText
          className={styles.input}
          labelClassName={styles.inputLabel}
          inputSize="small"
          label="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Select
          label="Aggregation mode *"
          placeholder={t('selects.placeholder', 'Select an option')}
          options={AggregationOptions}
          containerClassName={styles.inputShort}
          selectedOption={AggregationOptions.find(({ id }) => id === aggregationOperation)}
          onSelect={(selected) => {
            setAggregationOperation(selected.id)
          }}
          onRemove={() => {}}
        />
      </div>
      <div className={styles.row}>
        <label>Query (Ensure id, lat, lon, timestamp and value are all present)</label>
        <textarea
          value={query}
          className={styles.editor}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <SwitchRow
        className={styles.row}
        label={t(
          'dataset.uploadPublic' as any,
          'Allow other users to see this dataset when you share a workspace'
        )}
        active={createAsPublic}
        onClick={() => setCreateAsPublic((createAsPublic) => !createAsPublic)}
      />
      <div className={styles.footer}>
        {error && <p className={styles.error}>{error}</p>}
        {runCost !== null && <p>This query will move: {runCost.totalBytesPretty}</p>}
        <Button
          disabled={!hasQuery}
          tooltip={hasQuery ? '' : 'Query is required'}
          loading={runCostStatus === AsyncReducerStatus.Loading}
          onClick={onRunCostClick}
        >
          Check creation cost
        </Button>
        <Button
          disabled={disableCreation || creationStatus === AsyncReducerStatus.Loading}
          tooltip={
            disableCreation
              ? 'Query, name, aggregation mode and checking creation cost are required'
              : ''
          }
          loading={creationStatus === AsyncReducerStatus.Loading}
          onClick={onCreateClick}
        >
          Create
        </Button>
      </div>
    </div>
  )
}

export default BigQueryMenu
