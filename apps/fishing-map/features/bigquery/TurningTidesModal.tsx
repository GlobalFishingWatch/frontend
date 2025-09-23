import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { FourwingsAggregationOperation } from '@globalfishingwatch/deck-layers'
import { Button, Icon, InputText, SwitchRow } from '@globalfishingwatch/ui-components'

import { AsyncReducerStatus } from 'utils/async-slice'

import { useBigQueryModal } from './bigquery.hooks'

import styles from './BigQuery.module.css'

const TurningTidesModal: React.FC = () => {
  const { t } = useTranslation()

  const [name, setName] = useState('')

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

  const hasQuery = query !== ''
  const disableCheckCost = !hasQuery
  const disableCreation = !runCostChecked || name === '' || disableCheckCost || error !== ''

  const handleCreateClick = () => {
    onCreateClick({
      name,
      createAsPublic,
      query,
      unit: 'hours',
      visualisationMode: '4wings',
      aggregationOperation: FourwingsAggregationOperation.Sum,
      ttl: 0,
    })
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
      </div>
      <div className={styles.row}>
        <label>
          {t('bigQuery.query')}{' '}
          <span className={styles.lowercase}>
            Ensure id, lat, lon, timestamp and value are all present
          </span>
        </label>
        <div>
          <textarea
            value={query}
            className={cx(styles.editor)}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
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
          tooltip={disableCheckCost ? 'Query is required' : ''}
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
          onClick={handleCreateClick}
        >
          {t('bigQuery.create')}
        </Button>
      </div>
    </div>
  )
}

export default TurningTidesModal
