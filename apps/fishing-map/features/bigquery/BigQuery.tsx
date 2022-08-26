import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Button, InputText, Select, SwitchRow, Tooltip } from '@globalfishingwatch/ui-components'
import { Dataset } from '@globalfishingwatch/api-types'
import { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  getBigQuery4WingsDataviewInstance,
  getBigQueryEventsDataviewInstance,
} from 'features/dataviews/dataviews.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  BigQueryVisualisation,
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
  const [aggregationOperation, setAggregationOperation] = useState<AggregationOperation | null>(
    null
  )
  const [runCostChecked, setRunCostChecked] = useState(false)
  const [createAsPublic, setCreateAsPublic] = useState(true)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()
  const [query, setQuery] = useState('')

  const VisualisationOptions: { id: BigQueryVisualisation; label: string; fieldsHint: string }[] = [
    {
      id: '4wings',
      label: t('bigQuery.visualisationActivity', 'Activity (heatmap)'),
      fieldsHint: t(
        'bigQuery.visualisationActivityHint',
        '(Ensure id, lat, lon, timestamp and value are all present)'
      ),
    },
    {
      id: 'events',
      label: t('bigQuery.visualisationEvents', 'Events (clusters)'),
      fieldsHint: t(
        'bigQuery.visualisationEventsHint',
        '(Ensure event_id, event_start, event_end and geom are all present)'
      ),
    },
  ]

  const AggregationOptions = [
    {
      id: AggregationOperation.Avg,
      label: t('bigQuery.aggregateAvg', 'Average'),
    },
    {
      id: AggregationOperation.Sum,
      label: t('bigQuery.aggregateSum', 'Sum'),
    },
  ]

  const currentVisualisationMode = VisualisationOptions.find(({ id }) => id === visualisationMode)

  const onRunCostClick = async () => {
    setRunCostChecked(false)
    if (error) {
      setError('')
    }
    const action = await dispatch(fetchBigQueryRunCostThunk({ query, visualisationMode }))
    if (fetchBigQueryRunCostThunk.fulfilled.match(action)) {
      setRunCostChecked(true)
    } else {
      const error = action.payload
      setError(error.message)
    }
  }

  const onCreateClick = async () => {
    const action = await dispatch(
      createBigQueryDatasetThunk({ name, unit, createAsPublic, query, visualisationMode })
    )
    if (createBigQueryDatasetThunk.fulfilled.match(action)) {
      const dataset = action.payload.payload as Dataset
      const dataviewInstance =
        visualisationMode === '4wings'
          ? getBigQuery4WingsDataviewInstance(dataset.id, {
              aggregationOperation,
            })
          : getBigQueryEventsDataviewInstance(dataset.id)
      addNewDataviewInstances([dataviewInstance])
      dispatch(toggleBigQueryMenu())
    } else {
      const error = action.payload
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
          inputSize="small"
          label="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputText
          className={styles.input}
          labelClassName={styles.inputLabel}
          inputSize="small"
          label="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
        <Select
          label={t('bigQuery.visualiationMode', 'Visualisation mode')}
          placeholder={t('selects.placeholder', 'Select an option')}
          options={VisualisationOptions}
          containerClassName={styles.input}
          selectedOption={currentVisualisationMode}
          onSelect={(selected) => {
            setVisualisationMode(selected.id)
          }}
        />
        {visualisationMode === '4wings' && (
          <Select
            label={t('bigQuery.aggregationMode', 'Aggregation mode *')}
            placeholder={t('selects.placeholder', 'Select an option')}
            options={AggregationOptions}
            containerClassName={styles.input}
            selectedOption={AggregationOptions.find(({ id }) => id === aggregationOperation)}
            onSelect={(selected) => {
              setAggregationOperation(selected.id)
            }}
          />
        )}
      </div>
      <div className={styles.row}>
        <label>
          {t('bigQuery.query', 'Query')}{' '}
          {currentVisualisationMode && (
            <span className={styles.lowercase}>{currentVisualisationMode.fieldsHint}</span>
          )}
        </label>
        <Tooltip
          content={
            !visualisationMode
              ? t('bigQuery.selectVisualisation', 'Select a visualisation mode first')
              : ''
          }
        >
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
        label={t(
          'dataset.uploadPublic' as any,
          'Allow other users to see this dataset when you share a workspace'
        )}
        active={createAsPublic}
        onClick={() => setCreateAsPublic((createAsPublic) => !createAsPublic)}
      />
      <div className={styles.footer}>
        {error && <p className={styles.error}>{error}</p>}
        {runCost !== null && (
          <p>
            {t('bigQuery.runCost', 'This query will move:')} {runCost?.totalBytesPretty}
          </p>
        )}
        <Button
          disabled={disableCheckCost}
          tooltip={disableCheckCost ? 'Query and visualisation mode is required' : ''}
          loading={runCostStatus === AsyncReducerStatus.Loading}
          onClick={onRunCostClick}
        >
          {t('bigQuery.runCostCheck', 'Check creation cost')}
        </Button>
        <Button
          disabled={disableCreation || creationStatus === AsyncReducerStatus.Loading}
          tooltip={
            error
              ? t('bigQuery.queryError', 'There is an error in the query')
              : disableCreation
              ? t(
                  'bigQuery.validationError',
                  'Query, name, visualisation mode, aggregation mode and checking creation cost are required'
                )
              : ''
          }
          loading={creationStatus === AsyncReducerStatus.Loading}
          onClick={onCreateClick}
        >
          {t('bigQuery.create', 'Create')}
        </Button>
      </div>
    </div>
  )
}

export default BigQueryMenu
