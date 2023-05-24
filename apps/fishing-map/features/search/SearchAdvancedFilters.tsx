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
import styles from './SearchAdvancedFilters.module.css'

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

function SearchAdvancedFilters() {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const datasets = useSelector(selectAdvancedSearchDatasets)
  const { searchFilters, setSearchFilters } = useSearchFiltersConnect()
  const {
    flag,
    sources,
    lastTransmissionDate,
    firstTransmissionDate,
    imo,
    ssvid,
    callsign,
    owner,
  } = searchFilters

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
    if (lastTransmissionDate === undefined) {
      setSearchFilters({ lastTransmissionDate: start?.split('T')[0] })
    }
    if (firstTransmissionDate === undefined) {
      setSearchFilters({ firstTransmissionDate: end?.split('T')[0] })
    }
  }, [lastTransmissionDate, firstTransmissionDate, setSearchFilters, start, end])

  const dataview = useMemo(() => {
    return getSearchDataview(datasets, searchFilters, sources)
  }, [datasets, searchFilters, sources])

  const schemaFilters = schemaFilterIds.map((id) => getFiltersBySchema(dataview, id))

  const onSourceSelect = (filter) => {
    const newSources = [
      ...(sources || []),
      { id: filter.id, label: filter.label.props.dataset.name },
    ]
    const notCompatibleSchemaFilters = getIncompatibleFilters(newSources)
    setSearchFilters({ ...notCompatibleSchemaFilters, sources: newSources })
  }

  const getIncompatibleFilters = (sources) => {
    // Recalculates schemaFilters to validate a new source has valid selection
    // when not valid we need to remove the filter from the search
    const newDataview = getSearchDataview(datasets, searchFilters, sources)
    const newSchemaFilters = schemaFilterIds.map((id) => getFiltersBySchema(newDataview, id))
    const notCompatibleSchemaFilters = newSchemaFilters.flatMap(({ id, disabled }) => {
      return disabled && searchFilters[id] !== undefined ? id : []
    })
    return Object.fromEntries(notCompatibleSchemaFilters.map((schema) => [schema, undefined]))
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
        id="ssvid"
        value={ssvid || ''}
        label={t('vessel.mmsi', 'MMSI')}
        inputSize="small"
      />
      <InputText
        onChange={onInputChange}
        id="imo"
        value={imo || ''}
        label={t('vessel.imo', 'IMO')}
        inputSize="small"
      />
      <InputText
        onChange={onInputChange}
        id="callsign"
        value={callsign || ''}
        label={t('vessel.callsign', 'Callsign')}
        inputSize="small"
      />
      <MultiSelect
        label={t('layer.flagState_other', 'Flag States')}
        placeholder={getPlaceholderBySelections(flag)}
        options={flagOptions}
        selectedOptions={flag}
        onSelect={({ alias, ...rest }) => {
          setSearchFilters({ flag: [...(flag || []), rest] })
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
            const notCompatibleSchemaFilters = getIncompatibleFilters(rest)
            setSearchFilters({ ...notCompatibleSchemaFilters, sources: rest })
          }}
          onCleanClick={() => {
            const notCompatibleSchemaFilters = getIncompatibleFilters(sourceOptions)
            setSearchFilters({ ...notCompatibleSchemaFilters, sources: undefined })
          }}
        />
      )}
      <div>
        <InputDate
          value={lastTransmissionDate || ''}
          max={DEFAULT_WORKSPACE.availableEnd.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          label={t('common.active_after', 'Active after')}
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
      <div>
        <InputDate
          value={firstTransmissionDate || ''}
          max={DEFAULT_WORKSPACE.availableEnd.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          label={t('common.active_before', 'Active Before')}
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
      <InputText
        onChange={onInputChange}
        id="owner"
        value={owner || ''}
        label={t('vessel.owner', 'Owner')}
        inputSize="small"
      />
    </div>
  )
}

export default SearchAdvancedFilters
