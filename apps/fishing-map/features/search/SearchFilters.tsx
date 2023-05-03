import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { MultiSelect, InputDate, InputText } from '@globalfishingwatch/ui-components'
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
import { selectAdvancedSearchDatasets } from 'features/search/search.selectors'
import { useSearchFiltersConnect } from './search.hook'
import styles from './SearchFilters.module.css'

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

function SearchFilters() {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const datasets = useSelector(selectAdvancedSearchDatasets)
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

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchFilters({ [e.target.id]: e.target.value })
    },
    [setSearchFilters]
  )

  return (
    <div className={styles.filters}>
      <InputText
        onChange={onInputChange}
        id="mmsi"
        value={searchFilters.mmsi || ''}
        label={t('vessel.mmsi', 'MMSI')}
        inputSize="small"
      />
      <InputText
        onChange={onInputChange}
        id="imo"
        value={searchFilters.imo || ''}
        label={t('vessel.imo', 'IMO')}
        inputSize="small"
      />
      <InputText
        onChange={onInputChange}
        id="callsign"
        value={searchFilters.callsign || ''}
        label={t('vessel.callsign', 'Callsign')}
        inputSize="small"
      />
      <MultiSelect
        label={t('layer.flagState_other', 'Flag States')}
        placeholder={getPlaceholderBySelections(flag)}
        options={flagOptions}
        selectedOptions={flag}
        onSelect={(filter) => {
          setSearchFilters({ flag: [...(flag || []), filter] })
        }}
        onRemove={(_, rest) => {
          setSearchFilters({ flag: rest })
        }}
        onCleanClick={() => {
          setSearchFilters({ flag: undefined })
        }}
      />
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
            onSelect={(filter) => {
              setSearchFilters({
                [id]: [...(searchFilters[id] || []), filter],
              })
            }}
            onRemove={(_, rest) => {
              setSearchFilters({ [id]: rest })
            }}
            onCleanClick={() => {
              setSearchFilters({ [id]: undefined })
            }}
          />
        )
      })}
      {sourceOptions && sourceOptions.length > 0 && (
        <MultiSelect
          label={t('layer.source_other', 'Sources')}
          placeholder={getPlaceholderBySelections(sources)}
          options={sourceOptions}
          selectedOptions={sources}
          onSelect={onSourceSelect}
          onRemove={(_, rest) => {
            setSearchFilters({ sources: rest })
          }}
          onCleanClick={() => {
            setSearchFilters({ sources: undefined })
          }}
        />
      )}
      <div>
        <InputDate
          value={last_transmission_date || ''}
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
      <div>
        <InputDate
          value={first_transmission_date || ''}
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
      <InputText
        onChange={onInputChange}
        id="owner"
        value={searchFilters.owner || ''}
        label={t('vessel.owner', 'Owner')}
        inputSize="small"
      />
    </div>
  )
}

export default SearchFilters
