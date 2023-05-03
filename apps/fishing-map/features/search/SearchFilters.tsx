import { useEffect, useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { MultiSelect, InputDate } from '@globalfishingwatch/ui-components'
import { Dataset } from '@globalfishingwatch/api-types'
import { getFlags } from 'utils/flags'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import { DEFAULT_WORKSPACE } from 'data/config'
import {
  getFiltersBySchema,
  SchemaFieldDataview,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { showSchemaFilter } from 'features/workspace/activity/ActivitySchemaFilter'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { useSearchFiltersConnect } from './search.hook'
import styles from './SearchFilters.module.css'

type SearchFiltersProps = {
  datasets: Dataset[]
  className?: string
}
const schemaFilterIds: SupportedDatasetSchema[] = [
  'fleet',
  'origin',
  'geartype',
  'codMarinha',
  'targetSpecies',
]

const getSearchDataview = (datasets, searchFilters, sources): SchemaFieldDataview => {
  return {
    config: {
      datasets: sources?.map(({ id }) => id),
      filters: Object.fromEntries(
        schemaFilterIds.map((id) => [id, searchFilters[id]?.map((f) => f.id)])
      ),
    },
    datasets,
  }
}

function SearchFilters({ datasets, className = '' }: SearchFiltersProps) {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const { searchFilters, setSearchFilters } = useSearchFiltersConnect()
  const { flag, sources, last_transmission_date, first_transmission_date } = searchFilters

  const flagOptions = useMemo(getFlags, [])
  const sourceOptions = useMemo(() => {
    return datasets
      ?.sort((a, b) => a.name.localeCompare(b.name))
      .map((dataset) => ({
        id: dataset.id,
        label: <DatasetLabel dataset={dataset} />,
      }))
  }, [datasets])

  useEffect(() => {
    if (last_transmission_date === undefined) {
      setSearchFilters({ last_transmission_date: start?.split('T')[0] })
    }
    if (first_transmission_date === undefined) {
      setSearchFilters({ first_transmission_date: end?.split('T')[0] })
    }
  }, [last_transmission_date, first_transmission_date, setSearchFilters, start, end])

  const dataview = useMemo(() => {
    return getSearchDataview(datasets, searchFilters, sources)
  }, [datasets, searchFilters, sources])

  const schemaFilters = schemaFilterIds.map((id) => getFiltersBySchema(dataview, id))

  const onSourceSelect = (filter) => {
    const newSources = [...(sources || []), filter]
    setSearchFilters({ sources: newSources })
    // Recalculates schemaFilters to validate a new source has valid selection
    // when not valid we need to remove the filter from the search
    const newDataview = getSearchDataview(datasets, searchFilters, newSources)
    const newSchemaFilters = schemaFilterIds.map((id) => getFiltersBySchema(newDataview, id))
    const notCompatibleSchemaFilters = newSchemaFilters.flatMap(({ id, disabled }) => {
      return disabled && searchFilters[id] !== undefined ? id : []
    })
    if (notCompatibleSchemaFilters.length) {
      notCompatibleSchemaFilters.forEach((schema) => {
        setSearchFilters({ [schema]: undefined })
      })
    }
  }

  return (
    <div className={cx(className)}>
      {sourceOptions && sourceOptions.length > 0 && (
        <MultiSelect
          label={t('layer.source_other', 'Sources')}
          placeholder={getPlaceholderBySelections(sources)}
          options={sourceOptions}
          selectedOptions={sources}
          className={styles.row}
          onSelect={onSourceSelect}
          onRemove={(filter, rest) => {
            setSearchFilters({ sources: rest })
          }}
          onCleanClick={() => {
            setSearchFilters({ sources: undefined })
          }}
        />
      )}
      {schemaFilters.map((schemaFilter) => {
        if (!showSchemaFilter(schemaFilter)) {
          return null
        }
        const { id, disabled, options, optionsSelected } = schemaFilter
        return (
          <MultiSelect
            key={id}
            disabled={disabled}
            label={t(`vessel.${id}` as any, id)}
            placeholder={getPlaceholderBySelections(optionsSelected)}
            options={options}
            selectedOptions={optionsSelected}
            className={styles.row}
            onSelect={(filter) => {
              setSearchFilters({
                [id]: [...(searchFilters[id] || []), filter],
              })
            }}
            onRemove={(filter, rest) => {
              setSearchFilters({ [id]: rest })
            }}
            onCleanClick={() => {
              setSearchFilters({ [id]: undefined })
            }}
          />
        )
      })}
      <MultiSelect
        label={t('layer.flagState_other', 'Flag States')}
        placeholder={getPlaceholderBySelections(flag)}
        options={flagOptions}
        selectedOptions={flag}
        className={styles.row}
        onSelect={(filter) => {
          setSearchFilters({ flag: [...(flag || []), filter] })
        }}
        onRemove={(filter, rest) => {
          setSearchFilters({ flag: rest })
        }}
        onCleanClick={() => {
          setSearchFilters({ flag: undefined })
        }}
      />
      <div className={styles.row}>
        <InputDate
          value={last_transmission_date}
          max={DEFAULT_WORKSPACE.availableEnd.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          label={t('common.active_after', 'Active after')}
          onChange={(e) => {
            if (e.target.value !== last_transmission_date) {
              setSearchFilters({ last_transmission_date: e.target.value })
            }
          }}
          onRemove={() => {
            if (last_transmission_date !== '') {
              setSearchFilters({ last_transmission_date: '' })
            }
          }}
        />
      </div>
      <div className={styles.row}>
        <InputDate
          value={first_transmission_date}
          max={DEFAULT_WORKSPACE.availableEnd.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          label={t('common.active_before', 'Active Before')}
          onChange={(e) => {
            if (e.target.value !== first_transmission_date) {
              setSearchFilters({ first_transmission_date: e.target.value })
            }
          }}
          onRemove={() => {
            if (first_transmission_date !== '') {
              setSearchFilters({ first_transmission_date: '' })
            }
          }}
        />
      </div>
    </div>
  )
}

export default SearchFilters
