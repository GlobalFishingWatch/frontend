import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Button, InputText, SwitchRow } from '@globalfishingwatch/ui-components'
import { Dataset } from '@globalfishingwatch/api-types'
import { useAppDispatch } from 'features/app/app.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getActivityDataviewInstance } from 'features/dataviews/dataviews.utils'
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

const BigQueryMenu: React.FC = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const runCost = useSelector(selectRunCost)
  const runCostStatus = useSelector(selectRunCostStatus)
  const creationStatus = useSelector(selectCreationStatus)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [runCostChecked, setRunCostChecked] = useState(false)
  const [createAsPublic, setCreateAsPublic] = useState(true)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()
  const [query, setQuery] = useState('')

  const onRunCostClick = async () => {
    const action = await dispatch(fetchBigQueryRunCostThunk({ query }))
    if (fetchBigQueryRunCostThunk.fulfilled.match(action)) {
      setRunCostChecked(true)
    } else {
      setError('Error')
    }
  }

  const onCreateClick = async () => {
    const action = await dispatch(createBigQueryDatasetThunk({ name, createAsPublic, query }))
    if (createBigQueryDatasetThunk.fulfilled.match(action)) {
      const dataset = action.payload.payload as Dataset
      const dataviewInstance = getActivityDataviewInstance(dataset.id)
      addNewDataviewInstances([dataviewInstance])
      dispatch(toggleBigQueryMenu())
    } else {
      setError('There was an unexpected error')
    }
  }

  const hasQuery = query !== ''
  const disableCreation = !runCostChecked || name === '' || !hasQuery

  return (
    <div className={styles.container}>
      <InputText
        inputSize="small"
        label="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className={styles.row}>
        <label>Query</label>
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
          tooltip={disableCreation ? 'Query, name and checking creation cost are required' : ''}
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
