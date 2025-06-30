import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import type { Dataset } from '@globalfishingwatch/api-types'
import type { FourwingsAggregationOperation } from '@globalfishingwatch/deck-layers'
import { Button, InputText, Select, SwitchRow, Tooltip } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { AggregationOptions, VisualisationOptions } from 'features/bigquery/bigquery.config'
import {
  getBigQuery4WingsDataviewInstance,
  getBigQueryEventsDataviewInstance,
} from 'features/dataviews/dataviews.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { AsyncReducerStatus } from 'utils/async-slice'

import type { BigQueryVisualisation } from './bigquery.slice'
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
  const [unit, setUnit] = useState('')
  const [error, setError] = useState('')
  const [visualisationMode, setVisualisationMode] = useState<BigQueryVisualisation | null>(null)
  const [aggregationOperation, setAggregationOperation] =
    useState<FourwingsAggregationOperation | null>(null)
  const [runCostChecked, setRunCostChecked] = useState(false)
  const [createAsPublic, setCreateAsPublic] = useState(true)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()
  const [query, setQuery] = useState('')

  const currentVisualisationMode = VisualisationOptions.find(({ id }) => id === visualisationMode)

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

  const onCreateClick = async () => {
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
      dispatch(toggleBigQueryMenu())
    } else {
      const error = action.payload as ParsedAPIError
      setError(error.message)
    }
  }

  const hasQuery = query !== ''
  const disableCheckCost =
    !hasQuery || !visualisationMode || (visualisationMode === '4wings' && !aggregationOperation)
  const disableCreation = !runCostChecked || name === '' || disableCheckCost || error !== ''

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <InputText
          className={styles.input}
          labelClassName={styles.inputLabel}
          label="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Select
          label={t('bigQuery.visualiationMode')}
          placeholder={t('selects.placeholder')}
          options={VisualisationOptions}
          containerClassName={styles.input}
          selectedOption={currentVisualisationMode}
          onSelect={(selected) => {
            setVisualisationMode(selected.id)
          }}
        />
        {visualisationMode === '4wings' && (
          <Fragment>
            <Select
              label={t('bigQuery.aggregationMode')}
              placeholder={t('selects.placeholder')}
              options={AggregationOptions}
              containerClassName={styles.input}
              selectedOption={AggregationOptions.find(({ id }) => id === aggregationOperation)}
              onSelect={(selected) => {
                setAggregationOperation(selected.id)
              }}
            />
            <InputText
              className={styles.input}
              labelClassName={styles.inputLabel}
              label="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </Fragment>
        )}
      </div>
      <div className={styles.row}>
        <label>
          {t('bigQuery.query')}{' '}
          {currentVisualisationMode && (
            <span className={styles.lowercase}>{currentVisualisationMode.fieldsHint}</span>
          )}
        </label>
        <Tooltip content={!visualisationMode ? t('bigQuery.selectVisualisation') : ''}>
          <div>
            <textarea
              value={query}
              disabled={!visualisationMode}
              className={cx(styles.editor, { [styles.notAllowed]: !visualisationMode })}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </Tooltip>
      </div>
      <SwitchRow
        className={styles.row}
        label={t('dataset.uploadPublic')}
        active={createAsPublic}
        onClick={() => setCreateAsPublic((createAsPublic) => !createAsPublic)}
      />
      <div className={styles.footer}>
        {error && <p className={styles.error}>{error}</p>}
        {runCost !== null && (
          <p>
            {t('bigQuery.runCost')} {runCost?.totalBytesPretty}
          </p>
        )}
        <Button
          disabled={disableCheckCost}
          tooltip={disableCheckCost ? 'Query and visualisation mode is required' : ''}
          loading={runCostStatus === AsyncReducerStatus.Loading}
          onClick={onRunCostClick}
        >
          {t('bigQuery.runCostCheck')}
        </Button>
        <Button
          disabled={disableCreation || creationStatus === AsyncReducerStatus.Loading}
          tooltip={
            error ? t('bigQuery.queryError') : disableCreation ? t('bigQuery.validationError') : ''
          }
          loading={creationStatus === AsyncReducerStatus.Loading}
          onClick={onCreateClick}
        >
          {t('bigQuery.create')}
        </Button>
      </div>
    </div>
  )
}

export default BigQueryMenu
