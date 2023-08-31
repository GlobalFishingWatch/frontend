import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  MultiSelect,
  InputDate,
  InputText,
  Select,
  SelectOption,
} from '@globalfishingwatch/ui-components'
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
import { VesselIdentitySourceEnum } from 'features/search/search.config'
import { DEFAULT_VESSEL_IDENTITY_DATASET } from 'features/vessel/vessel.config'
import { useSearchFiltersConnect } from 'features/search/search.hook'
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
      datasets: sources?.map((id) => id),
      filters: Object.fromEntries(
        schemaFilterIds.map((id) => [id, searchFilters[id]?.map((f) => f)])
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
    transmissionDateFrom,
    transmissionDateTo,
    imo,
    ssvid,
    callsign,
    owner,
    infoSource,
  } = searchFilters

  const flagOptions = useMemo(getFlags, [])
  const sourceOptions = useMemo(() => {
    const datasetsFiltered =
      infoSource === VesselIdentitySourceEnum.Registry
        ? datasets?.filter((d) => d.id.includes(DEFAULT_VESSEL_IDENTITY_DATASET))
        : datasets
    return datasetsFiltered
      ?.sort((a, b) => a.name.localeCompare(b.name))
      .map((dataset) => ({
        id: dataset.id,
        label: <DatasetLabel dataset={dataset} />,
      }))
  }, [datasets, infoSource])

  const infoSourceOptions: SelectOption<VesselIdentitySourceEnum>[] = useMemo(
    () => [
      {
        id: VesselIdentitySourceEnum.Registry,
        label: t(`vessel.infoSources.${VesselIdentitySourceEnum.Registry}` as any, 'Registry only'),
      },
      {
        id: VesselIdentitySourceEnum.SelfReported,
        label: t(`vessel.infoSources.${VesselIdentitySourceEnum.SelfReported}` as any, 'Any'),
      },
    ],
    [t]
  )

  useEffect(() => {
    if (transmissionDateFrom === undefined) {
      setSearchFilters({ transmissionDateFrom: start?.split('T')[0] })
    }
    if (transmissionDateTo === undefined) {
      setSearchFilters({ transmissionDateTo: end?.split('T')[0] })
    }
  }, [transmissionDateFrom, transmissionDateTo, setSearchFilters, start, end])

  const dataview = useMemo(() => {
    return getSearchDataview(datasets, searchFilters, sources)
  }, [datasets, searchFilters, sources])

  const schemaFilters = schemaFilterIds.map((id) => getFiltersBySchema(dataview, id))

  const onSourceSelect = (filter) => {
    const newSources = [...(sources || []), filter.id]
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
      <InputText
        onChange={onInputChange}
        id="owner"
        value={owner || ''}
        label={t('vessel.owner', 'Owner')}
        inputSize="small"
      />
      <Select
        label={t('vessel.infoSource', 'Info Source')}
        placeholder={getPlaceholderBySelections({
          selection: infoSource,
          options: infoSourceOptions,
        })}
        options={infoSourceOptions}
        selectedOption={infoSourceOptions.find(({ id }) => id === infoSource)}
        onSelect={({ id }) => {
          setSearchFilters({ infoSource: id })
        }}
        onRemove={() => {
          setSearchFilters({ infoSource: undefined })
        }}
      />
      {sourceOptions && sourceOptions.length > 0 && (
        <MultiSelect
          label={t('layer.source_other', 'Sources')}
          placeholder={getPlaceholderBySelections({ selection: sources, options: sourceOptions })}
          options={sourceOptions}
          selectedOptions={sourceOptions.filter((f) => sources?.includes(f.id))}
          onSelect={onSourceSelect}
          onRemove={(_, rest) => {
            const notCompatibleSchemaFilters = getIncompatibleFilters(rest)
            setSearchFilters({ ...notCompatibleSchemaFilters, sources: rest.map(({ id }) => id) })
          }}
          onCleanClick={() => {
            const notCompatibleSchemaFilters = getIncompatibleFilters(sourceOptions)
            setSearchFilters({ ...notCompatibleSchemaFilters, sources: undefined })
          }}
        />
      )}
      <MultiSelect
        label={t('layer.flagState_other', 'Flag States')}
        placeholder={getPlaceholderBySelections({ selection: flag, options: flagOptions })}
        options={flagOptions}
        selectedOptions={flagOptions.filter((f) => flag?.includes(f.id))}
        onSelect={({ id }) => {
          const flags = flag ? [...flag, id] : [id]
          setSearchFilters({ flag: flags })
        }}
        onRemove={(_, rest) => {
          setSearchFilters({ flag: rest.map(({ id }) => id) })
        }}
        onCleanClick={() => {
          setSearchFilters({ flag: undefined })
        }}
      />
      {infoSource === VesselIdentitySourceEnum.SelfReported &&
        schemaFilters.map((schemaFilter) => {
          if (!showSchemaFilter(schemaFilter)) {
            return null
          }
          const { id, disabled, options, optionsSelected } = schemaFilter
          return (
            <MultiSelect
              key={id}
              disabled={disabled}
              label={t(`vessel.${id}` as any, id)}
              placeholder={getPlaceholderBySelections({
                selection: optionsSelected.map(({ id }) => id),
                options,
              })}
              options={options}
              selectedOptions={optionsSelected}
              onSelect={(filter) => {
                setSearchFilters({
                  [id]: [...(searchFilters[id] || []), filter.id],
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
      <div>
        <InputDate
          value={transmissionDateFrom || ''}
          max={DEFAULT_WORKSPACE.availableEnd.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          label={t('common.active_after', 'Active after')}
          onChange={(e) => {
            if (e.target.value !== transmissionDateFrom) {
              setSearchFilters({ transmissionDateFrom: e.target.value })
            }
          }}
          onRemove={() => {
            if (transmissionDateFrom !== '') {
              setSearchFilters({ transmissionDateFrom: '' })
            }
          }}
        />
      </div>
      <div>
        <InputDate
          value={transmissionDateTo || ''}
          max={DEFAULT_WORKSPACE.availableEnd.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          label={t('common.active_before', 'Active Before')}
          onChange={(e) => {
            if (e.target.value !== transmissionDateTo) {
              setSearchFilters({ transmissionDateTo: e.target.value })
            }
          }}
          onRemove={() => {
            if (transmissionDateTo !== '') {
              setSearchFilters({ transmissionDateTo: '' })
            }
          }}
        />
      </div>
    </div>
  )
}

export default SearchAdvancedFilters
