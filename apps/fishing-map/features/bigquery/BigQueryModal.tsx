import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { FourwingsAggregationOperation } from '@globalfishingwatch/deck-layers'
import {
  Button,
  Icon,
  InputText,
  Select,
  SwitchRow,
  Tooltip,
} from '@globalfishingwatch/ui-components'

import { AggregationOptions, VisualisationOptions } from 'features/bigquery/bigquery.config'
import type { BigQueryVisualisation } from 'features/bigquery/bigquery.slice'
import { AsyncReducerStatus } from 'utils/async-slice'

import { useBigQueryModal } from './bigquery.hooks'

import styles from './BigQuery.module.css'

const BigQueryModal: React.FC = () => {
  const { t } = useTranslation()

  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')
  const [visualisationMode, setVisualisationMode] = useState<BigQueryVisualisation | null>(null)
  const [aggregationOperation, setAggregationOperation] =
    useState<FourwingsAggregationOperation | null>(null)

  const {
    error,
    runCost,
    runCostStatus,
    runCostChecked,
    createAsPublic,
    setCreateAsPublic,
    query,
    setQuery,
    creationStatus,
    onRunCostClick,
    onCreateClick,
  } = useBigQueryModal()

  const currentVisualisationMode = VisualisationOptions.find(({ id }) => id === visualisationMode)
  const hasQuery = query !== ''
  const disableCheckCost =
    !hasQuery || !visualisationMode || (visualisationMode === '4wings' && !aggregationOperation)
  const disableCreation = !runCostChecked || name === '' || disableCheckCost || error !== ''

  const handleCreateClick = () => {
    if (visualisationMode) {
      onCreateClick({
        name,
        unit,
        createAsPublic,
        query,
        visualisationMode,
        aggregationOperation,
      })
    }
  }

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
          label={t((t) => t.bigQuery.visualiationMode)}
          placeholder={t((t) => t.selects.placeholder)}
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
              label={t((t) => t.bigQuery.aggregationMode)}
              placeholder={t((t) => t.selects.placeholder)}
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
          {t((t) => t.bigQuery.query)}{' '}
          {currentVisualisationMode && (
            <span className={styles.lowercase}>{currentVisualisationMode.fieldsHint}</span>
          )}
        </label>
        <Tooltip content={!visualisationMode ? t((t) => t.bigQuery.selectVisualisation) : ''}>
          <div>
            <textarea
              value={query}
              disabled={!visualisationMode}
              className={cx(styles.editor, { [styles.notAllowed]: !visualisationMode })}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </Tooltip>
        <span className={cx(styles.dataWarning)}>
          <Icon icon="warning" />
          <span>
            Data needs to be stored in:{' '}
            <span className={styles.bold}>world-fishing-827.bigquery_editor_30daysttl</span>
          </span>
        </span>
      </div>
      <SwitchRow
        className={styles.row}
        label={t((t) => t.dataset.uploadPublic)}
        active={createAsPublic}
        onClick={() => setCreateAsPublic((createAsPublic) => !createAsPublic)}
      />
      <div className={styles.footer}>
        {error && <p className={styles.error}>{error}</p>}
        {runCost !== null && (
          <p>
            {t((t) => t.bigQuery.runCost)} {runCost?.totalBytesPretty}
          </p>
        )}
        <Button
          disabled={disableCheckCost}
          tooltip={disableCheckCost ? 'Query and visualisation mode is required' : ''}
          loading={runCostStatus === AsyncReducerStatus.Loading}
          onClick={onRunCostClick}
        >
          {t((t) => t.bigQuery.runCostCheck)}
        </Button>
        <Button
          disabled={disableCreation || creationStatus === AsyncReducerStatus.Loading}
          tooltip={
            error
              ? t((t) => t.bigQuery.queryError)
              : disableCreation
                ? t((t) => t.bigQuery.validationError)
                : ''
          }
          loading={creationStatus === AsyncReducerStatus.Loading}
          onClick={handleCreateClick}
        >
          {t((t) => t.bigQuery.create)}
        </Button>
      </div>
    </div>
  )
}

export default BigQueryModal
