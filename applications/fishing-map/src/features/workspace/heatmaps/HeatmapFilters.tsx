import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import MultiSelect, {
  MultiSelectOnChange,
  MultiSelectOption,
} from '@globalfishingwatch/ui-components/dist/multi-select'
import { getFlags, getFlagsByIds } from 'utils/flags'
import { UrlDataviewInstance } from 'types'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import styles from './HeatmapFilters.module.css'
import {
  getCommonGearTypesInDataview,
  getNotSupportedGearTypesDatasets,
  getSourcesOptionsInDataview,
  getSourcesSelectedInDataview,
} from './heatmaps.utils'

type FiltersProps = {
  dataview: UrlDataviewInstance
}

function Filters({ dataview }: FiltersProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const sourceOptions = getSourcesOptionsInDataview(dataview)
  const sourcesSelected = getSourcesSelectedInDataview(dataview)
  const gearTypeOptions = getCommonGearTypesInDataview(dataview)
  const gearTypeSelected = gearTypeOptions?.filter((geartype) =>
    dataview.config?.filters?.geartype?.includes(geartype.id)
  )
  const fishingFiltersOptions = getFlagsByIds(dataview.config?.filters?.flag || [])
  const flags = useMemo(getFlags, [])

  const datasetsWithoutgGeartype = getNotSupportedGearTypesDatasets(dataview)
  const onSelectSourceClick: MultiSelectOnChange = (source) => {
    const datasets = [...(dataview.config?.datasets || []), source.id]
    // We have to remove the geartype if it is not supported by the datasets selecion
    const gearTypeOptions = getCommonGearTypesInDataview({ ...dataview, datasets })
    const supportGearTypeFilter = gearTypeOptions.length > 0
    const filters = dataview.config?.filters ? { ...dataview.config.filters } : {}
    if (!supportGearTypeFilter && filters['geartype']) {
      delete filters['geartype']
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
  }

  const onRemoveFilterClick = (filterKey: string, selection: MultiSelectOption[]) => {
    const filterValue = selection?.length ? selection.map((f) => f.id) : null
    const filters = dataview.config?.filters || {}
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters: { ...filters, [filterKey]: filterValue } },
    })
  }

  const onCleanFilterClick = (filterKey: string) => {
    const filters = dataview.config?.filters ? { ...dataview.config.filters } : {}
    delete filters[filterKey]
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters },
    })
  }

  const disabledGearType = datasetsWithoutgGeartype && datasetsWithoutgGeartype.length > 0
  const disabledGearTypeTooltip = disabledGearType
    ? t('errors.notSupportedBy', {
        list: datasetsWithoutgGeartype?.map((d) => d.name).join(','),
        defaultValue: 'Not supported by',
      })
    : ''
  return (
    <Fragment>
      <MultiSelect
        label={t('layer.source_plural', 'Sources')}
        placeholder={getPlaceholderBySelections(sourcesSelected)}
        options={sourceOptions}
        selectedOptions={sourcesSelected}
        onSelect={onSelectSourceClick}
        onRemove={sourcesSelected?.length > 1 ? onRemoveSourceClick : undefined}
      />
      <MultiSelect
        label={t('layer.flag_state_plural', 'Flag States')}
        placeholder={getPlaceholderBySelections(fishingFiltersOptions)}
        options={flags}
        selectedOptions={fishingFiltersOptions}
        className={styles.multiSelect}
        onSelect={(selection) => onSelectFilterClick('flag', selection)}
        onRemove={(selection, rest) => onRemoveFilterClick('flag', rest)}
        onCleanClick={() => onCleanFilterClick('flag')}
      />
      <MultiSelect
        disabled={disabledGearType}
        disabledMsg={disabledGearTypeTooltip}
        label={t('layer.gearType_plural', 'Gear types')}
        placeholder={getPlaceholderBySelections(gearTypeSelected)}
        options={gearTypeOptions}
        selectedOptions={gearTypeSelected}
        className={styles.multiSelect}
        onSelect={(selection) => onSelectFilterClick('geartype', selection)}
        onRemove={(selection, rest) => onRemoveFilterClick('geartype', rest)}
        onCleanClick={() => onCleanFilterClick('geartype')}
      />
    </Fragment>
  )
}

export default Filters
