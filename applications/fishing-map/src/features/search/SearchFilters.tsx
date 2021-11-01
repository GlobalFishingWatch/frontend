import React, { useEffect, useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { MultiSelect, InputDate } from '@globalfishingwatch/ui-components'
import { Dataset } from '@globalfishingwatch/api-types'
import { getFlags } from 'utils/flags'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import { DEFAULT_WORKSPACE } from 'data/config'
import {
  getDatasetLabel,
  getFiltersBySchema,
  SchemaFieldDataview,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useSearchFiltersConnect } from './search.hook'
import styles from './SearchFilters.module.css'

type SearchFiltersProps = {
  datasets: Dataset[]
  className?: string
}
const schemaFilterIds: SupportedDatasetSchema[] = ['fleet', 'origin', 'target_species']

function SearchFilters({ datasets, className = '' }: SearchFiltersProps) {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const { searchFilters, setSearchFilters } = useSearchFiltersConnect()
  const { flag, sources, activeAfterDate, activeBeforeDate } = searchFilters

  const flagOptions = useMemo(getFlags, [])
  const sourceOptions = useMemo(() => {
    return datasets
      ?.sort((a, b) => a.name.localeCompare(b.name))
      .map((dataset) => ({
        id: dataset.id,
        label: getDatasetLabel(dataset),
      }))
  }, [datasets])

  useEffect(() => {
    if (activeAfterDate === undefined) {
      setSearchFilters({ activeAfterDate: start?.split('T')[0] })
    }
    if (activeBeforeDate === undefined) {
      setSearchFilters({ activeBeforeDate: end?.split('T')[0] })
    }
  }, [activeAfterDate, activeBeforeDate, setSearchFilters, start, end])

  const dataview = useMemo(
    () =>
      ({
        config: {
          datasets: sources?.map(({ id }) => id),
          filters: Object.fromEntries(
            schemaFilterIds.map((id) => [id, searchFilters[id]?.map((f) => f.id)])
          ),
        },
        datasets,
      } as SchemaFieldDataview),
    [datasets, searchFilters, sources]
  )

  const schemaFilters = schemaFilterIds.map((id) => getFiltersBySchema(dataview, id))

  return (
    <div className={cx(className)}>
      {sourceOptions && sourceOptions.length > 0 && (
        <MultiSelect
          label={t('layer.source_other', 'Sources')}
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
      {schemaFilters.map((schemaFilter) => {
        if (!schemaFilter.active) {
          return null
        }
        const { id, tooltip, disabled, options, optionsSelected } = schemaFilter
        return (
          <MultiSelect
            key={id}
            disabled={disabled}
            disabledMsg={tooltip}
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
          value={activeAfterDate}
          max={DEFAULT_WORKSPACE.availableEnd.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          label={t('common.active_after', 'Active after')}
          onChange={(e) => {
            if (e.target.value !== activeAfterDate) {
              setSearchFilters({ activeAfterDate: e.target.value })
            }
          }}
          onRemove={() => {
            if (activeAfterDate !== '') {
              setSearchFilters({ activeAfterDate: '' })
            }
          }}
        />
      </div>
      <div className={styles.row}>
        <InputDate
          value={activeBeforeDate}
          max={DEFAULT_WORKSPACE.availableEnd.slice(0, 10) as string}
          min={DEFAULT_WORKSPACE.availableStart.slice(0, 10) as string}
          label={t('common.active_before', 'Active Before')}
          onChange={(e) => {
            if (e.target.value !== activeBeforeDate) {
              setSearchFilters({ activeBeforeDate: e.target.value })
            }
          }}
          onRemove={() => {
            if (activeBeforeDate !== '') {
              setSearchFilters({ activeBeforeDate: '' })
            }
          }}
        />
      </div>
    </div>
  )
}

export default SearchFilters
