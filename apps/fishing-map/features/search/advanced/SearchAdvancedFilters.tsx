import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  MultiSelect,
  InputDate,
  InputText,
  Select,
  SelectOption,
} from '@globalfishingwatch/ui-components'
import { Dataset, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import { AVAILABLE_START, AVAILABLE_END } from 'data/config'
import {
  getFiltersBySchema,
  SchemaFieldDataview,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'
import { showSchemaFilter } from 'features/workspace/activity/ActivitySchemaFilter'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { selectAdvancedSearchDatasets } from 'features/search/search.selectors'
import {
  DEFAULT_VESSEL_IDENTITY_DATASET,
  DEFAULT_VESSEL_IDENTITY_ID,
} from 'features/vessel/vessel.config'
import { useSearchFiltersConnect } from 'features/search/search.hook'
import { VesselSearchState } from 'types'
import styles from './SearchAdvancedFilters.module.css'

const schemaFilterIds: (keyof VesselSearchState)[] = [
  'flag',
  'fleet',
  'origin',
  'geartypes',
  'shiptypes',
  'codMarinha',
  'targetSpecies',
]

const getSearchDataview = (
  datasets: Dataset[],
  searchFilters: VesselSearchState,
  sources?: string[]
): SchemaFieldDataview => {
  return {
    config: {
      datasets: sources?.map((id) => id),
      filters: Object.fromEntries(
        schemaFilterIds.map((id) => {
          const filters = searchFilters[id]
          if (Array.isArray(filters)) {
            return [id, filters?.map((f) => f)]
          }
          return [id, filters]
        })
      ),
    },
    datasets,
  }
}

function SearchAdvancedFilters() {
  const { t } = useTranslation()
  const datasets = useSelector(selectAdvancedSearchDatasets)
  const { searchFilters, setSearchFilters, searchFilterErrors } = useSearchFiltersConnect()
  const {
    sources,
    transmissionDateFrom,
    transmissionDateTo,
    imo,
    ssvid,
    callsign,
    owner,
    infoSource,
  } = searchFilters

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
        label: t(`vessel.infoSources.${VesselIdentitySourceEnum.Registry}` as string, 'Registry'),
      },
      {
        id: VesselIdentitySourceEnum.SelfReported,
        label: t(
          `vessel.infoSources.${VesselIdentitySourceEnum.SelfReported}` as string,
          'Self reported'
        ),
      },
    ],
    [t]
  )

  const dataview = useMemo(() => {
    return getSearchDataview(datasets, searchFilters, sources)
  }, [datasets, searchFilters, sources])

  const schemaFilters = schemaFilterIds.map((id) => {
    return getFiltersBySchema(dataview, id as SupportedDatasetSchema)
  })

  const onSourceSelect = (filter: any) => {
    const newSources = [...(sources || []), filter.id]
    const notCompatibleSchemaFilters = getIncompatibleFilters(newSources)
    setSearchFilters({ ...notCompatibleSchemaFilters, sources: newSources })
  }

  const getIncompatibleFilters = (sources: any) => {
    // Recalculates schemaFilters to validate a new source has valid selection
    // when not valid we need to remove the filter from the search
    const newDataview = getSearchDataview(datasets, searchFilters, sources)
    const newSchemaFilters = schemaFilterIds.map((id) => getFiltersBySchema(newDataview, id as any))
    const notCompatibleSchemaFilters = newSchemaFilters.flatMap(({ id, disabled }) => {
      return disabled && (searchFilters as any)[id] !== undefined ? id : []
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
      />
      <InputText
        onChange={onInputChange}
        id="imo"
        value={imo || ''}
        label={t('vessel.imo', 'IMO')}
      />
      <InputText
        onChange={onInputChange}
        id="callsign"
        value={callsign || ''}
        label={t('vessel.callsign', 'Callsign')}
      />
      <InputText
        onChange={onInputChange}
        id="owner"
        value={owner || ''}
        label={t('vessel.owner', 'Owner')}
      />
      <Select
        label={t('vessel.infoSource')}
        placeholder={getPlaceholderBySelections({
          selection: infoSource,
          options: infoSourceOptions,
        })}
        options={infoSourceOptions}
        selectedOption={infoSourceOptions.find(({ id }) => id === infoSource)}
        onSelect={({ id }) => {
          setSearchFilters({ infoSource: id })
          if (id === VesselIdentitySourceEnum.Registry) {
            // This is the only dataset with support for registry so far
            setSearchFilters({ sources: [DEFAULT_VESSEL_IDENTITY_ID] })
          } else if (
            infoSource === VesselIdentitySourceEnum.Registry &&
            sources?.length === 1 &&
            sources[0] === DEFAULT_VESSEL_IDENTITY_ID
          ) {
            setSearchFilters({ sources: undefined })
          }
        }}
        onRemove={() => {
          setSearchFilters({ infoSource: undefined })
          setSearchFilters({ sources: undefined })
        }}
        onCleanClick={() => {
          setSearchFilters({ infoSource: undefined })
          setSearchFilters({ sources: undefined })
        }}
      />
      {infoSource !== VesselIdentitySourceEnum.Registry &&
        sourceOptions &&
        sourceOptions.length > 0 && (
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
            placeholder={getPlaceholderBySelections({
              selection: optionsSelected.map(({ id }) => id),
              options,
            })}
            options={options}
            selectedOptions={optionsSelected}
            onSelect={(filter) => {
              setSearchFilters({
                [id]: [...((searchFilters as any)[id] || []), filter.id],
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
          value={transmissionDateTo || ''}
          max={AVAILABLE_END.slice(0, 10) as string}
          min={AVAILABLE_START.slice(0, 10) as string}
          label={t('common.active_after', 'Active after')}
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
      <div>
        <InputDate
          value={transmissionDateFrom || ''}
          max={AVAILABLE_END.slice(0, 10) as string}
          min={AVAILABLE_START.slice(0, 10) as string}
          label={t('common.active_before', 'Active Before')}
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
      <div className={styles.error}>
        {searchFilterErrors.date &&
          t(
            'search.endDateMustBeAfterStartDate',
            'The ACTIVE BEFORE date must come after the ACTIVE AFTER date'
          )}
      </div>
    </div>
  )
}

export default SearchAdvancedFilters
