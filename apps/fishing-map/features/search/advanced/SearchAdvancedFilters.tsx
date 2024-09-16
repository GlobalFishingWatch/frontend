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
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import { AVAILABLE_START, AVAILABLE_END } from 'data/config'
import {
  getFiltersBySchema,
  SchemaFilter,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'
import { showSchemaFilter } from 'features/workspace/common/LayerSchemaFilter'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { selectAdvancedSearchDatasets } from 'features/search/search.selectors'
import {
  DEFAULT_VESSEL_IDENTITY_DATASET,
  DEFAULT_VESSEL_IDENTITY_ID,
} from 'features/vessel/vessel.config'
import { useSearchFiltersConnect, useSearchFiltersErrors } from 'features/search/search.hook'
import { VesselSearchState } from 'features/search/search.types'
import {
  ADVANCED_SEARCH_FIELDS,
  getSearchDataview,
  schemaFilterIds,
} from 'features/search/advanced/advanced-search.utils'
import styles from './SearchAdvancedFilters.module.css'

const FILTERS_WITH_SHARED_SELECTION_COMPATIBILITY = ['geartypes', 'shiptypes', 'flag']
const VMS_FILTERS_WITH_STRING_SEARCH = ['codMarinha', 'nationalId']

type ImcompatibleFilter = { id: keyof VesselSearchState; values: string[] }
type IncompatibleFilterSelection = {
  filter: keyof VesselSearchState
  incompatible: ImcompatibleFilter[]
}
const INCOMPATIBLE_FILTER_SELECTION: IncompatibleFilterSelection[] = [
  {
    filter: 'shiptypes',
    incompatible: [{ id: 'infoSource', values: [VesselIdentitySourceEnum.Registry] }],
  },
]

const getIncompatibleFiltersBySelection = ({ id, values }: ImcompatibleFilter) => {
  return INCOMPATIBLE_FILTER_SELECTION.flatMap(({ filter, incompatible }) =>
    incompatible.some((i) => i.id === id && i.values.some((v) => values.includes(v))) ? filter : []
  )
}

const isIncompatibleFilterBySelection = (
  schemaFilter: SchemaFilter,
  filters: VesselSearchState
) => {
  const { incompatible } =
    INCOMPATIBLE_FILTER_SELECTION.find(({ filter }) => filter === schemaFilter.id) ||
    ({} as IncompatibleFilterSelection)
  if (incompatible && incompatible?.length) {
    return incompatible.some(({ id, values }) =>
      values.some((v) => filters[id]?.includes(v as any))
    )
  }
  return false
}

function AdvancedFilterInputField({
  onChange,
  field,
}: {
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void
  field: keyof VesselSearchState
}) {
  const { t } = useTranslation()
  const searchFilterErrors = useSearchFiltersErrors()
  const { searchFilters } = useSearchFiltersConnect()
  const value = searchFilters[field] || ''
  const invalid = searchFilterErrors[field]

  return (
    <InputText
      onChange={onChange}
      id={field}
      invalid={invalid}
      invalidTooltip={
        invalid
          ? t('search.filterNotSupported', {
              defaultValue: 'One of your sources selected doesn’t support filtering by {{filter}}',
              filter: t(`vessel.${field}`, 'field').toLowerCase(),
            })
          : ''
      }
      value={value}
      label={t(`vessel.${field === 'ssvid' ? 'mmsi' : field}`, field)}
    />
  )
}

function SearchAdvancedFilters() {
  const { t } = useTranslation()
  const datasets = useSelector(selectAdvancedSearchDatasets)
  const { searchFilters, setSearchFilters } = useSearchFiltersConnect()
  const searchFilterErrors = useSearchFiltersErrors()

  const { sources, transmissionDateFrom, transmissionDateTo, infoSource } = searchFilters

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
    const isSharedSelectionSchema = FILTERS_WITH_SHARED_SELECTION_COMPATIBILITY.includes(id)
    return getFiltersBySchema(dataview, id as SupportedDatasetSchema, {
      ...(isSharedSelectionSchema && {
        schemaOrigin: infoSource || 'all',
        compatibilityOperation: 'some',
      }),
    })
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
      {ADVANCED_SEARCH_FIELDS.map((field) => (
        <AdvancedFilterInputField key={field} field={field} onChange={onInputChange} />
      ))}
      <Select
        label={t('vessel.infoSource')}
        placeholder={getPlaceholderBySelections({
          selection: infoSource,
          options: infoSourceOptions,
        })}
        options={infoSourceOptions}
        selectedOption={infoSourceOptions.find(({ id }) => id === infoSource)}
        onSelect={({ id }) => {
          const incompatibleFilters = getIncompatibleFiltersBySelection({
            id: 'infoSource',
            values: [id],
          })
          const incompatibleQuery = Object.fromEntries(
            incompatibleFilters.map((s) => [s, undefined])
          )
          setSearchFilters({ infoSource: id, geartypes: undefined, ...incompatibleQuery })

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
        if (VMS_FILTERS_WITH_STRING_SEARCH.includes(schemaFilter.id)) {
          if (
            schemaFilter.disabled ||
            isIncompatibleFilterBySelection(schemaFilter, searchFilters)
          ) {
            return null
          }
          return (
            <AdvancedFilterInputField
              key={schemaFilter.id}
              field={schemaFilter.id as keyof VesselSearchState}
              onChange={onInputChange}
            />
          )
        }
        if (
          !showSchemaFilter(schemaFilter) ||
          isIncompatibleFilterBySelection(schemaFilter, searchFilters)
        ) {
          return null
        }
        const { id, disabled, options, optionsSelected } = schemaFilter
        const translationKey = id === 'shiptypes' ? `gfw_${id}` : id
        return (
          <MultiSelect
            key={id}
            disabled={disabled}
            label={t(`vessel.${translationKey}` as any, translationKey)}
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
