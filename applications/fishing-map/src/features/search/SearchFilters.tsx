import React, { useEffect, useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import MultiSelect from '@globalfishingwatch/ui-components/dist/multi-select'
import InputDate from '@globalfishingwatch/ui-components/dist/input-date'
import { getFlags } from 'utils/flags'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import { DEFAULT_WORKSPACE } from 'data/config'
import { getFiltersBySchema, SchemaFieldDataview } from 'features/datasets/datasets.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useSearchFiltersConnect } from './search.hook'
import styles from './SearchFilters.module.css'
import { selectAllowedVesselsDatasets } from './search.selectors'

type SearchFiltersProps = {
  className?: string
}

function SearchFilters({ className = '' }: SearchFiltersProps) {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const { searchFilters, setSearchFilters } = useSearchFiltersConnect()
  const {
    flags,
    sources,
    fleets,
    origins,
    firstTransmissionDate,
    lastTransmissionDate,
  } = searchFilters

  const flagOptions = useMemo(getFlags, [])
  const searchDatasets = useSelector(selectAllowedVesselsDatasets)
  const sourceOptions = useMemo(
    () =>
      searchDatasets
        ?.sort((a, b) => a.name.localeCompare(b.name))
        .map(({ id, name }) => ({ id, label: name })),
    [searchDatasets]
  )

  useEffect(() => {
    if (firstTransmissionDate === undefined) {
      setSearchFilters({ firstTransmissionDate: start.split('T')[0] })
    }
    if (lastTransmissionDate === undefined) {
      setSearchFilters({ lastTransmissionDate: end.split('T')[0] })
    }
  }, [firstTransmissionDate, lastTransmissionDate, setSearchFilters, start, end])

  const dataview = {
    config: {
      datasets: sources?.map(({ id }) => id),
      filters: {
        fleet: fleets?.map(({ id }) => id),
        origin: origins?.map(({ id }) => id),
      },
    },
    datasets: searchDatasets,
  } as SchemaFieldDataview

  const fleetFilters = getFiltersBySchema(dataview, 'fleet')
  const originFilters = getFiltersBySchema(dataview, 'origin')

  return (
    <div className={cx(className)}>
      {sourceOptions && sourceOptions.length > 0 && (
        <MultiSelect
          label={t('layer.source_plural', 'Sources')}
          placeholder={getPlaceholderBySelections(sources)}
          options={sourceOptions}
          selectedOptions={sources}
          className={styles.row}
          onSelect={(filter) => {
            setSearchFilters({ sources: [...(sources || []), filter] })
          }}
          onRemove={(filter, rest) => {
            setSearchFilters({ sources: rest })
          }}
          onCleanClick={() => {
            setSearchFilters({ sources: undefined })
          }}
        />
      )}
      {fleetFilters.active && (
        <div className={styles.row}>
          <MultiSelect
            disabled={fleetFilters.disabled}
            disabledMsg={fleetFilters.tooltip}
            label={t('vessel.fleet', 'Fleet')}
            placeholder={getPlaceholderBySelections(fleetFilters.optionsSelected)}
            options={fleetFilters.options}
            selectedOptions={fleetFilters.optionsSelected}
            className={styles.multiSelect}
            onSelect={(filter) => {
              setSearchFilters({ fleets: [...(fleets || []), filter] })
            }}
            onRemove={(filter, rest) => {
              setSearchFilters({ fleets: rest })
            }}
            onCleanClick={() => {
              setSearchFilters({ fleets: undefined })
            }}
          />
        </div>
      )}
      {originFilters.active && (
        <div className={styles.row}>
          <MultiSelect
            disabled={originFilters.disabled}
            disabledMsg={originFilters.tooltip}
            label={t('vessel.origin', 'Origin')}
            placeholder={getPlaceholderBySelections(originFilters.optionsSelected)}
            options={originFilters.options}
            selectedOptions={originFilters.optionsSelected}
            className={styles.multiSelect}
            onSelect={(filter) => {
              setSearchFilters({ origins: [...(origins || []), filter] })
            }}
            onRemove={(filter, rest) => {
              setSearchFilters({ origins: rest })
            }}
            onCleanClick={() => {
              setSearchFilters({ origins: undefined })
            }}
          />
        </div>
      )}
      <MultiSelect
        label={t('layer.flagState_plural', 'Flag States')}
        placeholder={getPlaceholderBySelections(flags)}
        options={flagOptions}
        selectedOptions={flags}
        className={styles.row}
        onSelect={(filter) => {
          setSearchFilters({ flags: [...(flags || []), filter] })
        }}
        onRemove={(filter, rest) => {
          setSearchFilters({ flags: rest })
        }}
        onCleanClick={() => {
          setSearchFilters({ flags: undefined })
        }}
      />
      <div className={styles.row}>
        <InputDate
          value={firstTransmissionDate}
          max={DEFAULT_WORKSPACE.end.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          label={t('common.active_after', 'Active after')}
          onChange={(e) => {
            if (e.target.value !== firstTransmissionDate) {
              setSearchFilters({ firstTransmissionDate: e.target.value })
            }
          }}
          onRemove={() => {
            if (firstTransmissionDate !== '') {
              setSearchFilters({ firstTransmissionDate: '' })
            }
          }}
        />
      </div>
      <div className={styles.row}>
        <InputDate
          value={lastTransmissionDate}
          max={DEFAULT_WORKSPACE.end.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          label={t('common.active_before', 'Active Before')}
          onChange={(e) => {
            if (e.target.value !== lastTransmissionDate) {
              setSearchFilters({ lastTransmissionDate: e.target.value })
            }
          }}
          onRemove={() => {
            if (lastTransmissionDate !== '') {
              setSearchFilters({ lastTransmissionDate: '' })
            }
          }}
        />
      </div>
    </div>
  )
}

export default SearchFilters
