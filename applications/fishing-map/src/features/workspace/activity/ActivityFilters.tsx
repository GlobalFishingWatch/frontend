import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import MultiSelect, {
  MultiSelectOnChange,
  MultiSelectOption,
} from '@globalfishingwatch/ui-components/dist/multi-select'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getFlags, getFlagsByIds } from 'utils/flags'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import {
  getFiltersBySchema,
  getCommonSchemaFieldsInDataview,
  isDataviewSchemaSupported,
} from 'features/datasets/datasets.utils'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'
import styles from './ActivityFilters.module.css'
import {
  areAllSourcesSelectedInDataview,
  getSourcesOptionsInDataview,
  getSourcesSelectedInDataview,
} from './activity.utils'

type ActivityFiltersProps = {
  dataview: UrlDataviewInstance
}

function ActivityFilters({ dataview }: ActivityFiltersProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const sourceOptions = getSourcesOptionsInDataview(dataview)
  // insert the "All" option only when more than one option available
  const allOption = { id: 'all', label: t('selects.allSelected', 'All') }
  const allSourceOptions = sourceOptions.length > 1 ? [allOption, ...sourceOptions] : sourceOptions
  const allSelected = areAllSourcesSelectedInDataview(dataview)
  const sourcesSelected = allSelected ? [allOption] : getSourcesSelectedInDataview(dataview)

  const flagOptions = getFlagsByIds(dataview.config?.filters?.flag || [])
  const flags = useMemo(getFlags, [])

  const flagFiltersSupported = isDataviewSchemaSupported(dataview, 'flag')
  const gearTypeFilters = getFiltersBySchema(dataview, 'geartype')
  const fleetFilters = getFiltersBySchema(dataview, 'fleet')
  const shiptypeFilters = getFiltersBySchema(dataview, 'shiptype')
  const originFilters = getFiltersBySchema(dataview, 'origin')
  const vesselFilters = getFiltersBySchema(dataview, 'vessel_type')
  const qfDectectionFilters = getFiltersBySchema(dataview, 'qf_detect')

  const onSelectSourceClick: MultiSelectOnChange = (source) => {
    let datasets: string[] = []
    if (source.id === allOption.id) {
      datasets = sourceOptions.map((s) => s.id)
    } else {
      datasets = allSelected ? [source.id] : [...(dataview.config?.datasets || []), source.id]
    }
    const filters = dataview.config?.filters ? { ...dataview.config.filters } : {}

    const newDataview = { ...dataview, config: { ...dataview.config, datasets } }
    if (filters['geartype']) {
      const newGeartypeOptions = getCommonSchemaFieldsInDataview(newDataview, 'geartype')
      const newGeartypeSelection = newGeartypeOptions?.filter((geartype) =>
        dataview.config?.filters?.geartype?.includes(geartype.id)
      )

      // We have to remove the geartype if it is not supported by the datasets selecion
      if (newGeartypeOptions.length === 0) {
        delete filters['geartype']
        // or keep only the options that every dataset have in common
      } else if (!newGeartypeSelection?.length !== dataview.config?.filters?.geartype?.length) {
        filters.geartype = newGeartypeSelection.map(({ id }) => id)
      }
    }

    if (filters['fleet']) {
      const newFleetOptions = getCommonSchemaFieldsInDataview(newDataview, 'fleet')
      const newFleetSelection = newFleetOptions?.filter((geartype) =>
        dataview.config?.filters?.geartype?.includes(geartype.id)
      )

      // We have to remove the geartype if it is not supported by the datasets selecion
      if (newFleetOptions.length === 0) {
        delete filters['fleet']
        // or keep only the options that every dataset have in common
      } else if (!newFleetSelection?.length !== dataview.config?.filters?.geartype?.length) {
        filters.fleet = newFleetSelection.map(({ id }) => id)
      }
    }
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        datasets,
        filters,
      },
    })
  }

  const onRemoveSourceClick: MultiSelectOnChange = (source) => {
    const datasets =
      dataview.config?.datasets?.filter((datasetId: string) => datasetId !== source.id) || null
    upsertDataviewInstance({
      id: dataview.id,
      config: { datasets },
    })
  }

  const onSelectFilterClick = (filterKey: string, selection: MultiSelectOption) => {
    const filterValues = [...(dataview.config?.filters?.[filterKey] || []), selection.id]
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        filters: {
          ...(dataview.config?.filters || {}),
          [filterKey]: filterValues,
        },
      },
    })
    uaEvent({
      category: 'Activity data',
      action: `Click on ${filterKey} filter`,
      label: getEventLabel([
        'select',
        getActivitySources(dataview),
        ...getActivityFilters({ [filterKey]: filterValues }),
      ]),
    })
  }

  const onRemoveFilterClick = (filterKey: string, selection: MultiSelectOption[]) => {
    const filterValue = selection?.length ? selection.map((f) => f.id) : null
    const filters = dataview.config?.filters || {}
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters: { ...filters, [filterKey]: filterValue } },
    })
    uaEvent({
      category: 'Activity data',
      action: `Click on ${filterKey} filter`,
      label: getEventLabel([
        'deselect',
        getActivitySources(dataview),
        ...getActivityFilters({ [filterKey]: filterValue ?? [] }),
      ]),
    })
  }

  const onCleanFilterClick = (filterKey: string) => {
    const filters = dataview.config?.filters ? { ...dataview.config.filters } : {}
    delete filters[filterKey]
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters },
    })
    uaEvent({
      category: 'Activity data',
      action: `Click on ${filterKey} filter`,
      label: getEventLabel(['clear', getActivitySources(dataview)]),
    })
  }

  return (
    <Fragment>
      {sourceOptions && sourceOptions?.length > 1 && (
        <MultiSelect
          label={t('layer.source_plural', 'Sources')}
          placeholder={getPlaceholderBySelections(sourcesSelected)}
          options={allSourceOptions}
          selectedOptions={sourcesSelected}
          onSelect={onSelectSourceClick}
          onRemove={sourcesSelected?.length > 1 ? onRemoveSourceClick : undefined}
        />
      )}
      {flagFiltersSupported && (
        <MultiSelect
          label={t('layer.flagState_plural', 'Flag States')}
          placeholder={getPlaceholderBySelections(flagOptions)}
          options={flags}
          selectedOptions={flagOptions}
          className={styles.multiSelect}
          onSelect={(selection) => onSelectFilterClick('flag', selection)}
          onRemove={(selection, rest) => onRemoveFilterClick('flag', rest)}
          onCleanClick={() => onCleanFilterClick('flag')}
        />
      )}
      {gearTypeFilters.active && (
        <MultiSelect
          disabled={gearTypeFilters.disabled}
          disabledMsg={gearTypeFilters.tooltip}
          label={t('layer.gearType_plural', 'Gear types')}
          placeholder={getPlaceholderBySelections(gearTypeFilters.optionsSelected)}
          options={gearTypeFilters.options}
          selectedOptions={gearTypeFilters.optionsSelected}
          className={styles.multiSelect}
          onSelect={(selection) => onSelectFilterClick('geartype', selection)}
          onRemove={(selection, rest) => onRemoveFilterClick('geartype', rest)}
          onCleanClick={() => onCleanFilterClick('geartype')}
        />
      )}
      {fleetFilters.active && (
        <MultiSelect
          disabled={fleetFilters.disabled}
          disabledMsg={fleetFilters.tooltip}
          label={t('vessel.fleet', 'Fleet')}
          placeholder={getPlaceholderBySelections(fleetFilters.optionsSelected)}
          options={fleetFilters.options}
          selectedOptions={fleetFilters.optionsSelected}
          className={styles.multiSelect}
          onSelect={(selection) => onSelectFilterClick('fleet', selection)}
          onRemove={(selection, rest) => onRemoveFilterClick('fleet', rest)}
          onCleanClick={() => onCleanFilterClick('fleet')}
        />
      )}
      {shiptypeFilters.active && (
        <MultiSelect
          disabled={shiptypeFilters.disabled}
          disabledMsg={shiptypeFilters.tooltip}
          label={t('vessel.shiptype', 'Ship type')}
          placeholder={getPlaceholderBySelections(shiptypeFilters.optionsSelected)}
          options={shiptypeFilters.options}
          selectedOptions={shiptypeFilters.optionsSelected}
          className={styles.multiSelect}
          onSelect={(selection) => onSelectFilterClick('shiptype', selection)}
          onRemove={(selection, rest) => onRemoveFilterClick('shiptype', rest)}
          onCleanClick={() => onCleanFilterClick('shiptype')}
        />
      )}
      {originFilters.active && (
        <MultiSelect
          disabled={originFilters.disabled}
          disabledMsg={originFilters.tooltip}
          label={t('vessel.origin', 'Origin')}
          placeholder={getPlaceholderBySelections(originFilters.optionsSelected)}
          options={originFilters.options}
          selectedOptions={originFilters.optionsSelected}
          className={styles.multiSelect}
          onSelect={(selection) => onSelectFilterClick('origin', selection)}
          onRemove={(selection, rest) => onRemoveFilterClick('origin', rest)}
          onCleanClick={() => onCleanFilterClick('origin')}
        />
      )}
      {vesselFilters.active && (
        <MultiSelect
          disabled={vesselFilters.disabled}
          disabledMsg={vesselFilters.tooltip}
          label={t('vessel.vesselType_plural', 'Vessel types')}
          placeholder={getPlaceholderBySelections(vesselFilters.optionsSelected)}
          options={vesselFilters.options}
          selectedOptions={vesselFilters.optionsSelected}
          className={styles.multiSelect}
          onSelect={(selection) => onSelectFilterClick('vessel_type', selection)}
          onRemove={(selection, rest) => onRemoveFilterClick('vessel_type', rest)}
          onCleanClick={() => onCleanFilterClick('vessel_type')}
        />
      )}
      {qfDectectionFilters.active && (
        <MultiSelect
          disabled={qfDectectionFilters.disabled}
          disabledMsg={qfDectectionFilters.tooltip}
          label={t('layer.qf', 'Quality Signal')}
          placeholder={getPlaceholderBySelections(qfDectectionFilters.optionsSelected)}
          options={qfDectectionFilters.options}
          selectedOptions={qfDectectionFilters.optionsSelected}
          className={styles.multiSelect}
          onSelect={(selection) => onSelectFilterClick('qf_detect', selection)}
          onRemove={(selection, rest) => onRemoveFilterClick('qf_detect', rest)}
          onCleanClick={() => onCleanFilterClick('qf_detect')}
        />
      )}
    </Fragment>
  )
}

export default ActivityFilters
