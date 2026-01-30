import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { FourwingsAggregationOperation } from '@globalfishingwatch/deck-layers'
import { Button, Icon, InputText, Select, SwitchRow } from '@globalfishingwatch/ui-components'

import {
  CountryOptions,
  TURNING_TIDES_DESCRIPTION_PREFIX,
  TURNING_TIDES_TTL_DAYS,
} from 'features/bigquery/turning-tides.config'
import type { TurningTidesWorkspaceId } from 'features/track-correction/track-correction.config'
import { selectCurrentWorkspaceId } from 'features/workspace/workspace.selectors'
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
  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId) as TurningTidesWorkspaceId
  const [selectedCountry, setSelectedCountry] = useState<TurningTidesWorkspaceId | undefined>(
    CountryOptions.find(({ id }) => id === currentWorkspaceId)?.id
  )

  const selectedCountryOption = CountryOptions.find(({ id }) => id === selectedCountry)

  const hasQuery = query !== ''
  const disableCheckCost = !hasQuery
  const disableCreation =
    !runCostChecked || name === '' || disableCheckCost || error !== '' || !selectedCountryOption

  const handleCreateClick = () => {
    onCreateClick({
      name,
      createAsPublic,
      query,
      description: `${TURNING_TIDES_DESCRIPTION_PREFIX}: ${query}`,
      unit: 'hours',
      visualisationMode: '4wings',
      subcategory: 'user-interactive',
      aggregationOperation: FourwingsAggregationOperation.Sum,
      relatedDatasets: selectedCountryOption?.relatedDatasets,
      ttl: TURNING_TIDES_TTL_DAYS,
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
        <Select
          label={'Country'}
          placeholder={t((t) => t.selects.placeholder)}
          options={CountryOptions}
          containerClassName={styles.input}
          selectedOption={selectedCountryOption}
          onSelect={(selected) => {
            setSelectedCountry(selected.id)
          }}
        />
      </div>
      <div className={styles.row}>
        <label>
          {t((t) => t.bigQuery.query)}{' '}
          <span className={styles.lowercase}>
            (ensure vessel_id as id, lat, lon, timestamp and value are all present)
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
          tooltip={disableCheckCost ? 'Query is required' : ''}
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
                ? 'Query, name, country and checking creation cost are required'
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

export default TurningTidesModal
